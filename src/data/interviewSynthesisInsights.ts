import type { InsightPost } from "@/data/insights";

export const interviewSynthesisInsightPosts: InsightPost[] = [
  {
    slug: "turn-customer-interviews-into-positioning-brief",
    title: "How to turn customer interviews into a positioning brief",
    seoTitle: "Turn customer interviews into a positioning brief",
    excerpt:
      "A practical synthesis method for converting interview evidence into audience, category, tension, difference, proof, and message decisions without turning quotes into strategy by accident.",
    directAnswer:
      "Turn customer interviews into a positioning brief by separating observations from interpretations, coding repeated buying situations and alternatives, comparing language across customer groups, ranking patterns by commercial relevance and evidence strength, and then converting the strongest patterns into explicit decisions about audience, category, tension, difference, proof, and message. Keep contradictory evidence visible and record confidence levels so the brief distinguishes what the research strongly supports from what still needs validation.",
    element: "earth",
    topicSlug: "positioning",
    primaryKeyword: "customer interview synthesis for brand strategy",
    secondaryKeywords: [
      "positioning brief template",
      "brand research synthesis",
      "customer interview analysis",
      "brand strategy research",
      "positioning research",
    ],
    searchIntent:
      "Learn how to analyse customer interviews and turn qualitative evidence into a usable brand positioning brief.",
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-07",
    readingTime: "14 min read",
    heroImage: "/images/generated/insights/interview-synthesis-weave.webp",
    heroVideo: "/videos/generated/insights/interview-synthesis-weave.mp4",
    heroImageAlt:
      "Five loose interview strands entering a loom and emerging as one focused positioning brief",
    keyTakeaways: [
      "Interview quotes are evidence fragments; strategy begins when patterns are compared and choices are made.",
      "Separate observation, interpretation, implication, and decision so attractive language does not outrun the evidence.",
      "Weight patterns by commercial relevance, recurrence, specificity, and evidence quality rather than frequency alone.",
      "Keep contradictions visible because different buying situations may require segmentation rather than one averaged story.",
      "A useful positioning brief records confidence and unanswered questions alongside the final decisions.",
    ],
    framework: {
      title: "The evidence-to-decision ladder",
      introduction:
        "Five layers prevent qualitative research from becoming a collage of favourite quotes.",
      steps: [
        { title: "Evidence", description: "Capture observable statements, behaviours, alternatives, triggers, and outcomes without interpretation." },
        { title: "Pattern", description: "Group evidence by buying situation, tension, alternative, criterion, proof, language, and memory." },
        { title: "Meaning", description: "Explain what each pattern suggests about the customer's decision and the category frame." },
        { title: "Choice", description: "Select the audience, tension, difference, proof, and message the business is prepared to prioritise." },
        { title: "Confidence", description: "Record how strongly the evidence supports each choice and what still requires validation." },
      ],
    },
    sections: [
      {
        id: "quotes-are-not-strategy",
        heading: "Customer quotes are evidence, not the positioning strategy",
        paragraphs: [
          "A memorable sentence can dominate a workshop because it sounds true. That makes qualitative research vulnerable to anecdote bias. One articulate customer may describe the problem beautifully while representing a rare buying situation.",
          "Preserve verbatim language, but place it beside context: who said it, what triggered the purchase, which alternatives were considered, what mattered during evaluation, and what happened after the decision. The strategic question is less about which quote sounds best and more about which pattern deserves investment.",
          "Treat the interview corpus as a decision dataset. The output should explain what the business will prioritise because of the evidence, rather than simply summarising what participants said.",
        ],
      },
      {
        id: "separate-four-levels",
        heading: "Separate observation, interpretation, implication, and decision",
        paragraphs: [
          "Write four columns during synthesis. Observation contains the evidence itself. Interpretation explains what the researcher thinks it means. Implication describes the possible consequence for the brand. Decision records what the business chooses to do.",
          "This separation makes assumptions inspectable. A customer saying they hired the firm after a failed internal attempt is an observation. Interpreting that as a demand for specialist rescue is plausible. Choosing to position entirely around rescue work is a much larger decision and needs support from the wider evidence and business direction.",
          "When these levels collapse into one another, strategy can acquire false certainty. Keeping them separate makes disagreement productive because the team can identify whether it disputes the evidence, the interpretation, or the commercial choice.",
        ],
        callout: {
          label: "Synthesis rule",
          text: "Never promote an interpretation into a positioning decision without showing the evidence and the tradeoff behind it.",
        },
      },
      {
        id: "code-decision-evidence",
        heading: "Code interviews around the buying decision",
        paragraphs: [
          "Begin with a small coding system that follows the decision rather than every topic discussed. Useful codes include trigger, previous workaround, alternative, selection criterion, risk, proof, objection, desired progress, outcome, language, and memory.",
          "Add participant attributes only where they may explain meaningful differences: customer stage, service purchased, buying role, business size, geography, or relationship length. Avoid building dozens of demographic tags before the research shows they matter.",
          "A spreadsheet is enough for a small study. Each row can represent one evidence fragment, with columns for participant, code, verbatim text, context, researcher note, and confidence. The aim is traceability rather than research theatre.",
        ],
      },
      {
        id: "build-pattern-matrix",
        heading: "Build a pattern matrix before writing conclusions",
        paragraphs: [
          "Create a matrix with candidate patterns on one axis and participants or segments on the other. Mark where the pattern appears, how specific the evidence is, and whether the participant's behaviour supports the stated opinion.",
          "Frequency matters, but it is not the only signal. A pattern mentioned by fewer customers may still be strategically important if it describes the highest-value buying situation or exposes a distinctive capability competitors rarely provide.",
          "Look for co-occurrence. A trigger may repeatedly appear with one alternative and one proof requirement. Those combinations often reveal a stronger positioning opportunity than isolated themes such as trust or quality.",
        ],
        bullets: [
          "Recurrence: how often does the pattern appear?",
          "Specificity: is the evidence concrete or generic?",
          "Behaviour: does reported action support the statement?",
          "Commercial relevance: does the pattern occur in the customers the business wants more of?",
          "Distinctive potential: could the business credibly own the response?",
        ],
      },
      {
        id: "protect-contradictions",
        heading: "Protect contradictions instead of averaging them away",
        paragraphs: [
          "Contradictory interviews may reveal different buying situations rather than poor research. One group may value senior access while another values process speed. One may compare the business with agencies while another compares it with hiring internally.",
          "Trace contradictions back to context. If different situations consistently produce different alternatives or criteria, the positioning problem may require segmentation, offer architecture, or a clearer priority rather than a sentence broad enough to satisfy everyone.",
          "Record minority patterns that carry high commercial importance. Synthesis should reduce noise without deleting inconvenient evidence.",
        ],
      },
      {
        id: "write-positioning-brief",
        heading: "Convert patterns into six positioning decisions",
        paragraphs: [
          "Write the brief as decisions supported by evidence. Begin with the priority audience and buying situation. Define the category or comparison frame customers already use. Name the tension that creates urgency. State the distinctive choice the business can repeatedly deliver. Attach proof. Then compress the system into a message another person can understand.",
          "For each decision, include evidence references and a confidence rating. High confidence may mean several relevant participants described the same behaviour with concrete examples. Medium confidence may mean the pattern is plausible but uneven. Low confidence belongs in the validation backlog rather than the headline.",
        ],
        bullets: [
          "Audience and buying situation",
          "Category and alternative set",
          "Customer tension and desired progress",
          "Distinctive choice or point of view",
          "Proof and credibility requirements",
          "Message and language worth carrying forward",
        ],
      },
      {
        id: "score-candidate-positions",
        heading: "Score candidate positions before choosing one",
        paragraphs: [
          "Generate a small number of candidate positions from the evidence, then score them against relevance, distinctiveness, credibility, commercial value, operational fit, and memory potential.",
          "A candidate can be strongly supported by customer language and still be a poor strategic choice if the business does not want to build around that demand. Research informs strategy; it does not outsource leadership decisions to the sample.",
          "Document the tradeoff behind the chosen position. Naming what the business is deprioritising makes the decision more durable when new opportunities appear.",
        ],
      },
      {
        id: "validate-brief",
        heading: "Validate the brief against behaviour and touchpoints",
        paragraphs: [
          "Before a full rollout, test whether the proposed position improves understanding in real contexts. Rewrite the homepage opening, one service description, one sales explanation, and one proposal introduction. Ask people to explain the business back after brief exposure.",
          "Return to customers where appropriate with specific comprehension questions rather than asking whether they like the positioning. Observe whether the category, relevance, difference, and proof are understood without extensive explanation.",
          "Keep the research archive connected with the final brief. Future revisions should be able to trace a strategic claim back to evidence rather than reconstructing the rationale from memory.",
        ],
      },
    ],
    faq: [
      { question: "How many customer interviews are needed for positioning research?", answer: "There is no universal number. A focused service-business study can begin with a small purposive sample and continue until additional relevant interviews stop materially changing the important patterns. Diversity of buying situations and evidence quality matter more than chasing an arbitrary count." },
      { question: "How do you analyse qualitative customer interviews?", answer: "Code evidence around decision-relevant themes, compare patterns across participants and segments, preserve contradictions, distinguish observation from interpretation, and connect conclusions back to specific evidence." },
      { question: "Should customer language become the brand message word for word?", answer: "Customer language is valuable evidence for relevance and comprehension, but the final message still needs strategic judgement, differentiation, accuracy, and a recognisable brand voice." },
      { question: "What belongs in a positioning brief?", answer: "A useful brief includes the priority audience and buying situation, category frame, customer tension, distinctive choice, proof, message direction, evidence references, confidence levels, tradeoffs, and unresolved questions." },
      { question: "What if customer interviews contradict the founder's view?", answer: "Investigate the source of the disagreement. The interviews may reveal a market reality, a different customer segment, or a gap between current perception and future ambition. The strategy should state which reality it is responding to and which change the business intends to create." },
      { question: "Can AI summarise customer interviews for brand strategy?", answer: "AI can help organise transcripts and surface candidate themes, but strategic synthesis still requires context, evidence checking, contradiction handling, privacy discipline, and human judgement about commercial priorities and tradeoffs." },
    ],
    relatedSlugs: [
      "customer-interviews-brand-strategy",
      "brand-positioning-strategy-service-businesses",
      "turn-client-proof-into-positioning-advantage",
    ],
  },
];
