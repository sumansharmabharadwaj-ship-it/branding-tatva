import Image from "next/image";

// Dark section wrapper with a subtle organic texture behind the solid
// soil color, instead of flat, uniform color. The gradient overlay keeps
// contrast high enough that ivory text stays fully readable; the photo
// itself is decorative texture (stone, weathered surface), not standing
// in for a person or a claim about anything specific. Generated via
// Higgsfield rather than stock photography.

export function TexturedDark({
  children,
  className,
  image = "/images/higgsfield-terracotta-texture.jpg",
}: {
  children: React.ReactNode;
  className?: string;
  image?: string;
}) {
  return (
    <section className={`relative overflow-hidden bg-soil ${className ?? ""}`}>
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(rgba(39,34,30,0.88), rgba(39,34,30,0.93))" }}
      />
      <div className="aurora-glow" aria-hidden="true" />
      <div className="light-rays" aria-hidden="true" />
      <div className="relative">{children}</div>
    </section>
  );
}
