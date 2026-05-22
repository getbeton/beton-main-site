#!/usr/bin/env python3
"""newsletter_engagement_sync.py — sync newsletter opens/clicks from PostHog into
the beton-gtm Supabase (newsletter_engagement). Runs on the VM (daily cron).

For each newsletter in public.newsletters, query PostHog for per-recipient opens
and clicks (newsletter_opened / newsletter_link_clicked, keyed by campaign=slug),
then replace that newsletter's engagement rows. Idempotent: delete + re-insert.

HTTP goes through curl (Resend/PostHog/Supabase sit behind Cloudflare, which
1010-blocks python-urllib's default user agent).

Creds (VM integration files, override via env):
  Supabase: ~/.openclaw/workspace/integrations/supabase_gtm.json
            -> url + (service_role_key | service_key | key)   [env: SUPABASE_GTM_URL / SUPABASE_GTM_SERVICE_ROLE_KEY]
  PostHog:  ~/.openclaw/workspace/integrations/posthog.json
            -> (personal_api_key | api_key | key) + project_id [env: POSTHOG_API_KEY / POSTHOG_PROJECT_ID]
"""
import json, os, subprocess, sys, datetime, pathlib

INTEG = pathlib.Path.home() / ".openclaw/workspace/integrations"
SUPABASE_DEFAULT_URL = "https://amygtwoqujluepibcnfs.supabase.co"
POSTHOG_HOST = "https://us.posthog.com"
POSTHOG_DEFAULT_PROJECT = "225773"
SINCE_DAYS = int(os.environ.get("SYNC_SINCE_DAYS", "0"))  # 0 = use each newsletter's sent_at


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


def curl(method, url, headers, body=None):
    cmd = ["curl", "-s", "-X", method, url]
    for k, v in headers.items():
        cmd += ["-H", f"{k}: {v}"]
    if body is not None:
        cmd += ["-d", body]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    return out


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
        sys.exit(1)

    sb_headers = {"apikey": SB_KEY, "Authorization": f"Bearer {SB_KEY}", "Content-Type": "application/json"}

    # 1. newsletters to sync
    nl = json.loads(curl("GET", f"{SB_URL}/rest/v1/newsletters?select=id,slug,sent_at", sb_headers) or "[]")
    if not isinstance(nl, list):
        print("ERROR: unexpected newsletters response:", str(nl)[:300], file=sys.stderr)
        sys.exit(1)
    print(f"newsletters to sync: {len(nl)}")

    total_rows = 0
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
        ph_headers = {"Authorization": f"Bearer {PH_KEY}", "Content-Type": "application/json"}
        resp = curl("POST", f"{POSTHOG_HOST}/api/projects/{PH_PROJECT}/query/", ph_headers, ph_body)
        try:
            data = json.loads(resp)
            results = data.get("results", [])
        except Exception:
            print(f"  {slug}: PostHog query failed: {resp[:200]}", file=sys.stderr)
            continue

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

        # replace this newsletter's engagement rows (idempotent)
        curl("DELETE", f"{SB_URL}/rest/v1/newsletter_engagement?newsletter_id=eq.{nid}", sb_headers)
        if rows:
            ins = curl("POST", f"{SB_URL}/rest/v1/newsletter_engagement",
                       {**sb_headers, "Prefer": "return=minimal"}, json.dumps(rows))
            if ins.strip():  # non-empty body on insert == error
                print(f"  {slug}: insert error: {ins[:200]}", file=sys.stderr)
                continue
        total_rows += len(rows)
        print(f"  {slug}: {len(rows)} engaged recipients")

    print(f"done. {total_rows} engagement rows across {len(nl)} newsletters")


if __name__ == "__main__":
    main()
