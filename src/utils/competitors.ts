// Competitors approved for public comparison pages (/alternatives/, /vs/).
//
// competitors.json also carries seed entries for unrelated tools (AI coding
// agents like Cursor, Claude Code, OpenClaw, Claude Cowork) that are NOT Beton
// competitors — a "Beton vs Cursor" page would be nonsense. Pages are generated
// only for slugs in this allowlist, so adding a real competitor is one line and
// shipping a bogus one is impossible.
export const LAUNCHED_COMPETITORS = [
  'pocus',
  'madkudu',
  'common-room',
  'breadcrumbs',
  'clay',
  'excel-google-sheets',
];

export function isLaunchedCompetitor(slug: string): boolean {
  return LAUNCHED_COMPETITORS.includes(slug);
}

// Filter a competitors collection down to the launched set.
export function launchedOnly<T extends { data: { slug: string } }>(entries: T[]): T[] {
  return entries.filter((e) => isLaunchedCompetitor(e.data.slug));
}
