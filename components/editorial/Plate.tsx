import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * The only path to an image in this codebase. Components must not render
 * <img> or next/image directly — see specs/design-system/core-components.
 *
 * Owning every image here is what keeps the scale grammar consistent as the
 * catalog grows: layouts request imagery by role, not by position, and the
 * aspect ratio is always declared so layout space is reserved before load.
 */

export type PlateRole = "macro" | "scale" | "worn" | "detail";

export const PLATE_ROLE_INTENT: Record<PlateRole, string> = {
  macro: "Fills or exceeds the frame. Surface, solder, inclusion — the piece's manufacture.",
  scale: "The piece at true size in a generous empty field, with its measured dimension.",
  worn: "On the body, in human context.",
  detail: "A supporting close view of one feature.",
};

/** Alt text, or an explicit decorative marking. One or the other — never neither. */
type Described = { alt: string; decorative?: never };
type Decorative = { decorative: true; alt?: never };

/** The `scale` role exists to communicate true size, so it must carry the measurement. */
type ScaleRole = { role: "scale"; dimension: string };
type OtherRole = { role: Exclude<PlateRole, "scale">; dimension?: string };

interface PlateCommon {
  /** Aspect ratio as `w/h`, e.g. "4/5". Required — reserves space before load. */
  aspect: string;
  /**
   * A second aspect ratio, applied from 768px up. Optional, and only for
   * frames a single ratio cannot serve: a 2/1 band is 195px tall on a phone,
   * a 4/5 portrait is 2400px tall on a desktop.
   *
   * Two ratios rather than two plates, because browsers fetch images inside
   * `display: none` subtrees — one hidden per breakpoint would download both
   * frames for every visitor the moment photography exists.
   */
  aspectMd?: string;
  /** Omit while photography is unsupplied; a marked placeholder renders instead. */
  src?: string;
  /** Intended crop. Shown on the placeholder so an unshot frame is still reviewable. */
  crop?: string;
  /**
   * Where the subject sits in the source frame, as an `object-position` value.
   *
   * Defaults to centre. A frame whose subject is deliberately off-axis — the
   * hero's figure is in the right half, against empty wall — loses that subject
   * when a narrower viewport crops the frame symmetrically. This moves the crop
   * window instead of asking for a second photograph.
   *
   * It is the *photograph's* property, not the layout's, so it is declared
   * beside `src` and `crop` and travels with the image wherever it is placed.
   */
  position?: string;
  className?: string;
  /** Responsive sizes hint. Default assumes a full-width frame. */
  sizes?: string;
  priority?: boolean;
}

export type PlateProps = PlateCommon & (Described | Decorative) & (ScaleRole | OtherRole);

export function Plate(props: PlateProps) {
  const {
    aspect,
    aspectMd,
    src,
    crop,
    className,
    sizes = "100vw",
    priority = false,
    position,
    role,
    dimension,
  } = props;

  const alt = "decorative" in props && props.decorative ? "" : (props.alt ?? "");
  const isDecorative = "decorative" in props && props.decorative === true;

  // With one ratio the inline aspect-ratio is the whole story. With two, the
  // resolved value has to be reachable from a media query, and an inline style
  // cannot be overridden by a class — so the value moves into a custom
  // property that globals.css re-points at 768px.
  const frameStyle: CSSProperties = aspectMd
    ? ({
        aspectRatio: "var(--plate-aspect)",
        "--plate-aspect-sm": aspect,
        "--plate-aspect-md": aspectMd,
      } as CSSProperties)
    : { aspectRatio: aspect };

  return (
    <figure className={className}>
      <div
        className="relative w-full overflow-hidden bg-[color-mix(in_oklab,var(--surface-fg)_6%,var(--surface-bg))]"
        style={frameStyle}
        data-plate-role={role}
        data-plate-aspect-md={aspectMd ? "" : undefined}
      >
        {src ? (
          <Image
            data-plate-img
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            aria-hidden={isDecorative || undefined}
            style={position ? { objectPosition: position } : undefined}
            className="object-cover"
          />
        ) : (
          <PlatePlaceholder role={role} aspect={aspect} aspectMd={aspectMd} crop={crop} />
        )}
      </div>

      {role === "scale" && dimension ? (
        <figcaption className="mt-2 text-caption uppercase text-muted">{dimension}</figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Rendered wherever real photography has not been supplied.
 *
 * States role, intended crop and aspect so composition stays reviewable
 * without the image. Deliberately plain and obviously unfinished — a
 * placeholder must never be mistaken for brand photography, and no gradient,
 * blur or texture is used to make it look better than it is.
 */
function PlatePlaceholder({
  role,
  aspect,
  aspectMd,
  crop,
}: {
  role: PlateRole;
  aspect: string;
  aspectMd?: string;
  crop?: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between border border-line p-3">
      <span className="text-caption uppercase text-muted">Placeholder — no photography</span>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-caption uppercase text-muted">
        <dt className="sr-only">Role</dt>
        <dd className="col-span-2 text-on-surface">{role}</dd>
        <dt>Crop</dt>
        <dd>{crop ?? "unspecified"}</dd>
        <dt>Aspect</dt>
        {/* Both ratios, so the frame on screen still reads as a shoot brief. */}
        <dd>{aspectMd ? `${aspect} · ${aspectMd} from 768px` : aspect}</dd>
      </dl>
    </div>
  );
}
