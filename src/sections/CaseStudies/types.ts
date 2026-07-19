// "Featured" and "All work" are the one grouping in the project data
// that actually splits unevenly (3 of 5 vs all 5) — industry doesn't
// work as a filter here, since every project already has a distinct
// industry, so filtering by it would just isolate one card at a time
// instead of narrowing a real set.
export type CaseStudyFilter = "featured" | "all";
