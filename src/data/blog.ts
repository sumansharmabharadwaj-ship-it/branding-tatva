// Blog data, same pattern as projects.ts / faqs.ts / process.ts — a plain
// typed array, no CMS. The three posts below are a starting set: real,
// publishable writing (not lorem-ipsum filler, not invented case
// studies or client claims — each one only elaborates positioning
// already stated elsewhere on the site) rather than something visibly
// marked "placeholder" for real visitors to see. `startingSet` is an
// internal-only marker (never rendered) so Suman can tell these apart
// from posts she adds herself later; new posts can omit it entirely.

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  element: "earth" | "water" | "fire" | "air" | "space";
  publishedAt: string; // ISO date
  readingTime: string;
  startingSet?: boolean;
  body: string[]; // paragraphs
  pullQuote?: string; // one sentence copied verbatim from `body` — never new copy, just a visual break
};

export const blogPosts: BlogPost[] = [
  {
    slug: "five-elements-working-as-one",
    title: "Why brand strategy needs five elements working as one",
    excerpt:
      "Most brands are built with one or two elements working hard. The ones people remember are built with all five, working together.",
    element: "space",
    publishedAt: "2026-07-20",
    readingTime: "4 min read",
    startingSet: true,
    pullQuote: "None of the five works well in isolation.",
    body: [
      "Ask most businesses what their brand needs and you'll get one answer: a logo, or a content calendar, or \"better marketing.\" Each of those is real work, but treated alone, each is also a symptom fix. A sharp logo on a business with no clear audience just makes the confusion look tidier.",
      "The elemental approach splits brand work into five parts that actually do different jobs. Earth is where a brand is grounded: purpose, audience, positioning, the research most brands skip because it's slower than picking a font. Water is how a brand moves through someone's day, the actual customer journey rather than the funnel diagram of it. Fire is what makes people look twice. Air is the language that carries all of it. Space is what's left once the noise settles, the part people actually remember.",
      "Most projects that come in asking for \"content\" are really missing Earth. Most projects asking for \"positioning\" already have Earth but have kept it trapped in the founder's own head, in a version of Air nobody outside the business can actually repeat. Naming the five separately does real diagnostic work: it tells you which part of the problem you're actually looking at before you spend money on the wrong one.",
      "None of the five works well in isolation. That's usually the actual problem a brand walks in with, whichever element it names first.",
    ],
  },
  {
    slug: "visible-versus-remembered",
    title: "The difference between visibility and being remembered",
    excerpt:
      "Being present differs from being recognised. That gap is usually a clarity problem, far more often than a visibility one.",
    element: "fire",
    publishedAt: "2026-07-13",
    readingTime: "3 min read",
    startingSet: true,
    pullQuote: "A message repeated inconsistently across five channels dilutes instead of compounding.",
    body: [
      "It's possible to post consistently, run ads, show up in every relevant search, and still fade from someone's memory. Visibility and recall measure two different things, even though most brand tracking treats them as one.",
      "Visibility asks: did someone see this? Recall asks something harder: a week later, without being shown it again, can they describe what it was and why it mattered to them? Most brands optimise entirely for the first question, because it's the one with a dashboard.",
      "The gap between the two is usually about clarity, rarely about volume. A message repeated inconsistently across five channels dilutes instead of compounding. A message repeated consistently, even at lower volume, is what actually earns a place in someone's memory rather than their scroll history.",
      "This is why \"post more\" is so often the wrong prescription. The real question is less about whether people are seeing the brand, and more about whether what they're seeing is specific enough, and consistent enough, to survive the moment after they look away.",
    ],
  },
  {
    slug: "what-a-brand-audit-actually-finds",
    title: "What actually happens in a brand audit",
    excerpt:
      "An audit first, finding exactly where the story stops holding together, before anything gets rebuilt, redesigned, or rewritten.",
    element: "water",
    publishedAt: "2026-07-06",
    readingTime: "4 min read",
    startingSet: true,
    pullQuote: "That's also why an audit has to come before a rebuild.",
    body: [
      "For a business that's already operating, the temptation is to skip straight to the fix: a new website, a rebrand, a content push. An audit exists to make sure that fix is actually aimed at the real problem, instead of the most visible symptom of it.",
      "In practice, that means going through every single place a customer actually meets the brand, the polished ones included. The website says one thing; the last ten social posts say something slightly different; the founder describes the business in a sales call in a third way entirely. None of these are wrong on their own. The problem is that they conflict with each other, and a customer piecing them together notices the seams even when they struggle to name what's off.",
      "The audit's job is to find exactly where that story stops holding together, and to be specific about it: less \"the brand feels inconsistent\" as a vague note, and more the actual sentence level and decision level places where it splits.",
      "That's also why an audit has to come before a rebuild. Redesigning a website on top of an unresolved positioning problem only dresses it up, the problem stays exactly where it was. Fixing the seam first means everything built afterward, the design, the content, the launch, is reinforcing the same story instead of adding one more version of it.",
    ],
  },
];
