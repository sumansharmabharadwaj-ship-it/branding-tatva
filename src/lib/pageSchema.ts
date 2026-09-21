import { site } from "@/data/site";

/*
 * Page level structured data.
 *
 * Every page already inherits the sitewide Person and Organization
 * nodes from the root layout, but most carried nothing of their own, so a
 * search or answer engine could see who runs the practice and nothing about
 * the page it had actually landed on. No breadcrumbs either, which is what
 * gives a result its trail in a search listing instead of a bare URL.
 *
 * These helpers exist so a page states its identity in one line and every
 * page states it the same way. Both reference the global ids rather than
 * restating the person and the organisation on each page, which is the whole
 * point of having ids in the graph.
 */

export const PERSON_ID = `${site.url}/#person`;
export const ORGANIZATION_ID = `${site.url}/#organization`;

type Crumb = { name: string; path: string };

/** Home is always the first crumb, so callers pass only what follows it. */
export function breadcrumb(trail: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      ...trail.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.name,
        item: `${site.url}${crumb.path}`,
      })),
    ],
  };
}

export function pageSchema({
  type,
  path,
  name,
  description,
  trail,
  mainEntity,
}: {
  /** AboutPage, ContactPage and WebPage each tell an engine what it landed on. */
  type: "AboutPage" | "ContactPage" | "WebPage" | "CollectionPage";
  path: string;
  name: string;
  description: string;
  trail: Crumb[];
  /** An id from the global graph, when the page is genuinely about that thing. */
  mainEntity?: string;
}) {
  const url = `${site.url}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#page`,
    url,
    name,
    description,
    isPartOf: { "@id": `${site.url}/#website` },
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORGANIZATION_ID },
    breadcrumb: breadcrumb(trail),
    ...(mainEntity ? { mainEntity: { "@id": mainEntity } } : {}),
  };
}
