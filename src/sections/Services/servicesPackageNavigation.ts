import type { MouseEvent } from "react";
import type { PackageSlug } from "@/data/pricing";

// Keep browser link gestures native. Only an ordinary activation in this tab
// participates in the Services chapter recovery and focus handoff.
export function followServicesPackageLink(
  event: MouseEvent<HTMLAnchorElement>,
  slug: PackageSlug,
  select: () => void,
) {
  const link = event.currentTarget;
  if (
    event.defaultPrevented || event.button !== 0 ||
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
    (link.target && link.target.toLowerCase() !== "_self") ||
    link.hasAttribute("download")
  ) return;

  select();
  const id = `package-${slug}`;
  const choice = document.getElementById(id);
  // A partially hydrated page still has a working href. Intercept only when
  // the destination and its native-scroll coordinator are both available.
  if (
    document.documentElement.dataset.servicesExperience !== "active" ||
    !document.getElementById("desire") || !choice
  ) return;

  event.preventDefault();
  const hash = `#${id}`;
  if (window.location.hash !== hash) {
    window.history.pushState(window.history.state, "", hash);
  }
  window.dispatchEvent(new CustomEvent("bt:services-anchor-settle", { detail: { id: "desire" } }));
  // A keyboard visitor's next Tab now continues through the package selector
  // instead of returning to controls in the chapter they just left.
  choice.focus({ preventScroll: true });
}
