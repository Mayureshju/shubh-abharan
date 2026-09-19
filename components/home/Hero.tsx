import { brand, resolve } from "@/lib/brand";
import { HERO_SLIDE_PLATES } from "./plates";
import { HeroSlider, type HeroSlideView } from "./HeroSlider";

/**
 * Server shell. Builds slide views from the brand record and the editorial
 * plates, then hands them to the Motion island. Slide 0 keeps the CSS stagger
 * and is the only `text-display` heading on the hero.
 */

export function Hero() {
  const slides: HeroSlideView[] = brand.heroSlides.map((slide, index) => ({
    id: `${slide.plate}-${index}`,
    plate: HERO_SLIDE_PLATES[slide.plate],
    eyebrow: resolve(slide.eyebrow, "hero eyebrow"),
    heading:
      index === 0
        ? resolve(brand.name, "brand name")
        : resolve(slide.heading, "hero heading"),
    brandHeading: index === 0,
    support: resolve(slide.support, "hero support"),
    ctaLabel: resolve(slide.ctaLabel, "hero action"),
    ctaHref: slide.ctaHref,
  }));

  return (
    <section className="page-gutter pt-tight">
      <h1 className="sr-only">{resolve(brand.name, "brand name")}</h1>
      <HeroSlider slides={slides} />
    </section>
  );
}
