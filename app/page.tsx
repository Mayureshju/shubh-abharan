import { Hero } from "@/components/home/Hero";
import { Types } from "@/components/home/Types";
import { Collection } from "@/components/home/Collection";
import { Reasons } from "@/components/home/Reasons";
import { Statement } from "@/components/home/Statement";

/**
 * Five mood-board sections.
 *
 *   Hero       → Types        normal
 *   Types      → Collection   tight
 *   Collection → Reasons      normal
 *   Reasons    → Statement    normal
 *   Statement  → footer       breath    (fixed by SiteFooter)
 *
 * One `tight` join, no two `breath` joins adjacent.
 *
 * Header, main landmark and footer come from the root layout.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Types className="mt-normal" />
      <Collection className="mt-tight" />
      <Reasons className="mt-normal" />
      <Statement className="mt-normal" />
    </>
  );
}
