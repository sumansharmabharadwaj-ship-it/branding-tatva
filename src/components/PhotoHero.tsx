// Full-bleed photograph hero, the structure used across every reference
// site (Nevada House, Haven, Sylvan): a real photo fills the section, a
// dark gradient keeps text legible, content sits on top. Height varies
// by page: tall on the homepage, shorter elsewhere so secondary pages
// get to their content faster.

export function PhotoHero({
  children,
  image,
  minHeight = "60vh",
  className,
}: {
  children: React.ReactNode;
  image: string;
  minHeight?: string;
  className?: string;
}) {
  return (
    <section
      className={`relative flex items-center overflow-hidden bg-soil ${className ?? ""}`}
      style={{
        minHeight,
        backgroundImage: `linear-gradient(180deg, rgba(39,34,30,0.55) 0%, rgba(39,34,30,0.78) 60%, rgba(39,34,30,0.92) 100%), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {children}
    </section>
  );
}
