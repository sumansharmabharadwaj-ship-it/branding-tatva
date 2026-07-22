import { useEffect, useState } from "react";

// matchMedia-based rather than a resize listener read at mount, so a
// narrow viewport never briefly reports `false` (and mounts something
// meant to be skipped on mobile) before a first resize event fires.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    function onChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
