import { Hero } from "@/components/home/Hero";
import { Types } from "@/components/home/Types";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Occasions } from "@/components/home/Occasions";
import { Collection } from "@/components/home/Collection";
import { Featured } from "@/components/home/Featured";
import { Reasons } from "@/components/home/Reasons";
import { Journal } from "@/components/home/Journal";
import { Statement } from "@/components/home/Statement";

/**
 * Merchandising homepage.
 *
 *   Hero         → Types        normal
 *   Types        → Arrivals     tight
 *   Arrivals     → Occasions    normal
 *   Occasions    → Collection   tight
 *   Collection   → Featured     normal
 *   Featured     → Reasons      normal
 *   Reasons      → Journal      tight
 *   Journal      → Statement    normal
 *   Statement    → footer       breath    (fixed by SiteFooter)
 *
 * Two `tight` joins, no two `breath` joins adjacent.
 *
 * Header, main landmark and footer come from the root layout.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Types className="mt-normal" />
      <NewArrivals className="mt-tight" />
      <Occasions className="mt-normal" />
      <Collection className="mt-tight" />
      <Featured className="mt-normal" />
      <Reasons className="mt-normal" />
      <Journal className="mt-tight" />
      <Statement className="mt-normal" />
    </>
  );
}
