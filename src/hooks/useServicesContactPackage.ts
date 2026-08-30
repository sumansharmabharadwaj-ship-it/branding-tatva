"use client";

import { useEffect, useState } from "react";
import type { PackageSlug } from "@/data/pricing";
import { packageSlugFromServicesContactParam } from "@/lib/servicesJourney";

export const SERVICES_CONTACT_PACKAGE_EVENT =
  "branding-tatva:services-contact-package";

function readServicesContactPackage() {
  const params = new URLSearchParams(window.location.search);
  return packageSlugFromServicesContactParam(params.get("package"));
}

export function clearServicesContactPackage() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("package")) return;

  url.searchParams.delete("package");
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
  window.dispatchEvent(new Event(SERVICES_CONTACT_PACKAGE_EVENT));
}

export function useServicesContactPackage() {
  const [packageSlug, setPackageSlug] = useState<PackageSlug | null>(null);

  useEffect(() => {
    const syncPackage = () => setPackageSlug(readServicesContactPackage());

    syncPackage();
    window.addEventListener("popstate", syncPackage);
    window.addEventListener(SERVICES_CONTACT_PACKAGE_EVENT, syncPackage);

    return () => {
      window.removeEventListener("popstate", syncPackage);
      window.removeEventListener(SERVICES_CONTACT_PACKAGE_EVENT, syncPackage);
    };
  }, []);

  return packageSlug;
}
