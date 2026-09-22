import type { InsightPost } from "@/data/pillarInsights";

// Search visibility guides. Platform guidance, research and practical
// suggestions are distinguished; primary references checked 22 September 2026.

type InsightResearchSource = {
  title: string;
  publisher: string;
  url: string;
  note?: string;
};

type SourcedInsightPost = InsightPost & {
  sources: InsightResearchSource[];
};

export const answerEngineInsightPosts: SourcedInsightPost[] = [
  {
    "slug": "aeo-vs-seo-vs-geo",
    "title": "SEO, AEO and GEO: where a small team should start",
    "seoTitle": "AEO vs SEO vs GEO: differences and practical priorities",
    "excerpt": "Compare the aims of SEO, AEO and GEO, separate platform guidance from sales claims, and choose a useful first task for a service business.",
    "directAnswer": "SEO concerns visibility in search. AEO is commonly used for work aimed at direct answers, while GEO concerns visibility in generated responses. The labels overlap and do not describe three universal ranking systems. For a small service business, start with the actual problem: inaccessible pages, an unclear offer, weak evidence or poor enquiries. Choose work that addresses that problem and measure each channel separately.",
    "element": "space",
    "topicSlug": "brand-memory",
    "primaryKeyword": "aeo vs seo vs geo",
    "secondaryKeywords": [
      "difference between seo and aeo",
      "what is answer engine optimisation",
      "what is generative engine optimization",
      "geo vs seo",
      "ai search optimisation",
      "llm seo"
    ],
    "searchIntent": "Understand what separates SEO, AEO, and GEO, and decide where a service business should place its effort.",
    "publishedAt": "2026-09-18",
    "updatedAt": "2026-09-22",
    "readingTime": "6 min read",
    "heroImage": "/images/generated/insights-v2/page-knowledge-atlas.webp",
    "heroVideo": "/videos/generated/insights-v2/page-knowledge-atlas.mp4",
    "heroImageAlt": "An open atlas of connected reference cards on a worktable, three routes traced across one shared map",
    "keyTakeaways": [
      "The acronym names an intended outcome; a proposal still needs to name the platform, page and work.",
      "Search position, a linked citation, an unlinked mention and a qualified enquiry are different observations.",
      "Google chooses featured snippets. A direct opening answer cannot guarantee selection.",
      "Repeated wording across profiles does not establish how an assistant ranks a business.",
      "Start with a useful baseline and a specific buyer question before commissioning more content."
    ],
    "framework": {
      "title": "Choose the work before the acronym",
      "introduction": "A planning exercise for a service business, rather than a model of any platform's ranking system.",
      "steps": [
        {
          "title": "Define the buyer",
          "description": "Write the service, market and decision you want the page to support."
        },
        {
          "title": "Check the route",
          "description": "Can someone find the page, understand the scope and reach the next step?"
        },
        {
          "title": "Examine the evidence",
          "description": "Separate work you can document from statements you still need to test."
        },
        {
          "title": "Choose one change",
          "description": "Select a page or question where a concrete improvement is possible."
        },
        {
          "title": "Measure the outcome",
          "description": "Record the change, observation period, visits and relevant enquiries."
        }
      ]
    },
    "sections": [
      {
        "id": "three-acronyms-one-anxiety",
        "heading": "Start with the decision behind the brief",
        "paragraphs": [
          "A founder can receive three proposals describing the same pages under different labels. Comparing the acronym will reveal less than comparing the deliverables. Ask which problem the supplier observed, which pages they would change and what evidence would show the work helped.",
          "For an illustrative UK consultancy, the immediate problem might be an offer that sounds like general business advice. Before commissioning an AI visibility programme, the founder could clarify the type of client, the decision being addressed and the evidence available to support the service. This is a proposed exercise, not a reported client outcome."
        ]
      },
      {
        "id": "what-each-name-means",
        "heading": "What each term covers",
        "paragraphs": [
          "SEO is the broad practice of improving a site's discoverability and usefulness in search. AEO often describes efforts to appear in direct answers. GEO is used for efforts aimed at generated answers. Different suppliers use the latter two terms differently, so spell out their meaning in the brief.",
          "Google's current AI search guidance places its generative features within SEO and its established Search systems. That describes Google; it does not establish a common mechanism across every assistant.",
          "An answer may cite a page without recommending the company that published it. A company may be mentioned without receiving a link. Decide which of those events is relevant before describing all of them as visibility."
        ]
      },
      {
        "id": "the-real-difference",
        "heading": "Compare outcomes you can observe",
        "paragraphs": [
          "Use separate columns for the query, the displayed result, the destination and the buyer's next action. An informational guide being cited answers a different commercial question from a service page attracting a suitable enquiry.",
          "A useful comparison records the conditions. Note the country, date, device or product and whether the query names the business. A branded lookup and an unprompted supplier recommendation are different tests; merging them makes a small brand appear more visible than the sample establishes."
        ]
      },
      {
        "id": "the-shared-foundation",
        "heading": "Keep the offer and evidence understandable",
        "paragraphs": [
          "Read the service page beside a recent proposal. Can a buyer tell which work is included, which decisions they need to make, and which results are documented? Correct contradictions before adding another page.",
          "Keep business facts accurate across the profiles you control. Wording can suit the audience and format. A short directory description and a detailed service page do not need identical sentences to describe the same practice.",
          "Google's featured snippet documentation says selection belongs to its systems. Write a clear opening answer because it helps the reader; avoid presenting its position or length as a way to force a snippet."
        ]
      },
      {
        "id": "how-buying-behaviour-splits",
        "heading": "Measure visits and enquiries separately",
        "paragraphs": [
          "Do not assume visitors from an assistant are more likely to buy. Compare the enquiries your business actually receives: the work requested, market, scope fit and next agreed step. A handful of visits is too small a basis for a confident conversion claim.",
          "Keep the denominator visible. Two relevant enquiries from twenty visits and two from two thousand visits describe different observations, but neither small sample establishes a lasting channel advantage. These numbers illustrate how to report a comparison; they are not Branding Tatva results."
        ]
      },
      {
        "id": "where-a-small-team-spends-first",
        "heading": "Choose a bounded first project",
        "paragraphs": [
          "List the questions that recur in buying conversations. Group questions that belong to one decision instead of creating a separate page for every phrasing. Select a useful existing page to improve, and write down what is missing.",
          "Agree the scope before discussing the acronym: access fixes, a clearer service explanation, a documented example or a measurement review. A supplier should be able to explain why that work matters to your business without promising a particular search position.",
          "Review the page after publication and record what changed. Keep an observation window suited to the amount of data available. A review date is a point to assess evidence, not a deadline by which a recommendation must appear."
        ]
      },
      {
        "id": "what-this-library-practises",
        "heading": "Use this comparison in a supplier conversation",
        "paragraphs": [
          "Bring one service page, one buyer question and one piece of project evidence. Ask the supplier to connect the proposed change to all three. That makes the brief concrete enough to review.",
          "Branding Tatva's contribution here is a way to examine positioning, language and evidence. Platform eligibility and search performance still need their own checks. The planning exercise above is not evidence that this site has earned AI recommendations or a leading UK search position."
        ]
      }
    ],
    "faq": [
      {
        "question": "Is AEO just SEO with a new name?",
        "answer": "The activities overlap, but the label alone says little about the work. Ask whether the brief concerns a particular answer feature, a defined set of questions or ordinary site improvements. Google decides which pages become featured snippets."
      },
      {
        "question": "Does GEO replace SEO?",
        "answer": "Google treats its generative search experiences as part of Search. For other platforms, inspect their current guidance and your own results. Reallocate effort around an observed problem, rather than an assumption that one acronym replaces another."
      },
      {
        "question": "What does GEO stand for in marketing?",
        "answer": "Here it means generative engine optimisation, concerning visibility in generated answers. Geographic targeting is a separate issue. Spell out the term in a proposal so both parties know which work is being discussed."
      },
      {
        "question": "Which should a service business prioritise?",
        "answer": "Prioritise the problem supported by evidence. An inaccessible page needs a technical review; an unclear offer needs clearer positioning and messaging; an unsubstantiated claim needs better evidence. Several of those needs may exist together."
      },
      {
        "question": "How can a small team measure progress?",
        "answer": "Keep a dated query sample and record the platform, settings, mentions, citations and destination URLs. Track visits and suitable enquiries separately. Label the sample's limits and record missing data rather than treating it as zero."
      }
    ],
    "relatedSlugs": [
      "how-ai-assistants-choose-brands-to-recommend",
      "generative-engine-optimisation-guide",
      "brand-awareness-vs-brand-recall"
    ],
    "sources": [
      {
        "title": "Optimising for generative AI features on Google Search",
        "publisher": "Google Search Central",
        "url": "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
        "note": "Google-specific guidance on AI search; it does not describe every assistant."
      },
      {
        "title": "Featured snippets and your website",
        "publisher": "Google Search Central",
        "url": "https://developers.google.com/search/docs/appearance/featured-snippets",
        "note": "Google determines snippet selection; publishers cannot mark a passage for guaranteed inclusion."
      }
    ],
    "useEditorialArtwork": false
  },
  {
    "slug": "generative-engine-optimisation-guide",
    "title": "Generative engine optimisation: evidence before tactics",
    "seoTitle": "Generative Engine Optimisation: a practical GEO guide",
    "excerpt": "What GEO research measured, what a service business can test, and how to review progress without promising citations or changing dates for appearance.",
    "directAnswer": "Generative engine optimisation describes work intended to improve visibility in generated answers. A useful programme defines the platform, questions and evidence first. The GEO research benchmark reported improvements under particular test conditions; it does not forecast a business's current recommendations or revenue. Treat proposed changes as tests, preserve accurate content dates and judge the result against the observations you actually collect.",
    "element": "space",
    "topicSlug": "brand-memory",
    "primaryKeyword": "generative engine optimisation",
    "secondaryKeywords": [
      "generative engine optimization",
      "geo marketing",
      "how to appear in chatgpt answers",
      "ai search for small business",
      "geo strategy for service businesses",
      "llm optimization"
    ],
    "searchIntent": "Understand how generative engine optimisation works, what evidence supports it, and how a small service business should sequence it.",
    "publishedAt": "2026-09-18",
    "updatedAt": "2026-09-22",
    "readingTime": "6 min read",
    "heroImage": "/images/generated/insights-v2/page-evidence-audit.webp",
    "heroVideo": "/videos/generated/insights-v2/page-evidence-audit.mp4",
    "heroImageAlt": "An evidence audit laid out on a desk: source cards, a magnifier, and one claim traced through several independent records",
    "keyTakeaways": [
      "A benchmark visibility measure is not a forecast of traffic, customers or current rankings.",
      "An accurate explanation and a documented example give a reader something useful to assess.",
      "Editorial revision dates should reflect substantive changes.",
      "A ninety day plan can organise work; it cannot set an assistant's publication or recommendation schedule.",
      "Keep mentions, citations, visits and suitable enquiries as separate measures."
    ],
    "framework": {
      "title": "A bounded visibility review",
      "introduction": "Use this as an editorial planning method. Its steps do not represent an assistant's hidden selection process.",
      "steps": [
        {
          "title": "Set the question",
          "description": "Choose a real buying decision and the platform on which you will observe it."
        },
        {
          "title": "Record the baseline",
          "description": "Save the exact question, date, context, response and cited URLs."
        },
        {
          "title": "Review the page",
          "description": "Check whether the page explains the decision and supports its claims."
        },
        {
          "title": "Make a useful revision",
          "description": "Add a documented example, correct a fact or clarify a scope boundary."
        },
        {
          "title": "Compare cautiously",
          "description": "Repeat the observation and assess visits and enquiries separately."
        }
      ]
    },
    "sections": [
      {
        "id": "what-geo-is",
        "heading": "What the GEO label can and cannot tell you",
        "paragraphs": [
          "A GEO brief should name its intended result. A source cited in an explanation, a brand included in a shortlist and a visit to a service page are different outcomes. Before commissioning work, agree which one you will observe and why it matters.",
          "The label does not tell you which systems a supplier has tested, what access they have or how they will measure change. Ask for those details in ordinary language. A useful proposal identifies the pages, the work and the limits."
        ]
      },
      {
        "id": "how-engines-assemble-answers",
        "heading": "Keep the test conditions visible",
        "paragraphs": [
          "Use a record another person could review: exact question, platform, date, market, relevant settings and linked sources. Save the full response, including cases where the company is absent. Record a branded question separately from a request that does not name the business.",
          "Repeat a manageable sample under comparable conditions. Describe it as an observation of that sample. Avoid presenting a few favourable screenshots as a share of all possible answers, or as an explanation of the platform's internal weighting."
        ]
      },
      {
        "id": "what-the-research-found",
        "heading": "Read the research within its scope",
        "paragraphs": [
          "Aggarwal and colleagues introduced a benchmark and evaluated methods for changing source visibility in generated responses. The paper reports gains of up to 40% on its tested visibility measures and says effectiveness varied across domains.",
          "That figure is neither an average uplift promised to every site nor a 40% increase in enquiries. It concerns the benchmark and systems in the study. The abstract alone also cannot support a universal claim that writing polish is ineffective or that smaller sites always benefit most.",
          "For your own review, turn a proposed technique into an editorial question: does this addition help a buyer check the answer? A relevant project detail may do that. A statistic added solely to make the page look authoritative may not."
        ]
      },
      {
        "id": "the-parts-you-control",
        "heading": "Improve the decision a reader can make",
        "paragraphs": [
          "Consider an illustrative remote service provider serving UK clients. A page that lists strategy, content and design leaves the buyer with a broad menu. The provider could explain the first decision, the materials required and which outputs belong to the proposed engagement.",
          "Add a documented example with a clear boundary: what was delivered, which outcome was measured and which was not. Keep an illustrative scenario visibly labelled. This creates useful material for a buying conversation even if no assistant cites the page.",
          "Google's helpful-content guidance cautions against changing dates without substantive changes. Record an editorial update when the work warrants it; a new calendar date alone is not new evidence."
        ]
      },
      {
        "id": "the-parts-others-control",
        "heading": "Treat independent evidence as independent",
        "paragraphs": [
          "Request permission before publishing client material. Keep the client's wording and the context of any measured result. A testimonial about working together cannot establish an unmeasured commercial outcome.",
          "When a third party describes the practice, check factual errors and let that source retain its own voice. Requiring everyone to repeat one exact sentence would obscure the difference between independent comment and coordinated promotion.",
          "Choose communities because you can contribute something useful to their readers. A post does not establish whether a future system will train on it, cite it or recommend its author."
        ]
      },
      {
        "id": "tactics-that-decay",
        "heading": "Ask what a proposed tactic proves",
        "paragraphs": [
          "Before accepting a promise, ask to see its comparison: what changed, what stayed the same, how often the result was observed and whether the evidence concerns your market. A demonstration should survive questions about unfavourable runs and missing data.",
          "Avoid invented numbers, fabricated reviews and hidden instructions intended to steer an answer. These make the record less trustworthy for a buyer. Their existence does not establish that they are effective techniques.",
          "Google says its generative Search features need no special schema or AI text file. Read a platform's own guidance before paying for a claimed technical requirement, and keep that guidance scoped to the platform that issued it."
        ]
      },
      {
        "id": "a-ninety-day-sequence",
        "heading": "Use ninety days to organise the work",
        "paragraphs": [
          "Days one to fifteen: choose a narrow question set, establish the baseline and identify the most useful page to improve. Include a technical access check when the page cannot be fetched or indexed.",
          "Days sixteen to sixty: improve that page with verified evidence and a clearer explanation. Keep a change log. Decide whether another question belongs on the same page before expanding the library.",
          "Days sixty one to ninety: repeat the observations, review any visits and suitable enquiries, and decide what the evidence supports doing next. These are suggested work windows, not a forecast of when an assistant will cite the business."
        ]
      }
    ],
    "faq": [
      {
        "question": "Does GEO work for a small business?",
        "answer": "A small business can test useful improvements, but site size alone does not establish the outcome. Define a buyer question, improve the relevant page and measure the result. Benchmark findings are not a guarantee for an individual business."
      },
      {
        "question": "Is special schema required for GEO?",
        "answer": "Google says no special schema is required for its generative search features. Use structured data appropriately for the content it describes, and check other platforms separately. Markup does not establish a recommendation."
      },
      {
        "question": "Do forum posts guarantee AI visibility?",
        "answer": "No. A published answer is evidence of your contribution to that discussion. It does not establish later model training, citation or recommendation. Judge participation by relevance and usefulness to the community."
      },
      {
        "question": "How long does GEO take?",
        "answer": "There is no supported universal timetable for a particular business to be recommended. Separate your delivery schedule from the platform's behaviour, and assess observations over a period suited to the amount of evidence available."
      },
      {
        "question": "Should GEO replace the SEO budget?",
        "answer": "Compare the proposed work with the problem it addresses and the results already observed. Fund a defined improvement or experiment. Avoid moving the whole budget because a supplier treats a new label as proof of a new opportunity."
      }
    ],
    "relatedSlugs": [
      "aeo-vs-seo-vs-geo",
      "how-ai-assistants-choose-brands-to-recommend",
      "why-ai-content-makes-brands-average"
    ],
    "sources": [
      {
        "title": "GEO: Generative Engine Optimization",
        "publisher": "Aggarwal and colleagues, KDD 2024",
        "url": "https://arxiv.org/abs/2311.09735",
        "note": "Benchmark results concern the tested systems and visibility measures, with effects varying by domain."
      },
      {
        "title": "Creating helpful, reliable content",
        "publisher": "Google Search Central",
        "url": "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
        "note": "Editorial guidance, including avoiding unsupported freshness changes."
      },
      {
        "title": "Optimising for generative AI features on Google Search",
        "publisher": "Google Search Central",
        "url": "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
        "note": "Google-specific guidance on AI search; it does not describe every assistant."
      }
    ],
    "useEditorialArtwork": false
  },
];
