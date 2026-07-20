import Image from "next/image";

// Dark section wrapper with a subtle organic texture behind the solid
// soil color, instead of flat, uniform color. The gradient overlay keeps
// contrast high enough that ivory text stays fully readable; the photo
// itself is decorative texture (rock, weathered surface), not standing
// in for a person or a claim about anything specific. Real photography
// by default (own-jagged-peaks reads as abstract rock texture under
// this much darkening), not the AI-generated image this used to
// default to — every call site should still pass its own `image` where
// a specific mood/location matters, this default is only the fallback.

export function TexturedDark({
  children,
  className,
  image = "/images/own-jagged-peaks.jpg",
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
