/**
 * Stub. The scaffold's placeholder page was removed by establish-brand-system,
 * which builds the design system only — no storefront pages are in its scope.
 * The homepage is delivered by the `build-homepage` change.
 *
 * The design system's acceptance surface is /specimen.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col justify-center page-gutter py-breath">
      <p className="max-w-measure text-caption uppercase text-muted">
        Design system established. No storefront pages are in scope for this
        change.
      </p>
      <p className="mt-tight max-w-measure text-body">
        The token set and component states are rendered at{" "}
        <a className="underline underline-offset-4 hover:no-underline" href="/specimen">
          /specimen
        </a>
        .
      </p>
    </main>
  );
}
