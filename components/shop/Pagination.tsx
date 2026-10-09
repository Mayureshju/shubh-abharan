import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { pageItems } from "./pages";
import { shopHref, type ShopSearch } from "./query";

/**
 * Shop page links. Numbers from 768px; a phone gets previous, "Page n of N",
 * next, so the row never outgrows 390px. Plain links: works without script.
 */

const STEP =
  "inline-flex min-h-11 items-center gap-2 text-caption uppercase tracking-[0.22em] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

export function Pagination({
  query,
  page,
  pageCount,
}: {
  query: ShopSearch;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const previous = (
    <>
      <span className="inline-flex rotate-180" aria-hidden="true">
        <ArrowIcon />
      </span>
      Previous
    </>
  );
  const next = (
    <>
      Next
      <span className="inline-flex" aria-hidden="true">
        <ArrowIcon />
      </span>
    </>
  );

  return (
    <nav
      aria-label="Pagination"
      className="mt-tight grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-line pt-6"
    >
      <p>
        {page > 1 ? (
          <Link href={shopHref(query, page - 1)} rel="prev" className={`${STEP} hover:text-accent`}>
            {previous}
          </Link>
        ) : (
          <span aria-disabled="true" className={`${STEP} text-muted opacity-50`}>
            {previous}
          </span>
        )}
      </p>

      <p className="whitespace-nowrap text-caption uppercase tracking-[0.22em] text-muted tabular-nums md:hidden">
        {page} of {pageCount}
      </p>

      <ol className="hidden items-center gap-1 md:flex">
        {pageItems(page, pageCount).map((item, index) =>
          item === null ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-2 text-muted">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={shopHref(query, item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={
                  "grid min-h-11 min-w-11 place-items-center text-body tabular-nums " +
                  "underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 " +
                  (item === page ? "underline decoration-accent" : "text-muted hover:text-on-surface")
                }
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ol>

      <p className="justify-self-end">
        {page < pageCount ? (
          <Link href={shopHref(query, page + 1)} rel="next" className={`${STEP} hover:text-accent`}>
            {next}
          </Link>
        ) : (
          <span aria-disabled="true" className={`${STEP} text-muted opacity-50`}>
            {next}
          </span>
        )}
      </p>
    </nav>
  );
}
