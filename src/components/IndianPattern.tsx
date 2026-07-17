// An original, abstracted lattice motif inspired by jali screen geometry —
// interlocking diamonds and connecting lines, not a literal or religious
// pattern. Used sparingly as a low-opacity background texture, never as a
// standalone decoration. See DESIGN_SYSTEM.md for usage rules.

export function IndianPattern({
  className,
  opacity = 0.06,
  color = "#27221E",
}: {
  className?: string;
  opacity?: number;
  color?: string;
}) {
  const id = "jali-lattice";
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} width="72" height="72" patternUnits="userSpaceOnUse">
          {/* Interlocking diamond lattice — each tile connects to its
              neighbours so the pattern reads as one continuous screen,
              not a stamped-out repeat. */}
          <path
            d="M36 4 L68 36 L36 68 L4 36 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity={opacity}
          />
          <circle cx="36" cy="36" r="3" fill={color} opacity={opacity * 1.4} />
          <path d="M36 4 V0" stroke={color} strokeWidth="1" opacity={opacity} />
          <path d="M36 68 V72" stroke={color} strokeWidth="1" opacity={opacity} />
          <path d="M4 36 H0" stroke={color} strokeWidth="1" opacity={opacity} />
          <path d="M68 36 H72" stroke={color} strokeWidth="1" opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
