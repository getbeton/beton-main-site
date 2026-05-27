#!/usr/bin/env bash
# Vercel "Ignored Build Step" — skips a production build (and the Vercel build
# minutes it would burn) when a commit touches ONLY non-build files: agent
# config, markdown notes, and docs. Saves build time at zero extra Vercel spend.
#
# Wire it once per project: Vercel → Project → Settings → Git →
#   "Ignored Build Step" → Command:  bash scripts/vercel-ignore-build.sh
#
# Vercel convention: exit 0 = SKIP the build, exit 1 = PROCEED with the build.
# So we exit 0 (skip) only when the diff outside the excluded paths is empty.

set -euo pipefail

# First deploy / no parent commit → always build.
if ! git rev-parse "HEAD^" >/dev/null 2>&1; then
  echo "[ignore-build] no parent commit — building."
  exit 1
fi

# Did anything outside the excluded (non-build) paths change since the last commit?
if git diff --quiet "HEAD^" HEAD -- . \
    ':(exclude).claude/**' \
    ':(exclude)docs/**' \
    ':(exclude)*.md' \
    ':(exclude)README*'; then
  echo "[ignore-build] only docs/agent/config changed — skipping build."
  exit 0
fi

echo "[ignore-build] build-relevant files changed — building."
exit 1
