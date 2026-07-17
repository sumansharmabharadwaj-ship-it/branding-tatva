import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Lets visitors "Add to Home Screen" on mobile and open the site as a
// standalone app-like window instead of a browser tab.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name}: Brand Strategy by ${site.founder}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F4EFE6",
    theme_color: "#27221E",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
