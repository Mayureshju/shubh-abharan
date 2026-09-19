/**
 * Marginal caption set at caption size.
 *
 * The optional plate index is the museum-register device this system is built
 * on — it earns its place by numbering a sequence, not as decoration. Omit it
 * where there is no sequence to number.
 */
export function FigureCaption({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <figcaption className={`text-caption uppercase text-muted ${className ?? ""}`}>
      {typeof index === "number" ? (
        <span className="mr-3 text-on-surface">
          Plate {String(index).padStart(2, "0")}
        </span>
      ) : null}
      {children}
    </figcaption>
  );
}
