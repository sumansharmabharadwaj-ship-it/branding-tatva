export type Project = {
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  audience?: string;
  insight?: string; // the strategic observation that shaped the approach
  strategy?: string;
  execution?: string;
  services: string[];
  outcome: string; // only verified claims — no invented metrics
  reflection?: string;
  featured: boolean;
  accent: string; // card accent color, varies per project so the grid isn't monotone
  stats?: { value: string; label: string }[]; // real, verified numbers only — pulled from `outcome` for visual callouts
  closingQuote?: string; // the case-study page's closing VideoBreak — grounded in this project's own challenge/insight, not a generic line shared across every project
  cardImage?: string; // background photo for the Home page's secondary "Selected work" cards
};

// Client names cleared for public use by Suman. Every field below is
// grounded in the source strategy documents — see ASSET_INVENTORY.md.
// Executive Springboard intentionally stays higher-level than the others:
// I have a verified summary of that work but not the full source text to
// safely add further specifics without risking invention.
export const projects: Project[] = [
  {
    slug: "dr-haley-nutrition",
    title: "Dr. Haley Nutrition",
    industry: "Nutrition & wellness",
    challenge:
      "A nutrition brand's social presence was growing in volume while quality lagged behind. More posts were failing to translate into an audience that would actually stay. The two month engagement, running December 2025 to January 2026, needed to prove whether fewer, sharper posts could outperform a heavier posting schedule.",
    insight:
      "The account was gaining reach while trust lagged behind. Impressions and follower counts looked fine in isolation, but the content was falling short of the kind of engagement that signals an algorithm to keep showing it to new people.",
    strategy:
      "Shifted the entire approach from volume first to quality first across Instagram, Facebook, and LinkedIn, deliberately posting less but making every post earn its place.",
    execution:
      "Cut Instagram posting from 23 posts in December to 12 in January. Kept Facebook's cadence steady but tightened relevance. Used LinkedIn, previously dormant, to start building visibility with a professional audience from a low base.",
    services: ["Space · ongoing content management", "Air · content strategy"],
    outcome:
      "Instagram gained 126 new followers in January from 12 posts, more than December's 111 followers from 23 posts. That's a 104% increase in followers earned per post, alongside a 1,350% jump in comments per post. Facebook grew steadily from roughly 59 to 69 total fans over the same period, with engagement per post up 67%. LinkedIn impressions rose 365%, and engagement rate climbed from 0.71% to 2.81%.",
    reflection:
      "The clearest signal was impressions barely dropping (down just 10%) despite posting 48% less. The platform was actively rewarding the more relevant content instead of just showing it to fewer people. That's the difference between reach and trust.",
    closingQuote:
      "Fewer posts, each one earning its place. That's the difference between being seen and being remembered.",
    featured: true,
    accent: "#5C6B4A", // sage
    stats: [
      { value: "104%", label: "more followers earned per post" },
      { value: "1,350%", label: "jump in comments per post" },
      { value: "365%", label: "rise in LinkedIn impressions" },
      { value: "2.81%", label: "engagement rate, up from 0.71%" },
    ],
  },
  {
    slug: "myshopineurope",
    title: "MyShopInEurope",
    industry: "B2B marketplace",
    challenge:
      "A new platform connecting Indian vendors with European buyers had a real opportunity but no brand foundation to build on. Without one, it risked reading as a generic, access only marketplace with nothing to differentiate it from the next listings site.",
    audience:
      "European retailers, boutique owners, décor businesses, Ayurveda stores, resellers, and importers: buyers who care about margin and reliability, but also about a product story they can pass on to their own customers.",
    insight:
      "Three shifts were converging at once. European buyers increasingly want origin and story, beyond just product. Indian vendors want a smoother, more credible path into European retail. And buyers generally are paying more attention to what a brand stands for, beyond just what it sells. A brand built only around 'access' would miss all three.",
    strategy:
      "Defined a real brand foundation, including a core belief, mission, promise, and value, anchored in a specific bet: Indian products have a genuine edge in craft heritage, wellness and Ayurveda roots, and shelf distinction, and the platform should sell that edge rather than compete on being cheap supply.",
    execution:
      "Built a content strategy split roughly 65% education and authority, 25% culture and people, and 10% direct branding, deliberately weighted toward teaching and proving over promoting. Mapped specific playbooks per channel (LinkedIn for buyer side authority, Instagram for visual recall, YouTube and Reddit for search value and audience listening) and sequenced the rollout across a year: foundation first, then audience pull, then lead quality, then market position.",
    services: ["Earth · brand foundation", "Air · messaging"],
    outcome:
      "Delivered a complete brand foundation and a full content operating system: positioning, content pillars, playbooks for each channel, and a rollout plan, quarter by quarter, connecting each phase to a specific business outcome (awareness, trust, leads, conversion).",
    reflection:
      "The sharpest strategic call was refusing to let 'MyShopInEurope' default to meaning 'cheap Indian goods.' Repositioning around craft and origin, ahead of price, changes who the platform can credibly sell to.",
    closingQuote:
      "A story a buyer can pass on to their own customers is worth more than the lowest price on the listing.",
    cardImage: "/images/own-jagged-peaks.jpg",
    featured: true,
    accent: "#B85A34", // clay
  },
  {
    slug: "executive-springboard",
    title: "Executive Springboard",
    industry: "Executive mentoring",
    challenge:
      "An executive mentoring platform needed its social presence to actually convert, turning content into webinar registrations and mentor engagement, beyond just building awareness.",
    strategy:
      "Built a full competitive audit and an eight pillar content system, with distinct playbooks for each platform rather than one strategy stretched across all of them.",
    execution:
      "Designed platform specific sequencing that connected everyday content directly to webinar conversion. Content served as the actual mechanism for the platform's core registration goal, rather than a separate workstream running alongside it.",
    services: ["Water · customer journey", "Air · content strategy"],
    outcome:
      "Delivered a structured content system, built platform by platform, specifically around driving webinar registrations rather than generic engagement metrics.",
    closingQuote:
      "Content that only earns attention is unfinished. It has to lead somewhere, or it isn't strategy yet.",
    cardImage: "/images/own-canopy.jpg",
    featured: true,
    accent: "#24394D", // indigo
  },
  {
    slug: "herbalcart",
    title: "HerbalCart",
    industry: "D2C wellness & supplements",
    challenge:
      "HerbalCart's actual product line, including whey protein, pre workout, and protein bars, was being seen through a purely herbal or Ayurvedic lens the brand never intended. The gap between what people assumed HerbalCart sold and what it actually sold was undermining trust in its supplement range.",
    audience:
      "13 to 38 year olds in tier one and tier two Indian cities: health conscious, closer to 'functional fitness' enthusiasts than bodybuilders, wanting clean label options that stay approachable and reasonably priced.",
    insight:
      "The category HerbalCart was actually competing in (GNC, MyProtein, Raw Nutrition) runs on very different content instincts than a herbal or wellness brand: native, fast cut, driven by real user content, comfortable with humour, allergic to anything that reads like a pharma insert.",
    strategy:
      "Reset the campaign around one clear argument: natural food alone falls short for an active lifestyle, and supplementation fills a specific, explainable, practical gap, rather than a spiritual or ayurvedic one.",
    execution:
      "Built five content formats around that argument: direct comparisons of food versus supplement (for example, 'one scoop = 24g protein' shown against the equivalent in eggs or dal), scripted 'why choose a supplement with food' narratives, DIY recipe content, honest transformation clips from real users, and reaction style reviews. Wrote Hinglish video scripts built on real cultural reference points rather than generic fitness influencer tropes.",
    services: ["Fire · creative direction", "Air · messaging"],
    outcome:
      "Delivered a full campaign reset: repositioned content themes, five formats ready to shoot, and complete video scripts, moving the brand's public perception from 'herbal supplement' toward 'modern, supplement first wellness brand.'",
    reflection:
      "The work that landed best was the most native, rather than the most polished. Content that looked like a real person's Instagram, rather than an ad, consistently outperformed anything that read as produced.",
    closingQuote:
      "The version that felt real outperformed the version that looked expensive, every time.",
    featured: false,
    accent: "#C28A28", // ochre
  },
  {
    slug: "plaxonic-content-portfolio",
    title: "Plaxonic.com Content Portfolio",
    industry: "Enterprise technology",
    challenge:
      "A technology company needed to build authority with audiences at very different levels of technical fluency, from HR and legal leaders encountering AI governance for the first time, to engineers who live in the subject daily. A single content tone couldn't credibly reach both.",
    strategy:
      "Built a portfolio of sixteen pieces across four distinct content types, each doing a different job: Research Papers to validate claims with evidence, Perspective Pieces to challenge assumptions leaders hadn't questioned yet, Blogs to make emerging technology feel relevant to daily life, and Articles for fast, high visibility consumption.",
    execution:
      "Grounded the research pillar in a real proof of concept: an IoT edge integration case study with the Delhi Jal Board showing a measurable drop in chemical over dosing (15% to 20% down to under 3%), rather than relying on abstract claims. Paired that rigor with a deliberately provocative perspective piece questioning the industry's SaaS hype cycle, built around three direct questions every technology leader has to answer.",
    services: ["Air · content strategy"],
    outcome:
      "Produced a complete content portfolio of sixteen pieces spanning research, opinion, education, and fast consumption formats, structured around a deliberate arc: validate, challenge, humanise, define, rather than a loose content calendar.",
    closingQuote:
      "Trust with an expert and trust with a beginner are earned in two different languages, not one.",
    featured: false,
    accent: "#CD7A4C", // terracotta
  },
];
