#!/usr/bin/env python3
"""newsletter_engagement_sync.py — sync newsletter opens/clicks from PostHog into
the beton-gtm Supabase (newsletter_engagement). Runs on the VM (daily cron).

For each newsletter in public.newsletters, query PostHog for per-recipient opens
and clicks (newsletter_opened / newsletter_link_clicked, keyed by campaign=slug),
then replace that newsletter's engagement rows. Idempotent: delete + re-insert.

HTTP goes through curl (Resend/PostHog/Supabase sit behind Cloudflare, which
1010-blocks python-urllib's default user agent).

SAFETY GUARDS (added 2026-06-18 after a P0 silent-zero regression):
  - A PostHog response that lacks a "results" key (auth/permission error such as
    401/403, which still returns valid JSON) is treated as a HARD FAILURE for that
    newsletter, NOT as "zero engaged recipients". We do NOT delete existing rows
    in that case.
  - Before overwriting a newsletter's rows, we read its current Supabase row count.
    If PostHog returns 0 rows but the table currently has >0 rows for it, we treat
    that as a suspicious regression and SKIP the destructive delete (keep old data),
    unless ALLOW_ZERO_OVERWRITE=1 is set (e.g. a newsletter genuinely had its events
    purged). This prevents silently wiping good data with zeros.
  - At the end, if ANY newsletter failed PostHog auth, or if the run would have
    zeroed out a table that previously held data, the script exits non-zero with a
    loud ERROR and (best-effort) fires a Telegram alert via scripts/notify.py.

Creds (VM integration files, override via env):
  Supabase: ~/.openclaw/workspace/integrations/supabase_gtm.json
            -> url + (service_role_key | service_key | key)   [env: SUPABASE_GTM_URL / SUPABASE_GTM_SERVICE_ROLE_KEY]
  PostHog:  ~/.openclaw/workspace/integrations/posthog.json
            -> (personal_api_key | api_key | key) + project_id [env: POSTHOG_API_KEY / POSTHOG_PROJECT_ID]
            NOTE: the PostHog /query/ endpoint requires a *personal* API key
            (phx_...) with `query:read` scope. Project API keys (phc_...) WILL 401/403.
"""
import json, os, subprocess, sys, datetime, pathlib

INTEG = pathlib.Path.home() / ".openclaw/workspace/integrations"
SUPABASE_DEFAULT_URL = "https://amygtwoqujluepibcnfs.supabase.co"
POSTHOG_HOST = "https://us.posthog.com"
POSTHOG_DEFAULT_PROJECT = "225773"
SINCE_DAYS = int(os.environ.get("SYNC_SINCE_DAYS", "0"))  # 0 = use each newsletter's sent_at
ALLOW_ZERO_OVERWRITE = os.environ.get("ALLOW_ZERO_OVERWRITE", "") in ("1", "true", "yes")
NOTIFY = pathlib.Path(__file__).resolve().parent / "notify.py"


def load_json(path):
    try:
        return json.load(open(path))
    except Exception:
        return {}


def pick(d, *keys):
    for k in keys:
        if d.get(k):
            return d[k]
    return None


def curl(method, url, headers, body=None, dump_headers=False):
    cmd = ["curl", "-s", "-X", method, url]
    if dump_headers:
        cmd += ["-D", "-", "-o", "/dev/null"]
    for k, v in headers.items():
        cmd += ["-H", f"{k}: {v}"]
    if body is not None:
        cmd += ["-d", body]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    return out


def supabase_count(sb_url, sb_headers, nid):
    """Return current newsletter_engagement row count for a newsletter id (or None on error)."""
    hdr = {**sb_headers, "Prefer": "count=exact", "Range": "0-0"}
    out = curl("GET", f"{sb_url}/rest/v1/newsletter_engagement?select=newsletter_id&newsletter_id=eq.{nid}",
               hdr, dump_headers=True)
    for line in out.splitlines():
        if line.lower().startswith("content-range:"):
            # format: content-range: 0-0/<total>  (or */<total>)
            try:
                return int(line.split("/")[-1].strip())
            except Exception:
                return None
    return None


def alert(title, detail):
    """Best-effort Telegram alert via notify.py; never raises."""
    try:
        if NOTIFY.exists():
            subprocess.run([sys.executable, str(NOTIFY), "error", title, detail],
                           capture_output=True, text=True, timeout=30)
    except Exception:
        pass


def main():
    sb = load_json(INTEG / "supabase_gtm.json")
    ph = load_json(INTEG / "posthog.json")

    SB_URL = os.environ.get("SUPABASE_GTM_URL") or sb.get("url") or SUPABASE_DEFAULT_URL
    SB_KEY = os.environ.get("SUPABASE_GTM_SERVICE_ROLE_KEY") or pick(sb, "service_role_key", "service_key", "key", "anon_key")
    PH_KEY = os.environ.get("POSTHOG_API_KEY") or pick(ph, "personal_api_key", "api_key", "key", "personal_api_token")
    PH_PROJECT = os.environ.get("POSTHOG_PROJECT_ID") or str(ph.get("project_id") or POSTHOG_DEFAULT_PROJECT)

    missing = [n for n, v in [("Supabase service key", SB_KEY), ("PostHog API key", PH_KEY)] if not v]
    if missing:
        print("ERROR: missing creds:", ", ".join(missing), file=sys.stderr)
        alert("Newsletter engagement sync", "Missing creds: " + ", ".join(missing))
        sys.exit(1)

    sb_headers = {"apikey": SB_KEY, "Authorization": f"Bearer {SB_KEY}", "Content-Type": "application/json"}
    ph_headers = {"Authorization": f"Bearer {PH_KEY}", "Content-Type": "application/json"}

    # 1. newsletters to sync
    nl = json.loads(curl("GET", f"{SB_URL}/rest/v1/newsletters?select=id,slug,sent_at", sb_headers) or "[]")
    if not isinstance(nl, list):
        print("ERROR: unexpected newsletters response:", str(nl)[:300], file=sys.stderr)
        alert("Newsletter engagement sync", "Unexpected newsletters response from Supabase")
        sys.exit(1)
    print(f"newsletters to sync: {len(nl)}")

    total_rows = 0
    auth_failures = []      # slugs where PostHog returned an auth/permission error
    protected = []          # slugs where 0 PostHog rows but DB had data -> kept old rows
    insert_failures = []    # slugs where Supabase insert errored

    for n in nl:
        slug, nid = n["slug"], n["id"]
        if SINCE_DAYS > 0:
            since = (datetime.datetime.utcnow() - datetime.timedelta(days=SINCE_DAYS)).strftime("%Y-%m-%d")
        else:
            since = (n.get("sent_at") or "2026-01-01")[:10]
        hql = (
            "SELECT distinct_id AS email, "
            "countIf(event='newsletter_opened') AS opens, "
            "countIf(event='newsletter_link_clicked') AS clicks, "
            "minIf(timestamp, event='newsletter_opened') AS first_open, "
            "maxIf(timestamp, event='newsletter_opened') AS last_open, "
            "minIf(timestamp, event='newsletter_link_clicked') AS first_click, "
            "maxIf(timestamp, event='newsletter_link_clicked') AS last_click "
            "FROM events WHERE event IN ('newsletter_opened','newsletter_link_clicked') "
            f"AND timestamp >= '{since}' AND properties.campaign = '{slug}' "
            "GROUP BY email LIMIT 1000"
        )
        ph_body = json.dumps({"query": {"kind": "HogQLQuery", "query": hql}})
        resp = curl("POST", f"{POSTHOG_HOST}/api/projects/{PH_PROJECT}/query/", ph_headers, ph_body)
        try:
            data = json.loads(resp)
        except Exception:
            print(f"  {slug}: ERROR PostHog returned non-JSON (skipping, rows untouched): {resp[:200]}", file=sys.stderr)
            auth_failures.append(slug)
            continue

        # GUARD 1: a successful query has a "results" key. Anything else (401/403/500,
        # which PostHog returns as valid JSON like {"type":"authentication_error",...})
        # is a HARD FAILURE -- do NOT touch existing rows.
        if not isinstance(data, dict) or "results" not in data:
            err = data.get("detail") or data.get("type") or str(data)[:200] if isinstance(data, dict) else str(data)[:200]
            print(f"  {slug}: ERROR PostHog query error, no results key (skipping, rows untouched): {err}",
                  file=sys.stderr)
            auth_failures.append(slug)
            continue

        results = data.get("results") or []

        def ts(v):
            # ClickHouse minIf/maxIf over no matching rows yields epoch 1970, not null
            if not v:
                return None
            s = str(v)
            return None if s.startswith("1970") else s

        rows = []
        for r in results:
            email = (r[0] or "").strip().lower()
            if not email:
                continue
            opens, clicks = int(r[1] or 0), int(r[2] or 0)
            rows.append({
                "newsletter_id": nid, "email": email,
                "opens": opens, "clicks": clicks,
                "first_open": ts(r[3]) if opens else None,
                "last_open": ts(r[4]) if opens else None,
                "first_click": ts(r[5]) if clicks else None,
                "last_click": ts(r[6]) if clicks else None,
            })

        # GUARD 2: don't overwrite existing non-zero data with zeros. If PostHog
        # returned 0 rows but the table currently holds rows for this newsletter,
        # this is almost always a transient/auth/data issue -- keep the old rows.
        if not rows:
            existing = supabase_count(SB_URL, sb_headers, nid)
            if existing and existing > 0 and not ALLOW_ZERO_OVERWRITE:
                print(f"  {slug}: WARNING PostHog returned 0 rows but DB has {existing} "
                      f"(keeping old rows; set ALLOW_ZERO_OVERWRITE=1 to force).", file=sys.stderr)
                protected.append(slug)
                total_rows += existing  # count what's still there
                continue

        # replace this newsletter's engagement rows (idempotent)
        curl("DELETE", f"{SB_URL}/rest/v1/newsletter_engagement?newsletter_id=eq.{nid}", sb_headers)
        if rows:
            ins = curl("POST", f"{SB_URL}/rest/v1/newsletter_engagement",
                       {**sb_headers, "Prefer": "return=minimal"}, json.dumps(rows))
            if ins.strip():  # non-empty body on insert == error
                print(f"  {slug}: insert error: {ins[:200]}", file=sys.stderr)
                insert_failures.append(slug)
                continue
        total_rows += len(rows)
        print(f"  {slug}: {len(rows)} engaged recipients")

    print(f"done. {total_rows} engagement rows across {len(nl)} newsletters")

    # GUARD 3: loud, non-zero exit if anything went wrong, with a Telegram alert.
    problems = []
    if auth_failures:
        problems.append(f"PostHog auth/query error on {len(auth_failures)} newsletter(s): "
                        + ", ".join(auth_failures[:5]) + ("..." if len(auth_failures) > 5 else ""))
    if insert_failures:
        problems.append(f"Supabase insert error on {len(insert_failures)} newsletter(s): "
                        + ", ".join(insert_failures[:5]))
    if protected:
        problems.append(f"Protected {len(protected)} newsletter(s) from zero-overwrite: "
                        + ", ".join(protected[:5]))

    if problems:
        msg = "; ".join(problems)
        print("ERROR: " + msg, file=sys.stderr)
        if auth_failures:
            print("ERROR: likely the PostHog personal API key (phx_) is invalid/revoked or "
                  "missing the query:read scope. Re-mint it and update posthog.json "
                  "(personal_api_key) on the VM.", file=sys.stderr)
        alert("Newsletter engagement sync FAILED", msg)
        sys.exit(1)


if __name__ == "__main__":
    main()
