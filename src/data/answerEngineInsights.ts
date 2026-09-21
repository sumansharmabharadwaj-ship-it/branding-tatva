import type { InsightPost } from "@/data/pillarInsights";

// The answer engine set — the two searches founders now run before they
// spend anything on content: what separates SEO, AEO, and GEO, and how
// generative engine optimisation actually works for a service business.
// Researched September 2026; every named study carries a source in its
// post's research record. Written to the sitewide copy standard, and
// each hero uses a spare original still from the insights v2 shoot so
// the library keeps one photographic language.

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
    slug: "aeo-vs-seo-vs-geo",
    title: "AEO vs SEO vs GEO: three acronyms, one contest",
    seoTitle: "AEO vs SEO vs GEO: the difference, explained plainly",
    excerpt:
      "Three acronyms now compete for the same budget. This guide separates what each one names, shows the single record underneath all three, and settles where a small team should spend first.",
    directAnswer:
      "SEO earns a ranked position on a results page for a typed query. AEO, answer engine optimisation, earns the quoted answer itself: the snippet, the voice reply, the answer box. GEO, generative engine optimisation, earns a place inside the responses that assistants like ChatGPT, Gemini, and Perplexity generate. The unit of competition shifts from page to passage to entity, yet all three read the same public record. A business that keeps one consistent entity, publishes direct answers, and earns third party corroboration is doing all three at once.",
    element: "space",
    topicSlug: "brand-memory",
    primaryKeyword: "aeo vs seo vs geo",
    secondaryKeywords: [
      "difference between seo and aeo",
      "what is answer engine optimisation",
      "what is generative engine optimization",
      "geo vs seo",
      "ai search optimisation",
      "llm seo",
    ],
    searchIntent:
      "Understand what separates SEO, AEO, and GEO, and decide where a service business should place its effort.",
    publishedAt: "2026-09-18",
    updatedAt: "2026-09-18",
    readingTime: "11 min read",
    heroImage: "/images/generated/insights-v2/page-knowledge-atlas.webp",
    heroVideo: "/videos/generated/insights-v2/page-knowledge-atlas.mp4",
    heroImageAlt:
      "An open atlas of connected reference cards on a worktable, three routes traced across one shared map",
    keyTakeaways: [
      "SEO ranks pages, AEO wins the quoted answer, GEO earns a place inside generated responses. Three surfaces, one written record.",
      "The unit of competition moved: from page, to passage, to entity. Entities are brand work, which is why strategists suddenly matter in search.",
      "Every tactic that genuinely works on the new surfaces also worked on the old one: direct answers, structured data, corroboration, consistency.",
      "Chasing three acronyms as three projects triples the cost of one discipline. Build the record once and let each surface read it.",
      "For a service business the order is fixed: entity first, situated answers second, third party echo third.",
    ],
    framework: {
      title: "The one record method",
      introduction:
        "Every surface, human or machine, reads the same public record of your business. Build that record once, in this order, and SEO, AEO, and GEO are served by the same work.",
      steps: [
        {
          title: "Name the entity",
          description:
            "One sentence holding the name, the category, and who the work is for. Installed verbatim on the site, LinkedIn, directories, and every profile.",
        },
        {
          title: "Choose the questions",
          description:
            "The five to fifteen situated questions a buyer actually asks before hiring you. Each one becomes a page with a stable URL.",
        },
        {
          title: "Answer first, explain after",
          description:
            "Every page states its conclusion in the opening block, then earns it. Machines excerpt openings; people skim them.",
        },
        {
          title: "Mark it up",
          description:
            "Organisation, person, article, FAQ, and definition schema tell every crawler exactly which entity each answer belongs to.",
        },
        {
          title: "Earn the echo",
          description:
            "Reviews, press, directories, and forum discussion repeating your sentence. Agreement between independent sources is what machines treat as truth.",
        },
      ],
    },
    sections: [
      {
        id: "three-acronyms-one-anxiety",
        heading: "Three acronyms, one anxiety",
        paragraphs: [
          "Somewhere in 2025 the question changed shape. Founders stopped asking how to rank on Google and started asking why ChatGPT recommends a competitor, why Perplexity cites a rival's guide, why the answer box quotes somebody else. The industry answered with acronyms: SEO for the rankings, AEO for the answers, GEO for the generated responses.",
          "The acronyms are useful as names for surfaces. They are misleading as names for disciplines, because they suggest three separate projects with three separate budgets. Agencies have already begun selling them that way.",
          "The claim this guide will defend: there is one discipline underneath, and it is closer to brand strategy than to technical search work. The surfaces differ in how they read. The record they read is shared.",
        ],
        callout: {
          label: "The short version",
          text: "SEO ranks pages. AEO wins the quoted answer. GEO earns the recommendation inside a generated response. All three read one record.",
        },
      },
      {
        id: "what-each-name-means",
        heading: "What each name actually means",
        paragraphs: [
          "Search engine optimisation is the oldest contest: earn a position on a results page for a typed query. The buyer sees a ranked list, clicks a link, and arrives on a page. The page is the unit of competition, and the click is the prize.",
          "Answer engine optimisation targets the surfaces that answer instead of listing: featured snippets, answer boxes, voice assistants, and the direct answers at the top of AI enhanced results. The prize is being the passage that gets quoted. A page can rank fourth and still own the answer, which makes AEO a contest of passages rather than pages.",
          "Generative engine optimisation targets assistants that compose responses: ChatGPT, Gemini, Claude, Perplexity, and the AI modes inside the search engines themselves. These systems answer from a blend of trained memory and live retrieval, and they name a small set of brands rather than listing ten links. The unit of competition is the entity: the brand as a thing the model knows, filed under a category, attached to situations.",
        ],
        bullets: [
          "SEO: the page competes, measured in rankings and clicks.",
          "AEO: the passage competes, measured in answers owned.",
          "GEO: the entity competes, measured in mentions and citations inside generated responses.",
        ],
      },
      {
        id: "the-real-difference",
        heading: "The real difference is the unit of competition",
        paragraphs: [
          "Moving from page to passage to entity sounds like jargon until you see what it does to the work. A page can be built in an afternoon. A passage that deserves quoting requires an actual answer, stated plainly enough for a machine to lift. An entity requires years of consistency: the same name, the same category claim, the same description, repeated across every place the business appears until independent sources repeat it too.",
          "That progression quietly moves the contest away from technicians and toward strategists. Rankings could be engineered with links and keywords. Entity strength is built the way reputations are built, and there has never been a shortcut for reputation.",
          "It also explains why the same business can rank well and still be absent from assistant answers. The pages are healthy; the entity is fuzzy. Five descriptions of the business across the web read, to a model, as five weak entities rather than one strong one. The guide on how assistants choose brands covers that failure in detail.",
        ],
        callout: {
          label: "Worth sitting with",
          text: "Rankings could be engineered. Entity strength is reputation, and reputation has no shortcut. That is good news for anyone doing real work.",
        },
      },
      {
        id: "the-shared-foundation",
        heading: "The shared foundation the acronyms hide",
        paragraphs: [
          "Strip the labels and the practical checklist for all three surfaces is nearly identical. Crawlable pages with stable URLs. A conclusion stated in the first paragraph rather than after eight hundred words of warm up. Structured data naming the organisation, the author, the article, and the questions answered. Plain language a machine can quote without editing. Dates that show the record is maintained.",
          "Then the off page half, which the acronym industry keeps rediscovering: corroboration. Reviews where crawlers read them. Press and podcast appearances that repeat the same core sentence. Directory entries that agree with the website. Forum threads where real people describe the business the way the business describes itself.",
          "A team that builds this once has done SEO, AEO, and GEO in the same motion. A team that buys them as three services pays three times for one record, and usually ends up with three slightly different descriptions of itself, which is the one outcome that damages all three surfaces at once.",
        ],
      },
      {
        id: "how-buying-behaviour-splits",
        heading: "How buying behaviour splits across the three surfaces",
        paragraphs: [
          "The surfaces deliver different buyers. Search still delivers the largest volume, arriving mid decision with a query in hand. Answer surfaces deliver fewer clicks, because the answer often satisfies the question on the spot; what they deliver instead is authority, since being the quoted source is a public credential.",
          "Assistant surfaces deliver the fewest visitors and the warmest ones. A buyer who arrives from a recommendation has already been told you are the answer, so the conversation starts later in the decision. Early studies of assistant referred traffic keep finding the same shape: small volume, high intent.",
          "For a service business selling few, large engagements, that shape is close to ideal. Ten visitors carrying a recommendation are worth more than a thousand browsing a list. Which is why the smallest firms, the ones that could never win volume contests, have the most to gain from the entity contest.",
        ],
      },
      {
        id: "where-a-small-team-spends-first",
        heading: "Where a small team should spend first",
        paragraphs: [
          "The order is fixed by dependency, and it is the order in the framework above. Entity consistency comes first because every other signal attaches to it; corroboration of a fuzzy entity corroborates noise. Situated answers come second because they are the retrieval keys: buyers phrase prompts as situations, and the brand recorded as the answer to a situation gets retrieved for it.",
          "Corroboration comes third, and it is the slowest, because other people control it. It accumulates at the speed others publish: a client writes up the project, a journalist quotes the founder, a forum thread names the firm. The work is earning those repetitions, then making the repeated sentence easy to say.",
          "What should come last is the thing most teams do first: tooling. Rank trackers, mention monitors, and GEO dashboards measure the record; they never build it. Measurement before substance is how a small budget disappears.",
        ],
        bullets: [
          "Week one: write the entity sentence and install it everywhere, verbatim.",
          "Month one: publish direct answers to the five questions buyers actually ask.",
          "Quarter one: gather three independent sources repeating the entity sentence in public.",
          "Ongoing: refresh dates, add answers, and keep every new mention on the same sentence.",
        ],
      },
      {
        id: "what-this-library-practises",
        heading: "What this library practises",
        paragraphs: [
          "The site you are reading runs on this method deliberately. Each guide answers one situated question a founder asks, states its answer in the opening block, carries question and answer markup, and uses the same vocabulary as every other page. The glossary gives each term of that vocabulary a stable URL of its own.",
          "That is availability work wearing an editorial coat: every guide records the practice as the answer to one more buying situation, for human readers and machine readers alike. The acronyms will keep changing. The record compounds regardless of what the surfaces are called this year.",
        ],
      },
    ],
    faq: [
      {
        question: "Is AEO just SEO with a new name?",
        answer:
          "The overlap is large and the difference is real. Both need crawlable pages, structured data, and technical health. SEO competes for a ranked position; AEO competes to be the quoted answer itself, which rewards direct answers, question markup, and passages written plainly enough to lift. A page can rank well and still lose every answer box on the query.",
      },
      {
        question: "Does GEO replace SEO?",
        answer:
          "Search volume remains far larger than assistant volume in 2026, so abandoning search would be premature. The sensible reading is that GEO extends the same record to a new surface. Work that serves GEO, entity consistency, direct answers, corroboration, also strengthens rankings, so the budget question is about sequence rather than replacement.",
      },
      {
        question: "What does GEO stand for in marketing?",
        answer:
          "In this context GEO means generative engine optimisation: the practice of making a brand retrievable and quotable by AI assistants such as ChatGPT, Gemini, and Perplexity. It is unrelated to geographic targeting, which older marketing material also abbreviates as geo. The collision of the two abbreviations causes real confusion in briefs, so spell the discipline out once in any document that uses it.",
      },
      {
        question: "Which matters most for a service business?",
        answer:
          "Entity strength, because service purchases run on trust and shortlists. A service buyer asks an assistant for two or three names, then verifies them. Appearing in that shortlist depends on being one clearly described entity attached to the buyer's situation, which is brand work. Volume tactics matter more for businesses selling many small transactions.",
      },
      {
        question: "How do you measure AEO and GEO?",
        answer:
          "Directly: run the twenty prompts your buyers would run, across the major assistants, monthly, and record which brands get named and which sources get cited. Add referral traffic from assistant domains and the answers owned on your core queries. The sample is small and the signal is honest, and it costs nothing beyond an hour of attention.",
      },
    ],
    relatedSlugs: [
      "how-ai-assistants-choose-brands-to-recommend",
      "generative-engine-optimisation-guide",
      "brand-awareness-vs-brand-recall",
    ],
    sources: [
      {
        title: "GEO: Generative Engine Optimization",
        publisher: "Aggarwal et al., KDD 2024",
        url: "https://arxiv.org/abs/2311.09735",
        note: "The Princeton led study that introduced the term GEO and measured which source attributes raise inclusion in generated answers.",
      },
      {
        title: "What is generative engine optimization (GEO)?",
        publisher: "Search Engine Land",
        url: "https://searchengineland.com/what-is-generative-engine-optimization-geo-444418",
        note: "Industry definition of GEO and its relationship to classical search optimisation.",
      },
      {
        title: "SEO panel agrees: brand is the new backlink for AI SEO",
        publisher: "Search Engine Journal",
        url: "https://www.searchenginejournal.com/seo-panel-agrees-brand-is-the-new-backlink-for-ai-seo/578567/",
        note: "Practitioner consensus that brand recognition has become the strongest signal for inclusion in AI generated answers.",
      },
    ],
  },
  {
    slug: "generative-engine-optimisation-guide",
    title: "Generative engine optimisation, without the tricks",
    seoTitle: "Generative Engine Optimization (GEO): a founder's guide",
    excerpt:
      "GEO decides whether AI assistants name your business or a competitor's. This guide explains what the research measured, which parts you control, and a ninety day sequence that holds.",
    directAnswer:
      "Generative engine optimisation, GEO, is the practice of making a business retrievable and quotable by AI assistants such as ChatGPT, Gemini, and Perplexity. The controlled research on it found that sources adding quotations, statistics, and citations raised their presence in generated answers by around forty percent, while surface polish alone did little. In practice GEO means five moves: one consistent entity description everywhere, direct answers to real buying questions, structured data naming the entity, vocabulary published on stable URLs, and third party corroboration. Tricks decay with every model release; the record compounds.",
    element: "space",
    topicSlug: "brand-memory",
    primaryKeyword: "generative engine optimisation",
    secondaryKeywords: [
      "generative engine optimization",
      "geo marketing",
      "how to appear in chatgpt answers",
      "ai search for small business",
      "geo strategy for service businesses",
      "llm optimization",
    ],
    searchIntent:
      "Understand how generative engine optimisation works, what evidence supports it, and how a small service business should sequence it.",
    publishedAt: "2026-09-18",
    updatedAt: "2026-09-18",
    readingTime: "12 min read",
    heroImage: "/images/generated/insights-v2/page-evidence-audit.webp",
    heroVideo: "/videos/generated/insights-v2/page-evidence-audit.mp4",
    heroImageAlt:
      "An evidence audit laid out on a desk: source cards, a magnifier, and one claim traced through several independent records",
    keyTakeaways: [
      "Generative engines answer from trained memory plus live retrieval, so GEO works on both: the long record and the quotable page.",
      "The controlled study behind the term found quotations, statistics, and citations raised inclusion in answers by roughly forty percent; polish alone moved little.",
      "You control the entity, the answers, and the markup. Other people control the corroboration, which is why it convinces machines.",
      "Forum presence matters because assistants read the places categories get discussed: Reddit threads and Quora answers are part of the record now.",
      "Every trick aimed at the current model dies with the next release. Conditions aimed at memory survive every release.",
    ],
    framework: {
      title: "The quotable record",
      introduction:
        "GEO reduces to making one entity easy to retrieve and its pages easy to quote. Five moves, in dependency order.",
      steps: [
        {
          title: "Fix the entity",
          description:
            "One sentence with name, category, and audience, installed verbatim across the site, profiles, and directories before anything else.",
        },
        {
          title: "State answers first",
          description:
            "Each page opens with its conclusion in two or three quotable sentences. Assistants excerpt openings, so bury the answer and the page goes unquoted.",
        },
        {
          title: "Add the evidence layer",
          description:
            "Quotations, numbers, and named sources inside the writing. The controlled research found this is what raises inclusion, more than any polish.",
        },
        {
          title: "Mark up the record",
          description:
            "Organisation, person, article, FAQ, and definition schema, so every answer is filed under the right entity.",
        },
        {
          title: "Earn the echo",
          description:
            "Reviews, press, directories, and forum threads repeating the entity sentence. Corroboration is the signal a model trusts most.",
        },
      ],
    },
    sections: [
      {
        id: "what-geo-is",
        heading: "What generative engine optimisation is",
        paragraphs: [
          "Generative engine optimisation is the practice of making a business retrievable, trustable, and quotable by systems that compose answers: ChatGPT, Gemini, Claude, Perplexity, and the AI modes inside search engines. Where classical search returns ten links, a generative engine returns one response, and it names a small number of brands and sources inside it.",
          "The term entered the literature through a 2024 study by researchers at Princeton and collaborators, who tested which attributes of a source raise its presence in generated answers. The name stuck because it describes a genuinely new surface: a response that is assembled rather than ranked, drawing on the engine's trained memory and whatever it retrieves live.",
          "That dual mechanism is the key to the whole discipline. Trained memory rewards the long record: years of consistent description and third party mention. Live retrieval rewards the quotable page: a direct answer a system can lift today. GEO that works addresses both; GEO that chases one usually decays.",
        ],
        callout: {
          label: "Definition",
          text: "GEO makes a business easy for AI assistants to retrieve from memory and easy to quote from the page. Both halves are required.",
        },
      },
      {
        id: "how-engines-assemble-answers",
        heading: "How a generative engine assembles an answer",
        paragraphs: [
          "When a buyer asks an assistant who should reposition their firm before a funding round, the system does something recognisable. It retrieves candidate entities from its trained impression of the world, optionally runs a live search to refresh and verify, then composes a response that names a few brands and cites a few sources.",
          "Each stage has its own gate. Retrieval requires the brand to exist as a clear entity attached to the category and situation in question. Verification requires the live record to agree with the trained impression. Composition requires passages plain enough to quote and safe enough to repeat: hedged, vague, or salesy text gets paraphrased away or dropped.",
          "A business can fail at any gate invisibly. The most common failure is the first one: the brand was never recorded as an answer to the situation being asked about, so retrieval has nothing to find. Writing that records the brand against real buying situations is therefore the core GEO activity, which is also a fair description of a positioning content programme.",
        ],
      },
      {
        id: "what-the-research-found",
        heading: "What the research actually measured",
        paragraphs: [
          "The KDD study tested nine interventions on thousands of queries and measured how each changed a source's share of the generated answer. The findings are refreshingly specific. Adding quotations, adding statistics, and adding citations to credible sources each raised inclusion substantially, with gains up to around forty percent on the study's metrics. Keyword stuffing did little. Fluency edits alone did little.",
          "Read plainly: generative engines reward pages that look like evidence and ignore pages that look like advertising. A page carrying named sources, real numbers, and quotable sentences reads as a record worth repeating. A page of adjectives reads as noise, however well it once ranked.",
          "The study also found effects varied by domain, with smaller and lower ranked sites gaining the most from the evidence interventions. That is worth underlining for any small firm: this surface is the first one in decades where the incumbents' link advantage counts for less than the quality of the record.",
        ],
        callout: {
          label: "The evidence rule",
          text: "Engines quote what looks like evidence: numbers, sources, quotations. They drop what looks like advertising.",
        },
      },
      {
        id: "the-parts-you-control",
        heading: "The parts a service business controls",
        paragraphs: [
          "Four assets are fully in your hands. The entity sentence: name, category, audience, in one line, repeated verbatim everywhere the business appears. The answer library: one page per real buying question, each opening with its conclusion. The markup: organisation, person, article, FAQ, and definition schema connecting every page to the entity. The vocabulary: a glossary giving each term the practice uses its own stable URL.",
          "Two habits multiply all four. Dates that move: engines and their retrieval layers favour records that show maintenance, so update pages and say when. And internal agreement: every page using the same terms for the same ideas, because a site that argues with itself reads as an unreliable witness.",
          "None of this requires new tooling. It requires editorial discipline, which is cheaper and rarer.",
        ],
        bullets: [
          "One entity sentence, installed verbatim across site, profiles, and directories.",
          "One page per buying question, answer stated in the first block.",
          "Schema for organisation, person, articles, FAQs, and definitions.",
          "A glossary URL for every term the practice uses.",
          "Visible update dates and consistent vocabulary sitewide.",
        ],
      },
      {
        id: "the-parts-others-control",
        heading: "The parts other people control",
        paragraphs: [
          "Corroboration is the half of GEO you can only earn. Models weight agreement between independent sources far above anything a brand says about itself: reviews, press mentions, directory listings, podcast appearances, and client write ups that repeat the same description of the business.",
          "Forums deserve specific attention. The places categories get discussed, Reddit threads, Quora answers, industry communities, are heavily represented in what assistants read and cite. A founder answering real questions there, under a real name, with the patience to be useful before being findable, is writing the training data of the next model release. The same behaviour done as disguised advertising gets downvoted by humans first and filtered by machines second.",
          "The practical craft is making the echo easy: an entity sentence short enough for a journalist to quote whole, project stories a client can republish, and answers so clear that a stranger citing you gets the description right by accident.",
        ],
      },
      {
        id: "tactics-that-decay",
        heading: "Tactics that decay, conditions that compound",
        paragraphs: [
          "Every new surface breeds tricks, and this one already has a full menu: text written for models and hidden from people, fake statistics inserted to trigger the evidence preference, prompt injection buried in pages, review astroturfing at scale. Each works briefly, on one model, until the next release closes the gap, and detection now carries reputational cost in the record itself.",
          "The decay argument is structural rather than moral. A trick targets the current model's weighting; the weighting is the one thing guaranteed to change. Conditions target memory itself, one clear entity, real answers, independent corroboration, and memory mechanics survive every release because each new model relearns the world from the same record.",
          "This is the old distinction between campaign and brand, replayed on a new surface. Campaigns spike and vanish. The brands that keep getting named are the ones that spent years being one consistent, corroborated thing.",
        ],
      },
      {
        id: "a-ninety-day-sequence",
        heading: "A ninety day sequence that holds",
        paragraphs: [
          "Days one to fifteen: write the entity sentence, install it everywhere, and run the baseline. Twenty buyer prompts across the major assistants, recorded in a spreadsheet: which brands get named, which sources get cited, where you appear and where you are absent.",
          "Days fifteen to sixty: publish the answer library. One page per buying question from the baseline, each opening with a direct answer, carrying question markup, real numbers, and named sources. Fix the schema and the glossary in the same pass.",
          "Days sixty to ninety: start the echo. Two or three client write ups published under real names, directory entries corrected to the entity sentence, and honest participation in the two forums where your category actually gets discussed. Then rerun the baseline and compare. Expect movement in live retrieval assistants first; trained memory follows over quarters, and it follows the record you have now started keeping.",
        ],
      },
    ],
    faq: [
      {
        question: "Does GEO work for a small business with a small site?",
        answer:
          "The research suggests small sites gain the most. The controlled study found lower ranked sources benefited disproportionately from adding quotations, statistics, and citations, because generative engines weight the quality of the record above the volume of links. A twenty page site with one clear entity and direct answers can outperform a large site that describes itself five different ways.",
      },
      {
        question: "Is schema markup required for GEO?",
        answer:
          "Required is too strong; strongly favoured is accurate. Structured data resolves the entity question, telling every crawler which organisation and person a page belongs to, and question markup hands assistants ready made answer pairs. Sites appear in generated answers without it, but a small business fighting for retrieval should take every disambiguation it can get.",
      },
      {
        question: "Do Reddit and Quora actually influence AI answers?",
        answer:
          "Yes, visibly. Forum content is heavily represented in training data and in the live sources assistants cite, because it reads as independent discussion rather than marketing. Genuine answers under a real name, in threads where your category gets discussed, become part of the record models learn from. Disguised advertising fails twice: humans downvote it and platforms remove it before machines ever weigh it.",
      },
      {
        question: "How long before GEO shows results?",
        answer:
          "Assistants that browse live can reflect a new direct answer within weeks of it being crawled. The deeper effect, being retrieved from trained memory, moves on model release cycles and corroboration speed, so quarters rather than weeks. Run the same twenty prompt baseline monthly and judge the trend, since single answers vary run to run.",
      },
      {
        question: "Should GEO replace the SEO budget?",
        answer:
          "Redirecting is wiser than replacing. Search still carries most commercial volume in 2026, and nearly everything GEO rewards also strengthens search: direct answers, structured data, entity consistency, real evidence. The spend to cut is the part aimed purely at rankings volume, thin keyword pages and link buying, which the generative surfaces actively ignore.",
      },
    ],
    relatedSlugs: [
      "aeo-vs-seo-vs-geo",
      "how-ai-assistants-choose-brands-to-recommend",
      "why-ai-content-makes-brands-average",
    ],
    sources: [
      {
        title: "GEO: Generative Engine Optimization",
        publisher: "Aggarwal et al., KDD 2024",
        url: "https://arxiv.org/abs/2311.09735",
        note: "The controlled study behind the discipline: nine interventions tested across thousands of queries, with quotations, statistics, and citations raising answer inclusion by up to around forty percent.",
      },
      {
        title: "What is generative engine optimization (GEO)?",
        publisher: "Search Engine Land",
        url: "https://searchengineland.com/what-is-generative-engine-optimization-geo-444418",
        note: "Industry framing of GEO, its overlap with classical search work, and the surfaces it covers.",
      },
      {
        title: "How Brands Grow: What Marketers Don't Know",
        publisher: "Byron Sharp, Oxford University Press",
        url: "https://marketingscience.info/learn-with-us/books",
        note: "The evidence base for mental availability and category entry points, the memory mechanics this guide applies to machine retrieval.",
      },
    ],
  },
];
