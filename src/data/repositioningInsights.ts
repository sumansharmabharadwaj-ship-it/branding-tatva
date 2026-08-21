import type { InsightPost } from "@/data/insights";
import { repositioningSectionsA } from "@/data/repositioning/repositioningSectionsA";
import { repositioningSectionsB } from "@/data/repositioning/repositioningSectionsB";
import { repositioningSectionsC } from "@/data/repositioning/repositioningSectionsC";

type InsightResearchSource = {
  title: string;
  publisher: string;
  url: string;
  note?: string;
};

type SourcedInsightPost = InsightPost & {
  sources: InsightResearchSource[];
};

export const repositioningInsightPosts: SourcedInsightPost[] = [
  {
    slug: "reposition-established-service-business-without-losing-recognition",
    title: "How to reposition an established service business without losing recognition",
    seoTitle: "How to reposition a service business without losing recognition",
    excerpt:
      "A recognition-safe repositioning method for established service businesses: change the meaning that limits growth while preserving the names, cues, proof, and customer confidence already earning memory.",
    directAnswer:
      "Reposition an established service business by changing the market meaning before changing every visible asset. Audit what customers currently recognise, which associations help or hinder growth, and which names, phrases, colours, symbols, service rituals, and proof already carry memory. Define the new customer situation and strategic choice, preserve useful recognition cues, build a clear bridge from the old meaning to the new one, phase the rollout across touchpoints, and measure both understanding and recognition after launch.",
    element: "space",
    topicSlug: "brand-memory",
    primaryKeyword: "how to reposition a service business",
    secondaryKeywords: [
      "brand repositioning strategy",
      "service business rebranding",
      "rebrand without losing customers",
      "preserve brand recognition",
      "evolutionary rebrand",
      "reposition an established brand",
    ],
    searchIntent:
      "Plan a service-business repositioning that changes market perception without discarding valuable recognition and customer trust.",
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    readingTime: "15 min read",
    heroImage: "/images/pixabay-sea-of-fog-sunrise-poster.jpg",
    heroVideo: "/videos/pixabay-sea-of-fog-sunrise.mp4",
    heroImageAlt:
      "Morning light revealing a familiar landscape through mist, representing a new position emerging without erasing recognition",
    keyTakeaways: [
      "Repositioning changes what the business should mean; rebranding changes how that meaning is expressed.",
      "Recognition is an asset to audit before the design process rather than a constraint discovered after launch.",
      "Preserve familiar cues that are unique, known, and still compatible with the new direction.",
      "A transition message should connect the business customers knew with the reason it is changing now.",
      "Measure recognition, understanding, lead quality, and buying-situation association separately after launch.",
    ],
    framework: {
      title: "The recognition bridge",
      introduction:
        "Five decisions let an established business cross into a sharper position without setting fire to the road behind it.",
      steps: [
        {
          title: "Baseline",
          description:
            "Measure what customers recognise, remember, value, misunderstand, and use to find the business today.",
        },
        {
          title: "Core shift",
          description:
            "Define the new customer situation, comparison frame, distinctive choice, and commercial reason for change.",
        },
        {
          title: "Continuity",
          description:
            "Protect useful names, assets, phrases, proof, and service behaviours that still reinforce the desired future.",
        },
        {
          title: "Bridge",
          description:
            "Explain the movement from old meaning to new meaning through a transition narrative customers can follow.",
        },
        {
          title: "Reinforcement",
          description:
            "Phase the rollout, repeat the new association, and track recognition and understanding across matched touchpoints.",
        },
      ],
    },
    sections: [
      ...repositioningSectionsA,
      ...repositioningSectionsB,
      ...repositioningSectionsC,
    ],
    faq: [
      {
        question: "What is brand repositioning?",
        answer:
          "Brand repositioning changes how a business should be understood relative to customers, buying situations, categories, and alternatives. It may lead to a rebrand, but the strategic meaning should be decided before the identity changes.",
      },
      {
        question: "Can a business reposition without changing its logo?",
        answer:
          "Yes. A business can change its audience emphasis, category frame, offer hierarchy, message, proof, or customer experience while keeping the logo. Change the identity only where the existing system cannot credibly carry the new position.",
      },
      {
        question: "How do you rebrand without losing recognition?",
        answer:
          "Measure current recognition, preserve familiar and unique assets that still fit the future, evolve rather than replace useful cues, explain the transition, phase the rollout, and track both recognition and new-position understanding after launch.",
      },
      {
        question: "Should an established service business change its name?",
        answer:
          "Change the name only when it creates a material strategic, legal, architectural, reputational, or expansion constraint. A name change carries extra relearning cost, so the gain should be stronger than the value of the recognition being surrendered.",
      },
      {
        question: "How long does brand repositioning take?",
        answer:
          "The strategic and design work may take several months, while market learning takes longer. Plan for a transition period in which familiar cues repeatedly connect the existing business with the new meaning.",
      },
      {
        question: "How do you know whether repositioning worked?",
        answer:
          "Measure whether people still recognise the business, whether they connect it with the intended category and buying situations, whether lead quality and service mix shift, and whether customers use the new language without prompting.",
      },
    ],
    relatedSlugs: [
      "brand-audit-checklist-before-rebrand",
      "distinctive-brand-assets-audit",
      "brand-positioning-strategy-service-businesses",
    ],
    sources: [
      {
        title: "Consumer reaction to service rebranding",
        publisher: "Journal of Retailing and Consumer Services",
        url: "https://doi.org/10.1016/j.jretconser.2014.07.003",
        note:
          "A study of 320 customers across eight service rebranding cases found that evaluations can decline after a name change, while proximity between the new brand and the service can reduce the decline.",
      },
      {
        title: "Brands of Distinction",
        publisher: "Ehrenberg-Bass Institute for Marketing Science",
        url: "https://marketingscience.info/news-and-insights/brands-of-distinction",
        note:
          "Explains fame and uniqueness as distinctive-asset qualities, recommends measuring what buyers have stored in memory, and warns against discarding useful identity assets without evidence.",
      },
      {
        title: "The Four Commandments: future proofing a brand's identity",
        publisher: "Ehrenberg-Bass Institute for Marketing Science",
        url: "https://marketingscience.info/news-and-insights/the-four-commandments-future-proofing-a-brands-identity",
        note:
          "Argues for a high evidence threshold before changing established distinctive assets and for building assets in focused waves.",
      },
      {
        title: "The impact of logo change on brand loyalty with the mediating role of brand attitude",
        publisher: "Management & Sustainability: An Arab Review",
        url: "https://doi.org/10.1108/MSAR-08-2024-0111",
        note:
          "Research using 468 consumers found that perceived appropriateness and familiarity of a changed logo can support favourable brand attitudes and loyalty.",
      },
      {
        title: "Sport rebranding: the effect of different degrees of sport logo redesign on brand attitude and purchase intention",
        publisher: "International Journal of Sports Marketing and Sponsorship",
        url: "https://doi.org/10.1108/IJSMS-01-2021-0016",
        note:
          "An experimental study found more radical logo changes and colour changes produced more negative attitudes, illustrating the recognition and acceptance risk of unnecessary visual rupture.",
      },
    ],
  },
];
