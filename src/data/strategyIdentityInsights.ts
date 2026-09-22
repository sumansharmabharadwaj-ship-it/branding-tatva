import type { InsightPost } from "@/data/pillarInsights";

// Practical distinctions for commissioning strategy and identity. Examples
// are illustrative; the source notes limit the research claims they support.
type SourcedInsightPost = InsightPost & {
  sources: { title: string; publisher: string; url: string; note?: string }[];
};

export const strategyIdentityInsightPosts: SourcedInsightPost[] = [
  {
    "slug": "brand-strategy-vs-brand-identity",
    "title": "Brand strategy vs brand identity: which does your business need?",
    "seoTitle": "Brand Strategy vs Brand Identity: Differences and Buying Guide",
    "excerpt": "Compare brand strategy and brand identity, see practical UK service business examples, and decide which decisions or design work belong in your brief.",
    "directAnswer": "Brand strategy sets a direction for whom a business serves, how it competes and what its offer should mean to buyers. Brand identity expresses that direction through recognisable visual and verbal elements, such as a name, logo, colour, typography and voice. Start with the unresolved business decision. You may need strategy, identity work or both; an existing strategy can support a focused identity project, and strategic changes can use an existing identity.",
    "element": "earth",
    "topicSlug": "positioning",
    "primaryKeyword": "brand strategy vs brand identity",
    "secondaryKeywords": [
      "difference between brand strategy and brand identity",
      "brand strategy or logo first",
      "what is brand identity",
      "brand strategy definition",
      "branding vs brand identity"
    ],
    "searchIntent": "Understand the difference between strategy and identity and decide what evidence, decisions and design work a service business should commission.",
    "publishedAt": "2026-09-22",
    "updatedAt": "2026-09-22",
    "readingTime": "9 min read",
    "heroImage": "/images/generated/insights-v2/positioning-strategy-spine.webp",
    "heroImageAlt": "A brass rule laid down the centre of a hand drawn map, with glazed ceramic tokens arranged in order along both sides of it",
    "keyTakeaways": [
      "Strategy establishes a direction; identity gives the business a recognisable expression. Define the exact scope because provider terminology varies.",
      "A new logo cannot settle every question about an audience or offer. A new strategy document is unnecessary when the relevant decisions are already clear.",
      "Design and strategy can develop together. Early prototypes may reveal a question that sends the team back to the brief.",
      "Assess existing identity elements before replacing them. Recognition needs evidence from buyers, not an assumption about whether colour or logo matters most.",
      "Compare the research, decisions, finished materials and implementation responsibilities included in each proposal."
    ],
    "framework": {
      "title": "Choose the work around the decision",
      "introduction": "These five prompts are a practical commissioning aid. Return to an earlier question if evidence changes the brief; they are not a rule that every project must follow in a fixed order.",
      "steps": [
        {
          "title": "Name the decision",
          "description": "Describe what your team cannot currently agree: the priority buyer, the offer, the message or how to apply the identity. Separate the symptom from the decision it suggests."
        },
        {
          "title": "Read the evidence",
          "description": "Bring recent enquiries, proposals, customer feedback and existing materials. Record what you know, what you are assuming and what needs further research."
        },
        {
          "title": "Set a direction",
          "description": "Agree the audience and offer the work should serve, the alternatives buyers compare and the evidence behind your promise. Retain decisions that still fit."
        },
        {
          "title": "Try real applications",
          "description": "Test a draft service explanation, proposal or visual treatment in its intended setting. Use what people understand and struggle with to improve the direction."
        },
        {
          "title": "Agree the scope",
          "description": "Name the decisions, assets, applications and support you need. Identify who approves the work, what your team supplies and what will be reviewed after launch."
        }
      ]
    },
    "sections": [
      {
        "id": "why-the-confusion-exists",
        "heading": "Separate the decisions from their expression",
        "paragraphs": [
          "A business asking for “branding” may need several kinds of help. One founder wants to explain a new offer. Another has a clear offer but inconsistent proposals and website pages. A third needs both. The name of the package does not resolve which problem sits in front of you.",
          "For this guide, brand strategy means the choices about the audience, competing alternatives, offer and intended position. Brand identity means the visual and verbal elements through which the business presents itself. Naming and messaging can involve both, so ask a provider to describe the actual work rather than relying on the category label.",
          "Branding Tatva sells strategy and identity services. The decision prompts and examples here reflect our practical approach, with the external references identified where they support a point. They are not a survey of providers or a universal definition of every branding engagement."
        ],
        "callout": {
          "label": "A useful first question",
          "text": "What should the business be able to decide, explain or produce after this project that it cannot do clearly today?"
        }
      },
      {
        "id": "what-strategy-decides",
        "heading": "What a strategy engagement can resolve",
        "paragraphs": [
          "A strategy brief starts with a decision that affects the business. Which customer situation should the offer address? What would that customer choose instead? Which part of the service provides a credible reason to choose you? The work should connect an agreed direction with evidence and the way the service is actually delivered.",
          "Useful inputs may include sales conversations, customer interviews, competitor materials, existing research and the team’s experience. The scope determines what is reviewed or gathered. A workshop can expose disagreement, but it does not by itself establish what customers believe.",
          "Illustrative UK consultancy example: a firm known for general operations support now wants to help organisations prepare for leadership succession. The open questions concern the buyer, the trigger for seeking help, the relevant alternatives and the proof behind the new offer. Those questions deserve attention even if the existing name and visual identity remain suitable. This is a hypothetical brief, not a client result.",
          "The output might be a positioning direction, a clearer service structure and a message hierarchy, with assumptions marked for further testing. The value lies in the decisions people can use. A useful result could change how the team qualifies an enquiry or explains a proposal without requiring a new logo."
        ],
        "bullets": [
          "The buyer and situation the offer will prioritise.",
          "The alternatives buyers compare and the evidence for the proposed position.",
          "The message, service or delivery decisions that follow.",
          "The unresolved assumptions and how the team will investigate them."
        ]
      },
      {
        "id": "what-identity-carries",
        "heading": "What identity work can improve",
        "paragraphs": [
          "Identity work gives people consistent ways to recognise and interpret the business. Depending on the scope, it can cover the name, mark, colour, typography, imagery and verbal expression, together with instructions and applications. The package should identify which elements already exist and which need creating.",
          "Illustrative UK accountancy example: the firm has a settled focus and clients understand its services, but every partner uses a different proposal format. A shared visual system, usable templates and clear instructions may address the immediate problem. Commissioning fresh positioning is a separate decision, supported by evidence that the existing direction needs review.",
          "Jenni Romaniuk’s Ehrenberg Bass guidance assesses distinctive assets through fame and uniqueness: how widely a cue brings the brand to mind and how strongly it points to that brand. Logos, colours and other elements can play a role. That supports assessing the assets you have; it does not establish that colour or voice always contributes more recognition than a logo.",
          "Before changing a familiar element, ask what buyers recognise and what practical problem the change would solve. Your team’s preference for a new look is useful input, but it is different from evidence of customer recognition. The proposed design also needs to work at the sizes and in the materials your business uses."
        ],
        "bullets": [
          "Existing cues: what do buyers recognise and associate with the business?",
          "Usage: can colleagues apply the identity in the tools and formats they use?",
          "Applications: which website, document or other materials need work?",
          "Handover: what instructions, files and agreed rights does the team need?"
        ]
      },
      {
        "id": "the-order-argument",
        "heading": "Choose a sequence that allows learning",
        "paragraphs": [
          "Clarify the brief before committing to finished production. That gives the team a basis for judging the work. A business with an unsettled offer may need research and positioning before approving a new identity; a business with a current, useful strategy may be ready for focused design work.",
          "The Design Council describes its Double Diamond as a process that can return to earlier questions. Making and testing early ideas can be part of discovery. Applied to this buying decision, that means an early visual or message prototype can help test understanding; its existence is not evidence that the provider has skipped strategy.",
          "Agree what each review is meant to decide. An exploratory sketch tests an idea. Approval for production commits the team to a direction. Ask how a finding that challenges the brief will be handled, including its effect on scope and timing.",
          "When budget is limited, identify what can be reused and which decision is most urgent. You might resolve the offer, apply the new explanation to existing materials and commission wider design later. Another business may need a small set of templates first. No fixed percentage split fits both situations."
        ],
        "callout": {
          "label": "Keep the approval clear",
          "text": "Record whether the team is testing an idea, choosing a direction or approving finished work. Those are different decisions."
        }
      },
      {
        "id": "buying-each-well",
        "heading": "Write a brief that separates scope and responsibility",
        "paragraphs": [
          "The Design Business Association recommends looking for the proposed process, timing, cost and deliverables, along with who will be involved. Use those details to compare providers. The label “strategy” or “identity” alone tells you little about the depth of investigation or the finished work.",
          "For a UK brief, ask for the currency and fee to be clear and for applicable taxes, expenses and licence costs to be stated. Provide the business question, the materials already available, your launch date and the approval owner. For remote work, agree meeting times and feedback expectations.",
          "A short engagement can suit a narrow question with good existing evidence. A complex brief may need more research or implementation. Ask how the timetable follows from the work instead of treating a particular number of days as proof of quality.",
          "One provider may cover both strategy and design, or separate specialists may collaborate. Confirm who owns each decision, who prepares each output and how the handover works. At Branding Tatva, bring your current website and a recent proposal to an initial 30 minute conversation so the scope can start with the actual question."
        ],
        "bullets": [
          "Research: which existing evidence is reviewed and which new evidence is gathered?",
          "Decisions: what needs agreeing, by whom and on what basis?",
          "Outputs: which documents, assets and finished applications are included?",
          "Implementation: who puts the work into use and supports the team afterwards?",
          "Changes: how are a revised brief, extra work and approval delays handled?"
        ]
      },
      {
        "id": "where-the-money-compounds",
        "heading": "Plan what happens after the work is delivered",
        "paragraphs": [
          "Reserve time and responsibility for putting the decisions into use. A strategy may need changes to sales language, the service menu or customer handovers. An identity may need templates, a file library and training. These tasks involve effort; include the ones you need in the plan.",
          "Agree observations that match the problem. For unclear messaging, ask people from the intended audience to explain the offer after reading it. For inconsistent materials, review whether the team can use the new templates. For recognition, design an appropriate asset test rather than treating website traffic as a direct measure of memory.",
          "Record a baseline and review changes with the context around them. Enquiries and sales also depend on demand, price, channels and delivery. A branding change alone cannot establish the cause of an increase or decline.",
          "Keep the direction stable where it continues to serve the business, and revisit it when evidence or the business changes. The useful decision is what to retain, what to improve and what to investigate next. Neither a permanent freeze nor a complete redesign is the automatic answer."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can a small business commission a logo without a full strategy project?",
        "answer": "Yes, when the intended audience, offer and design brief are sufficiently clear for the task. Share the decisions and existing evidence with the designer. If those inputs remain uncertain, agree how much clarification is needed before approving the design. A full strategy engagement is one option, not a requirement for every logo."
      },
      {
        "question": "Is a logo the same thing as a brand identity?",
        "answer": "A logo is one identity element. Colour, typography, imagery, voice and other cues may also be included in a wider identity system. The scope should name the elements and applications you need. Which existing cue is strongest requires evidence from the relevant audience."
      },
      {
        "question": "How should a limited budget be split between strategy and identity?",
        "answer": "Start with the unresolved decision and the work required to address it. Reuse suitable research and assets, then price the needed scope and implementation. There is no universal split or rule that strategy must be cheaper. Ask what can be phased without leaving the immediate problem unresolved."
      },
      {
        "question": "Can one provider do both strategy and identity?",
        "answer": "Yes. Ask who leads the research and decisions, who designs the work and how they collaborate. Review evidence of the relevant capabilities and make the responsibilities explicit. Team size alone does not establish quality or whether the proposed scope fits."
      },
      {
        "question": "When can identity change while the strategy stays the same?",
        "answer": "When the existing audience, offer and position remain useful but the expression needs work, such as templates that colleagues cannot use or materials that no longer suit the required channels. Assess recognisable assets before changing them and specify the practical improvement you expect."
      }
    ],
    "relatedSlugs": [
      "value-proposition-vs-positioning-vs-tagline",
      "why-beautiful-brand-identity-can-be-forgettable",
      "distinctive-brand-assets-audit"
    ],
    "sources": [
      {
        "title": "Framework for Innovation",
        "publisher": "Design Council",
        "url": "https://www.designcouncil.org.uk/resources/framework-for-innovation/",
        "note": "Describes a design process that can revisit earlier questions and use early prototypes during discovery. It does not prescribe a branding price or timetable."
      },
      {
        "title": "Brands of Distinction",
        "publisher": "Ehrenberg Bass Institute, Jenni Romaniuk",
        "url": "https://marketingscience.info/news-and-insights/brands-of-distinction",
        "note": "Explains fame and uniqueness when assessing distinctive assets. It does not establish a universal ranking of colours, voice and logos."
      },
      {
        "title": "How to buy design: asking for a proposal document",
        "publisher": "Design Business Association",
        "url": "https://www.dba.org.uk/resources/review-links-how-to-buy-design-08-asking-for-a-proposal-document/",
        "note": "Commissioning guidance on scope, process, people, costs and changes. The UK scenarios and decision prompts in this guide are illustrative practical suggestions."
      }
    ],
    "useEditorialArtwork": false
  }
];
