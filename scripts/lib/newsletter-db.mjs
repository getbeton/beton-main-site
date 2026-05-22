/**
 * newsletter-db.mjs — persistent newsletter send tracking in the beton-gtm Supabase.
 *
 * Why this exists: the send scripts had no idempotency guard. On 2026-05-21 the
 * "how we run our newsletter" blast was run twice ~54s apart and ~88 subscribers
 * got two copies. This module makes sends idempotent: every recipient is *claimed*
 * (an atomic insert) BEFORE the email goes to Resend, so a second/overlapping run
 * can never re-send to someone already claimed.
 *
 * Project: beton-gtm-system (amygtwoqujluepibcnfs).
 * Tables:  newsletters, newsletter_sends, newsletter_engagement.
 *
 * Config (env, or beton-marketing-site/.env):
 *   SUPABASE_GTM_URL              default https://amygtwoqujluepibcnfs.supabase.co
 *   SUPABASE_GTM_SERVICE_ROLE_KEY required — service_role key (bypasses RLS; server-side only)
 *
 * If the key is absent, makeNewsletterDb() returns null and callers should refuse
 * to send (an unguarded send is exactly the failure mode this prevents).
 */

import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://amygtwoqujluepibcnfs.supabase.co';

/**
 * @returns {NewsletterDb|null} null when the service key is not configured.
 */
export function makeNewsletterDb({ url, serviceKey } = {}) {
  const SUPABASE_URL = url || process.env.SUPABASE_GTM_URL || DEFAULT_URL;
  const SERVICE_KEY =
    serviceKey ||
    process.env.SUPABASE_GTM_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_GTM_SERVICE_KEY; // tolerate either name

  if (!SERVICE_KEY) return null;

  const client = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return new NewsletterDb(client);
}

class NewsletterDb {
  constructor(client) {
    this.client = client;
  }

  /**
   * Idempotently create/fetch the newsletter row for a campaign. Keyed on slug.
   * @returns {Promise<{id:string, slug:string, status:string}>}
   */
  async upsertNewsletter({ slug, subject, blogUrl = null, audienceId = null, scheduledAt = null, meta = {} }) {
    if (!slug || !subject) throw new Error('upsertNewsletter: slug and subject are required');
    const { data, error } = await this.client
      .from('newsletters')
      .upsert(
        {
          slug,
          subject,
          blog_url: blogUrl,
          audience_id: audienceId,
          scheduled_at: scheduledAt,
          meta,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select('id, slug, status')
      .single();
    if (error) throw new Error(`upsertNewsletter failed: ${error.message}`);
    return data;
  }

  /**
   * Atomically claim a recipient for this newsletter. Returns true if THIS call
   * created the claim (i.e. you should send), false if it was already claimed by
   * an earlier/concurrent run (i.e. skip — do not re-send).
   * @returns {Promise<boolean>}
   */
  async claimRecipient(newsletterId, email, scheduledAt = null) {
    const { data, error } = await this.client.rpc('claim_newsletter_recipient', {
      p_newsletter_id: newsletterId,
      p_email: email,
      p_scheduled_at: scheduledAt,
    });
    if (error) throw new Error(`claimRecipient failed for ${email}: ${error.message}`);
    return data === true;
  }

  /** Mark a claimed recipient as sent and record the Resend email id. */
  async markSent(newsletterId, email, resendEmailId = null) {
    const { error } = await this.client
      .from('newsletter_sends')
      .update({
        status: 'sent',
        resend_email_id: resendEmailId,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('newsletter_id', newsletterId)
      .eq('email_norm', email.trim().toLowerCase());
    if (error) throw new Error(`markSent failed for ${email}: ${error.message}`);
  }

  /** Mark a claimed recipient as failed (records the error for retry/debugging). */
  async markFailed(newsletterId, email, errorMsg = '') {
    const { error } = await this.client
      .from('newsletter_sends')
      .update({
        status: 'failed',
        error: String(errorMsg).slice(0, 1000),
        updated_at: new Date().toISOString(),
      })
      .eq('newsletter_id', newsletterId)
      .eq('email_norm', email.trim().toLowerCase());
    if (error) throw new Error(`markFailed failed for ${email}: ${error.message}`);
  }

  /** Update overall newsletter status (draft | sending | sent). */
  async setNewsletterStatus(newsletterId, status, { sentAt = null } = {}) {
    const patch = { status, updated_at: new Date().toISOString() };
    if (sentAt) patch.sent_at = sentAt;
    const { error } = await this.client.from('newsletters').update(patch).eq('id', newsletterId);
    if (error) throw new Error(`setNewsletterStatus failed: ${error.message}`);
  }

  /** How many recipients are already sent/claimed for this newsletter. */
  async sendStats(newsletterId) {
    const { data, error } = await this.client
      .from('newsletter_sends')
      .select('status')
      .eq('newsletter_id', newsletterId);
    if (error) throw new Error(`sendStats failed: ${error.message}`);
    const out = { sending: 0, sent: 0, failed: 0, total: data.length };
    for (const r of data) out[r.status] = (out[r.status] || 0) + 1;
    return out;
  }

  /**
   * Upsert engagement rows (opens/clicks) for a newsletter. Each row:
   *   { email, opens, clicks, first_open, last_open, first_click, last_click }
   */
  async upsertEngagement(newsletterId, rows) {
    if (!rows.length) return 0;
    const payload = rows.map((r) => ({
      newsletter_id: newsletterId,
      email: r.email,
      opens: r.opens ?? 0,
      clicks: r.clicks ?? 0,
      first_open: r.first_open ?? null,
      last_open: r.last_open ?? null,
      first_click: r.first_click ?? null,
      last_click: r.last_click ?? null,
      synced_at: new Date().toISOString(),
    }));
    const { error } = await this.client
      .from('newsletter_engagement')
      .upsert(payload, { onConflict: 'newsletter_id,email_norm' });
    if (error) throw new Error(`upsertEngagement failed: ${error.message}`);
    return payload.length;
  }
}
