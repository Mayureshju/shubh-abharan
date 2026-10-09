import type { Metadata } from "next";
import { Plate } from "@/components/editorial/Plate";
import { Reveal } from "@/components/primitives/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { CAMPAIGN_PLATE } from "@/components/home/plates";
import { brand, isSupplied, placeholder } from "@/lib/brand";

export const metadata: Metadata = { title: "Contact" };

/**
 *   Masthead → Form     tight
 *   Form     → footer   breath    (fixed by SiteFooter)
 *
 * Email is structural and placeholds while unsupplied (storefront/contact).
 * Phone, WhatsApp, social and address are optional and omit themselves. Values
 * are links in body type rather than `inline` buttons, which set caption
 * capitals — wrong for an email address.
 */

const CHANNEL_LINK =
  "inline-flex min-h-[44px] items-center break-all underline decoration-gold underline-offset-4 hover:no-underline";

interface Channel {
  readonly term: string;
  readonly value: string;
  readonly href: string | null;
}

function channels(email: string | null): Channel[] {
  const list: Channel[] = [
    {
      term: "Email",
      value: email ?? placeholder("contact email"),
      href: email ? `mailto:${email}` : null,
    },
  ];
  if (isSupplied(brand.contactPhone)) {
    list.push({
      term: "Phone",
      value: brand.contactPhone,
      href: `tel:${brand.contactPhone.replace(/[^\d+]/g, "")}`,
    });
  }
  if (isSupplied(brand.contactWhatsapp)) {
    list.push({
      term: "WhatsApp",
      value: brand.contactWhatsapp,
      href: `https://wa.me/${brand.contactWhatsapp.replace(/\D/g, "")}`,
    });
  }
  for (const link of brand.social) {
    list.push({
      term: link.label,
      value: link.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
      href: link.href,
    });
  }
  if (isSupplied(brand.contactAddress)) {
    list.push({ term: "Address", value: brand.contactAddress, href: null });
  }
  return list;
}

export default function ContactPage() {
  const to = isSupplied(brand.contactEmail) ? brand.contactEmail : null;

  return (
    <>
      {/* Split masthead, edge to edge. Not revealed: the frame is the route's
          largest paint. On a phone the frame follows the channels as a band. */}
      <section className="md:grid md:min-h-[min(40rem,85svh)] md:grid-cols-2">
        <div
          data-surface="ink"
          className="flex flex-col justify-center px-6 py-tight md:px-12 md:py-normal lg:px-16"
        >
          <p className="text-caption uppercase tracking-[0.22em] text-accent">Correspondence</p>
          <h1 className="mt-4 text-title">Contact</h1>
          <p className="mt-4 max-w-measure text-body text-muted">
            Write to us about an order or a piece in the catalogue.
          </p>

          <dl className="mt-tight max-w-[34rem] border-t border-gold">
            {channels(to).map((channel) => (
              <div
                key={channel.term}
                className="grid border-b border-line py-3 sm:grid-cols-[7rem_1fr] sm:items-center sm:gap-6"
              >
                <dt className="text-caption uppercase text-muted">{channel.term}</dt>
                <dd className="text-body">
                  {channel.href ? (
                    <a href={channel.href} className={CHANNEL_LINK}>
                      {channel.value}
                    </a>
                  ) : (
                    <span className="inline-flex min-h-[44px] items-center">{channel.value}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative aspect-[3/2] md:aspect-auto">
          <Plate {...CAMPAIGN_PLATE} cover priority sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </section>

      <Reveal as="section" className="mt-tight">
        <div className="page-gutter md:grid md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-4">
            <h2 className="text-title">Send a message</h2>
            <p className="mt-4 max-w-measure text-body text-muted">
              Every field is required except the order number.
            </p>
            {to ? (
              <p className="mt-4 max-w-measure text-body text-muted">
                Sending opens your email app with this message addressed to {to}.
              </p>
            ) : null}
          </div>

          <div className="mt-tight md:col-span-7 md:col-start-6 md:mt-0">
            <ContactForm to={to} />
          </div>
        </div>
      </Reveal>
    </>
  );
}
