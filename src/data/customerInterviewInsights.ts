import type { InsightPost } from "@/data/insights";

type InsightResearchSource = {
  title: string;
  publisher: string;
  url: string;
  note?: string;
};

type SourcedInsightPost = InsightPost & {
  sources: InsightResearchSource[];
};

export const customerInterviewInsightPosts: SourcedInsightPost[] = [
  {
    slug: "customer-interviews-brand-strategy",
    title: "How to run customer interviews for brand strategy without collecting polite answers",
    seoTitle: "Customer interviews for brand strategy",
    excerpt:
      "A practical interview method for uncovering buying situations, alternatives, decision language, proof, and memory without leading customers toward the answer the business hopes to hear.",
    directAnswer:
      "Customer interviews for brand strategy should focus on specific past decisions rather than broad opinions. Recruit customers from different decision states, ask them to reconstruct what was happening before they bought, which alternatives they considered, what created confidence, what almost stopped the decision, and how they describe the business now. Use open, neutral questions, probe for examples, separate observation from interpretation, and analyse repeated patterns across interviews before turning any quote into positioning.",
    element: "earth",
    topicSlug: "positioning",
    primaryKeyword: "customer interviews for brand strategy",
    secondaryKeywords: [
      "brand research interviews",
      "customer interview questions branding",
      "qualitative research brand strategy",
      "customer discovery interviews",
      "brand strategy research",
      "customer interview guide",
    ],
    searchIntent:
      "Learn how to plan, conduct, and analyse customer interviews that produce useful evidence for positioning, messaging, and brand strategy.",
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    readingTime: "14 min read",
    heroImage: "/images/pixabay-stream-mist-rays-poster.jpg",
    heroVideo: "/videos/pixabay-stream-mist-rays.mp4",
    heroImageAlt:
      "A stream emerging through mist and light, representing customer research that reveals the path behind a buying decision",
    keyTakeaways: [
      "Ask about real past behaviour before asking for opinions about the brand.",
      "Neutral, open questions reveal more useful language than questions that contain the preferred answer.",
      "Interview customers from different decision states instead of collecting only happy-client testimony.",
      "Analyse situations, alternatives, triggers, doubts, proof, and remembered language as separate evidence categories.",
      "A small qualitative sample can reveal patterns and hypotheses, while prevalence still requires broader measurement.",
    ],
    framework: {
      title: "The decision reconstruction",
      introduction:
        "Five stages move the interview from general memory into the concrete sequence that shaped the customer's choice.",
      steps: [
        {
          title: "Context",
          description:
            "Reconstruct what was happening in the business or customer life before the search began.",
        },
        {
          title: "Trigger",
          description:
            "Find the event, frustration, ambition, deadline, or risk that moved the problem from background to action.",
        },
        {
          title: "Alternatives",
          description:
            "Identify what else the customer considered, including doing nothing, hiring internally, or solving the problem another way.",
        },
        {
          title: "Confidence",
          description:
            "Trace the proof, language, people, artefacts, and moments that reduced uncertainty enough for the decision to move forward.",
        },
        {
          title: "Memory",
          description:
            "Capture what the customer now repeats, remembers, recommends, and believes the business is especially useful for.",
        },
      ],
    },
    sections: [
      {
        id: "why-opinion-questions-fail",
        heading: "Why brand interviews fail when they begin with opinions",
        paragraphs: [
          "Questions such as What do you think of our brand? and What values matter to you? invite abstraction. Customers can usually produce a reasonable answer, yet the response may have little relationship with the decision that brought them to the business.",
          "Brand strategy needs behavioural context. The useful material sits in the sequence: what changed, why the problem became urgent, which alternatives entered the frame, what created doubt, which evidence mattered, and what language the customer used before the company supplied its own terminology.",
          "Harvard Business Review has recommended interviews over lightweight survey questions when deeper customer reasoning matters, with open-ended questions about how people made decisions. That distinction is central here: the interview is a reconstruction of choice rather than a request for compliments.",
        ],
        callout: {
          label: "Interview rule",
          text:
            "Ask customers to remember a decision before asking them to evaluate a brand. Behaviour gives opinion somewhere solid to stand.",
        },
      },
      {
        id: "define-research-question",
        heading: "Start with one research question the strategy must answer",
        paragraphs: [
          "Customer research becomes muddy when the interview guide tries to solve positioning, naming, pricing, product design, satisfaction, onboarding, and campaign testing at the same time. Define the decision the research needs to improve.",
          "A positioning study might ask: which buying situations make the business most relevant, which alternatives do customers compare, and which distinctive choices create belief? A messaging study might ask which problem language customers naturally use and which proof changes confidence.",
          "Write the research question before the interview questions. Every prompt should earn its place by contributing evidence to that decision.",
        ],
      },
      {
        id: "recruit-decision-states",
        heading: "Recruit customers from different decision states",
        paragraphs: [
          "Satisfied clients are easy to reach and usually generous, which makes them dangerous as the entire sample. They can explain value, yet they cannot reveal every reason another prospect hesitated, selected a competitor, delayed the decision, or misunderstood the offer.",
          "Build a small purposive sample across decision states. Include recent buyers, established clients, lost opportunities where appropriate, dormant customers, referrals, and prospects who reached meaningful evaluation. The mix depends on the research question.",
          "Qualitative interviews describe the range and texture of experiences rather than the prevalence of each view. UK government guidance makes the same distinction: interviews can provide depth with relatively small numbers, while they cannot establish how common each perspective is across a population.",
        ],
        bullets: [
          "Recent buyer: remembers the decision sequence with less hindsight distortion.",
          "Established client: can compare the promise with the delivered experience.",
          "Repeat client: reveals what made the relationship worth choosing again.",
          "Lost opportunity: can expose comparison criteria and unresolved risk.",
          "Dormant customer: can reveal where relevance faded after earlier value.",
        ],
      },
      {
        id: "neutral-guide",
        heading: "Build a semi-structured guide with neutral questions",
        paragraphs: [
          "A semi-structured guide provides consistency across interviews while leaving room to follow unexpected evidence. Government qualitative-research guidance recommends open-ended discussion guided by a plan, with the freedom to reorder questions and probe relevant details.",
          "Remove leading language during review. How important was our strategic approach? already tells the participant which feature deserves importance. What made you take the conversation seriously? leaves the evidence open.",
          "Use familiar language and short prompts. Long questions often smuggle several assumptions into one sentence and make it difficult to know which part the participant answered.",
        ],
        bullets: [
          "Instead of: Did our expertise make you trust us? Ask: What gave you confidence, if anything?",
          "Instead of: Was the website clear? Ask: What did you understand the business to offer after your first visit?",
          "Instead of: Why did you love the process? Ask: What stood out during the process?",
          "Instead of: Would you recommend us? Ask: When would you think of recommending this business to someone?",
        ],
      },
      {
        id: "opening-context",
        heading: "Open with facts before interpretation",
        paragraphs: [
          "Begin with easy factual orientation: role, company stage, approximate timing, existing relationship, and what was happening before the problem became active. This helps the participant enter the memory rather than perform an evaluation immediately.",
          "Then ask for a specific moment. Tell me about the period when you first started looking for help. What had changed? What made the existing approach insufficient? Where did you begin?",
          "The UK Home Office has advised interviewers to use closed questions where useful for establishing facts and open questions for deeper exploration, while avoiding leading prompts. That sequence works well for customer research because it creates context before interpretation.",
        ],
      },
      {
        id: "reconstruct-trigger",
        heading: "Reconstruct the trigger that moved the customer into action",
        paragraphs: [
          "A buyer may have lived with a problem for months before taking action. The trigger explains when background dissatisfaction crossed the threshold into a buying situation.",
          "Ask what happened immediately before the search, which deadline or consequence appeared, who else became involved, and why the customer could no longer leave the problem alone. The answer often reveals a stronger positioning cue than demographic segmentation.",
          "Jobs to Be Done research emphasises the circumstances in which people seek progress rather than customer characteristics alone. For brand strategy, those circumstances can reveal when the business should become mentally available.",
        ],
      },
      {
        id: "map-alternatives",
        heading: "Ask about the full alternative set",
        paragraphs: [
          "Competitors are only part of the decision. A service buyer may compare an agency with a freelancer, an internal hire, software, a course, a lower-scope engagement, or simply waiting another quarter.",
          "Ask which options entered the conversation, which one initially seemed safest, what each option appeared to offer, and why some were removed from consideration. The language reveals the customer's actual category frame.",
          "This matters because positioning against the wrong competitive set produces elegant irrelevance. The market may be comparing the business with a completely different solution than the company monitors in competitor decks.",
        ],
      },
      {
        id: "trace-confidence",
        heading: "Trace what created and destroyed confidence",
        paragraphs: [
          "Buying a service means evaluating promises before the outcome exists. Confidence is therefore built through signals: referrals, case studies, specificity, process clarity, founder presence, credentials, work samples, responsiveness, price logic, or the quality of questions asked during sales.",
          "Ask for moments rather than attributes. What happened that made you think this could work? Was there anything that made you hesitate? What did you need to see before moving ahead? Who else needed convincing?",
          "Record both positive and negative evidence. Positioning becomes stronger when the business understands which doubts require proof instead of merely collecting reasons customers already agreed.",
        ],
      },
      {
        id: "capture-language",
        heading: "Capture the customer's language before translating it",
        paragraphs: [
          "Customers often describe a problem more usefully than the business does because they speak from the situation rather than the service taxonomy. Preserve exact phrases when they are distinctive, repeated, or emotionally specific.",
          "Ask how the customer described the problem internally, what they typed into search, what they told a colleague, and how they would now explain the business to someone unfamiliar with it.",
          "Separate verbatim language from the researcher's interpretation in the notes. This prevents an early strategic hypothesis from quietly rewriting the evidence during synthesis.",
        ],
        callout: {
          label: "Language rule",
          text:
            "Preserve the customer's sentence while taking notes. Awkward language can contain the exact tension polished brand language erased.",
        },
      },
      {
        id: "probe-without-leading",
        heading: "Probe deeper without handing over the answer",
        paragraphs: [
          "Useful probes invite specificity: What happened next? Can you give me an example? What made that important? What do you mean by clear? What were you comparing it with? How did you know that?",
          "Silence is also a research tool. Government interview guidance notes that pauses can mean the participant is thinking. Filling every silence with another prompt can interrupt the very recall the interview needs.",
          "Keep your reaction neutral when the answer contradicts the brand story. Surprise, approval, or defence can teach the participant which answers feel socially welcome.",
        ],
      },
      {
        id: "memory-questions",
        heading: "End with memory and recommendation questions",
        paragraphs: [
          "Once the decision and experience have been reconstructed, ask what remains. What do you remember most clearly? Which phrase or idea would you use to describe the company? When would this business come to mind again? What kind of person or situation would make you recommend it?",
          "These questions help distinguish satisfaction from memory. A client can be highly satisfied while remembering only generic competence. That gap matters for brand salience and referral behaviour.",
          "Compare remembered language with the position the business intends to own. Alignment suggests that repeated experience is teaching the desired association. Divergence reveals where the message, proof, or experience is producing another meaning.",
        ],
      },
      {
        id: "analyse-evidence",
        heading: "Analyse evidence by decision pattern before quote popularity",
        paragraphs: [
          "After each interview, summarise the context, trigger, alternatives, doubts, confidence signals, language, outcome, and memory while the conversation is fresh. Then code recurring patterns across interviews.",
          "Look for repeated buying situations, shared alternatives, common proof needs, surprising language, and meaningful exceptions. A vivid quote from one customer can inspire a hypothesis, yet repetition across several relevant interviews gives the pattern more strategic weight.",
          "Keep a contradiction log. When two customers describe the same service differently, the difference may come from segment, stage, referral source, engagement type, or inconsistent delivery. Contradictions often contain the most useful segmentation evidence.",
        ],
        bullets: [
          "Situation: what made the business relevant?",
          "Trigger: why did action happen then?",
          "Alternative: what else could solve the problem?",
          "Doubt: what slowed belief?",
          "Proof: what increased confidence?",
          "Language: which words appeared without prompting?",
          "Memory: what survived after delivery?",
        ],
      },
      {
        id: "from-interviews-to-strategy",
        heading: "Turn interviews into hypotheses, then validate the important ones",
        paragraphs: [
          "Qualitative research reveals mechanisms, meanings, language, and patterns. Prevalence across the wider market requires a separate quantitative design.",
          "Use interview findings to create strategic hypotheses: a buying situation that may deserve priority, an alternative customers compare, a proof gap, a message customers already repeat, or a segment with a different decision process.",
          "Then validate high-consequence hypotheses with other evidence where available: CRM patterns, win-loss data, search behaviour, sales-call notes, analytics, surveys, proposal progression, and observed customer behaviour. Strategy becomes stronger when different evidence sources converge.",
        ],
      },
      {
        id: "interview-sprint",
        heading: "A practical two-week customer interview sprint",
        paragraphs: [
          "During days one and two, define the research decision, participant mix, recruitment criteria, consent process, and topic guide. Pilot the guide with one conversation and remove questions that produce abstractions or repeated answers.",
          "During days three through eight, conduct interviews and summarise each one immediately. Keep the guide stable enough for comparison while allowing useful probes to evolve.",
          "During days nine through twelve, code the evidence, map patterns and contradictions, and separate direct evidence from interpretation. During days thirteen and fourteen, turn the strongest patterns into positioning, messaging, journey, or proof hypotheses and decide which require broader validation.",
        ],
        callout: {
          label: "Research discipline",
          text:
            "The goal is to understand the decision reality well enough to make a sharper strategic choice; customers provide evidence while leadership owns the strategy.",
        },
      },
    ],
    faq: [
      {
        question: "How many customer interviews are enough for brand strategy?",
        answer:
          "There is no universal number. A focused qualitative study often begins with a small purposive sample and continues until useful patterns repeat and new interviews add diminishing strategic insight. The appropriate number depends on audience diversity, decision complexity, and the research question.",
      },
      {
        question: "Who should be interviewed for brand research?",
        answer:
          "Choose participants according to the decision being studied. Useful groups can include recent buyers, repeat clients, established customers, lost opportunities, dormant customers, referral partners, and prospects who reached serious evaluation.",
      },
      {
        question: "What are the best customer interview questions for positioning?",
        answer:
          "Ask what was happening before the search, what triggered action, which alternatives were considered, what created confidence, what caused hesitation, what language the customer used for the problem, and how they now describe the business to others.",
      },
      {
        question: "Should customer interviews be recorded?",
        answer:
          "Recording can improve accuracy when participants give informed permission and the business has an appropriate privacy and storage process. If recording is unsuitable, use a dedicated note-taker or detailed immediate write-up.",
      },
      {
        question: "How do you avoid leading questions in customer interviews?",
        answer:
          "Remove preferred attributes and conclusions from the question. Ask neutral, open prompts about specific events, examples, comparisons, and decisions, then use short probes such as what happened next or what made that important.",
      },
      {
        question: "Can interviews prove that most customers think the same way?",
        answer:
          "No. Qualitative interviews can reveal the range, depth, mechanisms, and language of customer experiences. Broader prevalence claims require appropriately designed quantitative evidence.",
      },
    ],
    relatedSlugs: [
      "brand-positioning-strategy-service-businesses",
      "customer-journey-mapping-service-businesses",
      "turn-client-proof-into-positioning-advantage",
    ],
    sources: [
      {
        title: "Instead of Surveying Your Customers, Interview Them",
        publisher: "Harvard Business Review",
        url: "https://hbr.org/tip/2019/05/dont-survey-your-customers-interview-them",
        note:
          "Open-ended interview questions and decision-focused conversations for deeper customer insight.",
      },
      {
        title: "Jobs to Be Done: A Toolbox",
        publisher: "Harvard Business School",
        url: "https://store.hbr.org/product/jobs-to-be-done-a-toolbox/321095",
        note:
          "Customer recruitment, interviewing, analysis, and understanding the circumstances behind choices.",
      },
      {
        title: "Interview study: qualitative studies",
        publisher: "GOV.UK",
        url: "https://www.gov.uk/guidance/interview-study-qualitative-studies",
        note:
          "Semi-structured interviews, open-ended discussion, depth, sample limitations, and topic-guide practice.",
      },
      {
        title: "What makes a good interview?",
        publisher: "Home Office Digital",
        url: "https://hodigital.blog.gov.uk/2018/02/06/what-makes-a-good-interview/",
        note:
          "Avoiding leading questions and using open and closed questions appropriately.",
      },
      {
        title: "Ethical considerations associated with Qualitative Research methods",
        publisher: "UK Statistics Authority",
        url: "https://uksa.statisticsauthority.gov.uk/publication/ethical-considerations-associated-with-qualitative-research-methods/pages/3/",
        note:
          "Leading-question bias, neutral probing, topic-guide review, and researcher reflexivity.",
      },
    ],
  },
];
