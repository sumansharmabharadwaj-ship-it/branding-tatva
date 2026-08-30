"use client";

import { useEffect, useState } from "react";
import type { PackageSlug } from "@/data/pricing";
import { packageSlugFromServicesContactParam } from "@/lib/servicesJourney";

export function useServicesContactPackage() {
  const [packageSlug, setPackageSlug] = useState<PackageSlug | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPackageSlug(packageSlugFromServicesContactParam(params.get("package")));
  }, []);

  return packageSlug;
}
