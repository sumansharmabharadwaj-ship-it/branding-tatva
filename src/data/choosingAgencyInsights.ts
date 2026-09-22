import type { InsightPost } from "@/data/pillarInsights";

// Agency selection guidance. Practical examples are illustrative; source
// notes distinguish commissioning advice from UK copyright guidance.

type BuyerGuidePost = InsightPost & {
  sources?: { title: string; publisher: string; url: string; note?: string }[];
};

export const choosingAgencyInsightPosts: BuyerGuidePost[] = [
  {
    "slug": "how-to-choose-a-branding-agency",
    "title": "How to choose a branding agency: a practical buyer checklist",
    "seoTitle": "How to Choose a Branding Agency: Questions and Checklist",
    "excerpt": "Compare branding agencies through the brief, relevant work, delivery team and proposal. Includes questions for UK buyers about fees, remote working and usage rights.",
    "directAnswer": "Choose a branding agency by comparing its proposed work with the decision your business needs to make. Give candidates the same brief, examine relevant project evidence, confirm who will deliver the work and resolve scope questions before signing. For a UK engagement, clarify the billing currency, meeting arrangements and rights to use the finished work. A portfolio, fee or team size alone cannot establish fit.",
    "element": "earth",
    "topicSlug": "positioning",
    "primaryKeyword": "how to choose a branding agency",
    "secondaryKeywords": [
      "questions to ask a branding agency",
      "hiring a branding agency",
      "branding agency red flags",
      "how to evaluate a branding agency",
      "branding agency selection criteria"
    ],
    "searchIntent": "Help a business select a branding agency by comparing relevant evidence, responsibilities, scope and commercial arrangements, with practical questions for UK engagements.",
    "publishedAt": "2026-09-22",
    "updatedAt": "2026-09-22",
    "readingTime": "8 min read",
    "heroImage": "/images/generated/insights-v2/service-page-confident-choice.webp",
    "heroImageAlt": "A bright material library with stone, wood and fabric samples leaning along a window ledge, and one curated board of chosen samples set in front",
    "keyTakeaways": [
      "Give candidates the same buying problem and distinguish what you know from what still needs research.",
      "Ask what the proposed team contributed to a relevant project and what evidence can be shared.",
      "Compare complete proposals, including responsibilities, exclusions and the work your own team must do.",
      "A paid discovery stage can help resolve uncertainty, but it is one option rather than a universal requirement.",
      "For UK work, confirm fees in GBP where appropriate and agree usage rights explicitly."
    ],
    "framework": {
      "title": "A branding agency comparison checklist",
      "introduction": "Use these five prompts to record what each candidate has answered and what remains open. This is Branding Tatva's suggested worksheet, not a validated scoring system.",
      "steps": [
        {
          "title": "Decision",
          "description": "Write the decision the engagement must support. Separate the observed problem from your preferred solution."
        },
        {
          "title": "Relevant evidence",
          "description": "Record a comparable project, the candidate’s contribution and any limits on what the result shows."
        },
        {
          "title": "Delivery team",
          "description": "Name the strategy, writing, design and client approval responsibilities that your brief actually needs."
        },
        {
          "title": "Comparable proposal",
          "description": "Put inclusions, exclusions, research assumptions and delivery dates beside the fee."
        },
        {
          "title": "Open questions",
          "description": "List what must be clarified before a decision, then choose whether a proposal revision or discovery stage would resolve it."
        }
      ]
    },
    "sections": [
      {
        "id": "why-comparison-fails",
        "heading": "Compare the proposed work, then the presentation",
        "paragraphs": [
          "Two agencies can use the word branding for different assignments. One may be quoting for positioning and a message hierarchy. Another may include identity design, website pages and launch material. Comparing their total fees without separating those outputs leaves the buying decision unclear.",
          "A portfolio can show craft and relevant experience. A conversation can show how someone responds to a difficult question. Neither needs to be dismissed, but each answers only part of the brief. Ask how the proposed work would address the specific situation your business faces.",
          "Branding Tatva is an independent practice and has a commercial interest in this decision. The checklist here is a suggested way to assess any provider, including this practice. The cited industry guidance supports the commissioning process; it does not establish that an independent is better than an agency."
        ],
        "callout": {
          "label": "A useful comparison",
          "text": "For each proposal, finish this sentence: this fee buys these decisions and outputs, delivered by these people, with these questions still open."
        }
      },
      {
        "id": "name-the-problem-first",
        "heading": "Write a brief that keeps observations separate from assumptions",
        "paragraphs": [
          "Describe the moment that prompted the search. Perhaps prospects misunderstand a new offer, the sales team keeps rewriting proposals, or a merger has left two identities in use. Include actual examples where you have them. A few conversations can suggest questions; they cannot establish how every buyer thinks.",
          "Consider an illustrative UK consultancy whose website sells general advice while its proposals describe a specific operational service. The observed gap is inconsistent explanation. A new logo is one possible response, but the brief should first ask which position and message the website needs to express. This is a hypothetical brief, not a client result.",
          "Send the same account to each candidate. Invite them to challenge your interpretation and identify missing information. Agreement with your first explanation is less useful than a clear account of what they would need to investigate."
        ],
        "bullets": [
          "Observed problem: which question or misunderstanding appears in real enquiries?",
          "Decision needed: what should the business be able to decide at the end?",
          "Existing evidence: which pages, proposals, customer comments and project records can you share?",
          "Constraints: what must stay, what is already committed and who can approve a change?"
        ]
      },
      {
        "id": "the-evidence-standard",
        "heading": "Check what relevant work actually demonstrates",
        "paragraphs": [
          "The Design Business Association recommends examining relevant projects, experience and the information available about a candidate. Its selection guide allows several routes to a decision, including meetings and written proposals. A rigid pitch format is not required for every appointment.",
          "Choose a manageable shortlist and ask each candidate to explain one project that resembles your problem. Find out what they personally contributed, which choices they made and what remains unmeasured. A finished website proves that a website was delivered; a sales claim needs its own evidence and context.",
          "Some client material cannot be published or shared. Ask whether an approved reference, a redacted example or a description of the process can answer your question. Record any remaining uncertainty. Confidentiality alone does not establish weak work, just as a recognisable client name does not establish the quality of a future team."
        ]
      },
      {
        "id": "red-flags",
        "heading": "Resolve these proposal questions before committing",
        "paragraphs": [
          "The DBA proposal guide covers delivery methods, timing, fees, outputs and the people involved. Use that baseline to make the scope comparable. For a UK brief, ask for a clearly stated billing currency and confirmation of any applicable tax, expenses or separate supplier charges.",
          "A concern deserves a direct question before a conclusion. Early design work can be appropriate when a position is already agreed. A specialist may reasonably decline a small trial. The unresolved issue is whether the proposed arrangement meets your needs, not whether every candidate uses the same process."
        ],
        "bullets": [
          "An outcome is guaranteed, but the provider cannot explain which parts it can control or how the outcome would be measured.",
          "Responsibility for a necessary output is missing, including work expected from your own team.",
          "The research plan promises customer evidence without explaining access to suitable customers.",
          "A change in the brief has no agreed route for discussing its effect on scope and cost.",
          "The proposal leaves you unable to tell what you can use or edit after handover."
        ]
      },
      {
        "id": "start-small",
        "heading": "Choose a discovery stage when it resolves a real uncertainty",
        "paragraphs": [
          "A paid audit or discovery stage can make sense when nobody can yet define the full assignment. Give that stage a useful output of its own: for example, a record of messaging conflicts and the decisions needed to resolve them. Agree what happens after review, including whether either party has any commitment to continue.",
          "When the brief is already clear, a complete proposal and appropriate references may be sufficient. Buying a trial adds time and cost, and a short assignment cannot demonstrate every capability needed for a larger rollout. Choose it for the question it can answer.",
          "For UK commissioned work, the Intellectual Property Office explains that commissioning alone does not make the buyer the copyright owner; written arrangements matter. GOV.UK distinguishes licensing from a transfer of copyright, which requires a signed written agreement. Ask what is assigned, what is licensed and which editable files are included. Bring unresolved ownership terms to an appropriate legal adviser before signing."
        ],
        "callout": {
          "label": "Example discovery question",
          "text": "Which conflicting promises appear across our homepage and proposals, and what evidence would help us choose the message to carry forward?"
        }
      },
      {
        "id": "fit-over-fame",
        "heading": "Check how the working arrangement fits your team",
        "paragraphs": [
          "Location can matter for workshops, access to customers and practical delivery. Remote work can also suit a UK brief. Specify which activities require presence, when the decision makers are available and how feedback will be consolidated. A local address alone does not demonstrate knowledge of your buyers.",
          "Imagine an illustrative consultancy with two directors approving the work. One wants to emphasise speed; the other wants to emphasise senior judgement. Before selecting a provider, agree who resolves that difference and what evidence will inform the choice. The agency cannot substitute for an unresolved client decision.",
          "Record your choice against the brief, the evidence reviewed and any remaining limits. If no candidate can deliver a necessary part, revise the scope or continue the search. Once you decide, explain the outcome to the other candidates and keep the agreed proposal available to everyone responsible for delivery."
        ]
      }
    ],
    "faq": [
      {
        "question": "How many branding agencies should I shortlist?",
        "answer": "Choose a number you can evaluate properly. The DBA suggests three or four as a possible shortlist and explicitly says there is no fixed rule. The useful limit is whether you can give each candidate a fair brief, ask questions and review the response carefully."
      },
      {
        "question": "How much does a branding agency cost?",
        "answer": "Compare quotes for the same scope rather than relying on an assumed agency tier. Branding Tatva’s own Foundation engagement starts at £1,950 for UK clients, subject to an agreed proposal. That is this practice’s starting price, not a market average or a quote for every branding project."
      },
      {
        "question": "Should the agency be in my city?",
        "answer": "Choose based on the access and working arrangements your brief needs. Confirm any workshops, customer research, site visits or production that require a physical presence. For remote work, agree meeting times, feedback responsibilities and handover arrangements."
      },
      {
        "question": "What belongs in the contract?",
        "answer": "Resolve the scope, responsibilities, payment arrangements, changes, handover and rights to use the work. Specify any editable files you need. UK commissioning does not itself transfer copyright; obtain advice on unclear ownership or licensing terms before signing."
      },
      {
        "question": "What if every shortlisted agency looks the same?",
        "answer": "Ask each candidate to explain one decision in a relevant project, then compare how they would investigate your brief. If those conversations still leave important questions unanswered, seek different evidence or expand the search. Similar visual styles alone do not establish identical capability."
      }
    ],
    "relatedSlugs": [
      "brand-strategist-vs-branding-agency",
      "how-much-does-brand-strategy-cost",
      "brand-strategy-vs-brand-identity"
    ],
    "useEditorialArtwork": false,
    "sources": [
      {
        "title": "How to buy design: Agency selection guide",
        "publisher": "Design Business Association",
        "url": "https://www.dba.org.uk/resources/review-add-links-once-all-ready-how-to-buy-design-03-agency-selection-guide/",
        "note": "Industry guidance on reviewing candidates and selecting a suitable process; not evidence that any provider type performs better."
      },
      {
        "title": "How to buy design: Asking for a proposal document",
        "publisher": "Design Business Association",
        "url": "https://www.dba.org.uk/resources/review-links-how-to-buy-design-08-asking-for-a-proposal-document/",
        "note": "Guidance on the scope, delivery arrangements and costs a buyer should clarify in a proposal."
      },
      {
        "title": "Ownership of copyright works",
        "publisher": "Intellectual Property Office, GOV.UK",
        "url": "https://www.gov.uk/guidance/ownership-of-copyright-works",
        "note": "UK guidance on copyright in commissioned work and the importance of written ownership arrangements."
      },
      {
        "title": "Using somebody else's intellectual property: Copyright",
        "publisher": "GOV.UK",
        "url": "https://www.gov.uk/using-somebody-elses-intellectual-property/copyright",
        "note": "Distinguishes permission to use a work from buying copyright, including the written agreement needed for a transfer."
      }
    ]
  }
];
