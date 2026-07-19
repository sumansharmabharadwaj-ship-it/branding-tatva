// Dark section wrapper with a subtle organic texture behind the solid
// soil color, instead of flat, uniform color. The gradient overlay keeps
// contrast high enough that ivory text stays fully readable; the photo
// itself is decorative texture (stone, weathered surface), not standing
// in for a person or a claim about anything specific. Photo: Pexels,
// free for commercial use, see public/images/README if one gets added.

export function TexturedDark({
  children,
  className,
  image = "/images/texture-terracotta.jpg",
}: {
  children: React.ReactNode;
  className?: string;
  image?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden bg-soil ${className ?? ""}`}
      style={{
        backgroundImage: `linear-gradient(rgba(39,34,30,0.88), rgba(39,34,30,0.93)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="aurora-glow" aria-hidden="true" />
      <div className="relative">{children}</div>
    </section>
  );
}
