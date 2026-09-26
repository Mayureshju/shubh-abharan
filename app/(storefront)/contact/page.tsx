import type { Metadata } from "next";
import { Plate } from "@/components/editorial/Plate";
import { ContactForm } from "@/components/contact/ContactForm";
import { CAMPAIGN_PLATE } from "@/components/home/plates";
import { brand, isSupplied, resolve } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const to = isSupplied(brand.contactEmail) ? brand.contactEmail : null;

  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Correspondence</p>
      <h1 className="mt-3 text-title">Contact</h1>

      <div className="mt-tight md:grid md:grid-cols-12 md:gap-12 lg:gap-16">
        <div className="md:col-span-5">
          <Plate {...CAMPAIGN_PLATE} sizes="(min-width: 768px) 40vw, 100vw" />
        </div>

        <div className="mt-tight md:col-span-7 md:mt-0">
          <p className="text-body">{resolve(brand.contactEmail, "contact email")}</p>
          {isSupplied(brand.contactAddress) ? (
            <p className="mt-3 max-w-measure text-body text-muted">{brand.contactAddress}</p>
          ) : null}

          <div className="mt-tight">
            <ContactForm to={to} />
          </div>
        </div>
      </div>
    </section>
  );
}
