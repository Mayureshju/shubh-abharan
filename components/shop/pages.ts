/** Shop page size and the page-number window. No imports, so the check script can load it. */

export const PAGE_SIZE = 12;

/** First, last, and the current page's neighbours; `null` marks a gap. */
export function pageItems(current: number, count: number): (number | null)[] {
  const keep = new Set([1, count, current - 1, current, current + 1]);
  const items: (number | null)[] = [];
  let previous = 0;
  for (let page = 1; page <= count; page++) {
    if (!keep.has(page)) continue;
    if (page - previous > 1) items.push(null);
    items.push(page);
    previous = page;
  }
  return items;
}
