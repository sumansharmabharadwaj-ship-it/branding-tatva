import type { InsightPost } from "@/data/pillarInsights";

// The buying decision set — the highest intent question a service buyer
// types before choosing a strategist: what this work costs. Figures
// quoted for the practice come from the approved region aware price
// book in src/data/pricing.ts and nowhere else; market context stays
// limited to what the cited commissioning guidance supports. Practical
// comparison scenarios are illustrative, not measured client outcomes.

type BuyerGuidePost = InsightPost & {
  sources?: { title: string; publisher: string; url: string; note?: string }[];
};

export const pricingInsightPosts: BuyerGuidePost[] = [
  {
    "slug": "how-much-does-brand-strategy-cost",
    "title": "How much does brand strategy cost in the UK, USA and Canada?",
    "seoTitle": "Brand Strategy Cost: UK, USA & Canada Prices",
    "excerpt": "Compare Branding Tatva’s starting prices in GBP, USD and CAD, see what changes the fee, and use a scope checklist before choosing a brand strategist.",
    "directAnswer": "At Branding Tatva, Foundation starts at £1,950 in the UK, US$2,800 in the USA and CA$3,200 in Canada. Full Brand System starts at £4,500, US$6,500 and CA$7,500 respectively. These are this practice’s starting prices, not market averages or fixed quotes. The final fee depends on the research, offers, audiences and deliverables agreed in your proposal.",
    "element": "earth",
    "topicSlug": "positioning",
    "primaryKeyword": "how much does brand strategy cost",
    "secondaryKeywords": [
      "brand strategy cost uk",
      "brand strategist fees usa",
      "brand strategy cost canada",
      "brand strategy pricing",
      "brand strategy quote checklist"
    ],
    "searchIntent": "Compare a named provider’s regional starting prices and evaluate scope before commissioning brand strategy.",
    "publishedAt": "2026-09-21",
    "updatedAt": "2026-09-22",
    "readingTime": "7 min read",
    "heroImage": "/images/generated/insights-v2/consulting-positioning-aperture.webp",
    "heroVideo": "/videos/generated/insights-v2/consulting-positioning-aperture.mp4",
    "heroImageAlt": "A camera aperture ring beside a consulting worktable, the iris half open over a sheet of pricing notes",
    "keyTakeaways": [
      "Compare GBP, USD and CAD explicitly. A dollar sign alone does not establish the billing currency.",
      "Foundation and Full Brand System have project starting prices; Brand Partnership has a monthly starting price.",
      "Research depth, audiences, markets and implementation affect the fee. Compare the same scope across proposals.",
      "Ask who does the work, what your team receives and which revisions or additional tasks need a separate quote.",
      "A brand engagement can clarify the offer and its expression. It cannot guarantee rankings, enquiries or sales."
    ],
    "framework": {
      "title": "A brand strategy quote checklist",
      "introduction": "Ask each shortlisted provider these five questions using the same brief. Record the answers beside the fee before deciding.",
      "steps": [
        {
          "title": "Business decision",
          "description": "Which decision needs resolving: the priority buyer, the reason to choose you, the service structure or the message? Ask how the proposed work addresses it."
        },
        {
          "title": "Evidence",
          "description": "List the interviews, competitor review and existing materials included. State who recruits participants and which research costs are additional."
        },
        {
          "title": "Deliverables",
          "description": "Name the documents and finished assets you receive. Distinguish strategy, identity, website copy and development so the same item is not assumed twice."
        },
        {
          "title": "Delivery",
          "description": "Identify the lead strategist, other contributors, review rounds and approval owner. Agree meeting times and a schedule that allows your team to respond."
        },
        {
          "title": "Total commitment",
          "description": "Confirm the currency, project or monthly basis, payment stages and how extra work is approved. Ask the provider to state any applicable taxes and payment charges in the quote."
        }
      ]
    },
    "sections": [
      {
        "id": "this-practices-published-figures",
        "heading": "Branding Tatva’s starting prices by country",
        "paragraphs": [
          "The figures below are Branding Tatva’s published starting prices. They describe one practice’s offers and do not represent a survey of agencies or a market average. They are regional prices, not live currency conversions.",
          "Foundation and Full Brand System are project engagements. Brand Partnership is ongoing work priced monthly. A consultation establishes which scope fits; the written proposal confirms the fee and inclusions."
        ],
        "bullets": [
          "United Kingdom · GBP: Foundation from £1,950; Full Brand System from £4,500; Brand Partnership from £1,100 per month.",
          "United States · USD: Foundation from US$2,800; Full Brand System from US$6,500; Brand Partnership from US$1,500 per month.",
          "Canada · CAD: Foundation from CA$3,200; Full Brand System from CA$7,500; Brand Partnership from CA$1,900 per month."
        ],
        "callout": {
          "label": "Before comparing quotes",
          "text": "A project fee and a monthly retainer cover different commitments. Ask what is included, for how long, and in which currency."
        }
      },
      {
        "id": "what-you-are-actually-buying",
        "heading": "What should a brand strategy fee include?",
        "paragraphs": [
          "A useful scope states the decisions your team needs to make and the evidence needed to make them. That can include the priority customer, buying situation, alternatives, positioning direction and message hierarchy. The proposal should identify which of these belong in your engagement.",
          "Activities support the decisions. Interviews can reveal how customers describe the problem. A competitor review can show which alternatives they compare. Workshops can resolve disagreement inside the team. Ask what each activity contributes and what happens if the evidence challenges the original brief.",
          "Strategy and execution need separate descriptions. A positioning document does not automatically include a logo, naming, full website copy, website development or a campaign. If you need any of those, put the finished output and approval process into the scope."
        ]
      },
      {
        "id": "what-moves-a-price-up-or-down",
        "heading": "What changes the cost of brand strategy?",
        "paragraphs": [
          "The number of offers and audiences affects how much needs to be investigated. One service for a known buyer poses a different task from several service lines sold to different decision makers. An established business may also have names, messages and visual cues that customers already recognise.",
          "Research depth changes the work. Reviewing supplied material is different from recruiting customers, conducting interviews and comparing findings across countries. Ask which evidence already exists and which must be gathered.",
          "Implementation and timing matter too. A written direction may be enough for an experienced in-house team; another team may need writing examples, identity work or launch support. Share a fixed launch date early so the provider can explain the trade-offs and dependencies."
        ],
        "bullets": [
          "Offers and buyer groups in scope.",
          "Markets and customer research required.",
          "Strategy documents versus finished design or copy.",
          "Feedback rounds and number of approvers.",
          "Launch support and continuing involvement."
        ]
      },
      {
        "id": "compare-uk-us-canada-quotes",
        "heading": "Comparing quotes in the UK, USA and Canada",
        "paragraphs": [
          "For a UK brief, record the fee in GBP and identify whether the work concerns UK buyers or an international expansion. A domestic service proposition and a new-market positioning study should not be treated as the same research task.",
          "For a US brief, record USD explicitly and specify the relevant customer segment and market. A country label alone cannot tell a strategist which buyers, competitors or purchase decisions to investigate.",
          "For a Canadian brief, confirm CAD rather than assuming a dollar quote is Canadian. Say whether the work needs English, French or both. Translation, local language research and adaptation need named responsibilities and an explicit scope; an English-language engagement does not include them by default.",
          "For any remote engagement, agree time zones, shared review hours and the person who consolidates feedback. Compare these working arrangements alongside the fee. Being in the same country does not by itself establish experience with your buyers."
        ]
      },
      {
        "id": "a-scope-comparison-example",
        "heading": "Example: why two branding quotes may cover different work",
        "paragraphs": [
          "Illustrative comparison: a consultancy wants its website to explain a new service. One proposal covers a workshop, positioning decisions and a message hierarchy using the material the consultancy supplies. Another includes customer interviews, a competitor review, those same strategic decisions and finished copy for five website pages.",
          "The second proposal includes additional work. Before interpreting the difference as better or worse value, decide whether those interviews and finished pages are needed. Ask each provider to separate the research, strategy and execution in writing.",
          "Compare the final outputs, evidence and responsibilities. If neither proposal identifies who approves the position or what happens when feedback conflicts, resolve that gap before choosing."
        ],
        "callout": {
          "label": "A useful comparison",
          "text": "Put the business question, research, outputs, reviewers and exclusions beside each fee. A lower number only becomes meaningful once the work is comparable."
        }
      },
      {
        "id": "how-to-choose-for-your-stage",
        "heading": "Which scope fits your business?",
        "paragraphs": [
          "If the offer is still being tested, begin by identifying what you know about the buyer and what remains uncertain. You may need customer learning before a full brand system. Avoid paying to finalise assumptions that are still changing.",
          "If an established business is misunderstood, positioning and messaging may deserve attention. If the problem is inconsistency across an otherwise clear brand, an audit can identify which touchpoints to correct. A new identity is one possible response, not the starting assumption.",
          "Ongoing direction is useful when there is a recurring workload to review and a clear owner for implementation. Define that workload before accepting a monthly commitment. A bounded problem may be better handled as a project."
        ]
      },
      {
        "id": "prepare-for-a-brand-strategy-quote",
        "heading": "What to bring when asking for a quote",
        "paragraphs": [
          "Bring your website, a current proposal and a short explanation of the problem. Include the customers you want to reach, the alternatives they consider and any materials that show recurring questions or objections. Say which country or countries the work needs to address.",
          "Add the required outputs, target date, approval owner and budget range in the currency you use. If the scope is unclear, say so: the first conversation can establish the decision that needs attention before a larger engagement is proposed.",
          "Use the service scope and booking links below to discuss the work with Suman. The 30 minute diagnosis is an initial conversation; a full brand strategy engagement or audit is separately scoped."
        ]
      }
    ],
    "faq": [
      {
        "question": "How much does brand strategy cost in the UK?",
        "answer": "Branding Tatva’s UK starting prices are £1,950 for Foundation, £4,500 for Full Brand System and £1,100 per month for Brand Partnership. These are GBP prices for this practice, not UK market averages. The proposal confirms the final scope and fee."
      },
      {
        "question": "How much does brand strategy cost in the USA?",
        "answer": "Branding Tatva’s US starting prices are US$2,800 for Foundation, US$6,500 for Full Brand System and US$1,500 per month for Brand Partnership. The currency is USD. Research, audiences and deliverables affect the final proposal."
      },
      {
        "question": "How much does brand strategy cost in Canada?",
        "answer": "Branding Tatva’s Canadian starting prices are CA$3,200 for Foundation, CA$7,500 for Full Brand System and CA$1,900 per month for Brand Partnership. The currency is CAD. State any French-language or bilingual requirements when discussing the scope."
      },
      {
        "question": "Does brand strategy include a logo and website?",
        "answer": "Only when the proposal explicitly includes them. Strategy, visual identity, website copy and website development are distinct outputs. Ask for a list of the finished work and the review rounds included in the fee."
      },
      {
        "question": "Can I compare a remote strategist with a local agency?",
        "answer": "Yes. Use the same brief and compare relevant experience, named contributors, research, deliverables and review arrangements. If the work needs site visits or local production, ask how those will be handled and priced."
      },
      {
        "question": "Will brand strategy guarantee more leads?",
        "answer": "No. Clear positioning and messaging can help buyers understand the offer, but enquiries also depend on demand, distribution, price, trust and the booking experience. Agree observable business goals without treating a branding project as a guarantee of sales or search rankings."
      }
    ],
    "relatedSlugs": [
      "how-to-choose-a-branding-agency",
      "brand-strategist-vs-branding-agency",
      "brand-audit-checklist-before-rebrand"
    ]
  },
  {
    "slug": "brand-strategist-vs-branding-agency",
    "title": "Brand strategist or branding agency: who should you hire?",
    "seoTitle": "Brand Strategist vs Branding Agency: How to Choose",
    "excerpt": "Compare an independent strategist and a branding agency through the work, people and delivery capacity your brief needs. Includes UK scope and fee questions.",
    "directAnswer": "Consider an independent brand strategist when their experience and delivery capacity fit the decisions you need to make. Consider a branding agency when its proposed team can cover the strategy and execution your brief requires. Either model can provide strong or weak work. Compare the actual people, evidence, responsibilities and total scope before choosing; team size alone does not establish quality, speed or value.",
    "element": "earth",
    "topicSlug": "positioning",
    "primaryKeyword": "brand strategist vs branding agency",
    "secondaryKeywords": [
      "should i hire a brand strategist or an agency",
      "independent brand consultant vs agency",
      "hire a brand strategist",
      "branding agency alternative",
      "solo brand strategist for startups"
    ],
    "searchIntent": "Decide between hiring an independent brand strategist and a branding agency, with criteria and risks for each.",
    "publishedAt": "2026-09-21",
    "updatedAt": "2026-09-22",
    "readingTime": "7 min read",
    "heroImage": "/images/generated/insights-v2/case-study-decision-record.webp",
    "heroVideo": "/videos/generated/insights-v2/case-study-decision-record.mp4",
    "heroImageAlt": "A decision record laid open on a desk, two candidate folders weighed side by side under a reading lamp",
    "keyTakeaways": [
      "A strategist is a role; an agency is an organisation that may employ strategists and other specialists.",
      "Compare the proposed team and outputs, rather than assuming a solo practice is senior or an agency is slow.",
      "Check capacity, continuity and responsibility for outside specialists in either model.",
      "Use a common brief to compare fees. A smaller team does not automatically mean a lower total cost.",
      "Branding Tatva is an independent practice. Its own scope and evidence should face the same questions as any alternative."
    ],
    "framework": {
      "title": "Match the team to the brief",
      "introduction": "Use these prompts to discuss the work with either type of provider. There is no majority score that can settle the choice without examining the candidates.",
      "steps": [
        {
          "title": "Decisions",
          "description": "Which audience, offer or message needs to be agreed before execution can proceed?"
        },
        {
          "title": "Outputs",
          "description": "Which finished materials are required, and which will your existing team produce?"
        },
        {
          "title": "People",
          "description": "Who will do the work, review specialist contributions and answer your questions?"
        },
        {
          "title": "Capacity",
          "description": "What work must happen at the same time, and what happens if a key person becomes unavailable?"
        },
        {
          "title": "Commitment",
          "description": "Which costs and responsibilities belong to the provider, to you and to any additional suppliers?"
        }
      ]
    },
    "sections": [
      {
        "id": "the-question-behind-the-question",
        "heading": "Separate a professional role from a business model",
        "paragraphs": [
          "A brand strategist may work independently, inside an agency or within a client organisation. A branding agency may combine strategy with design, writing and production, or specialise in only part of that work. The labels overlap, so start with what each candidate actually proposes.",
          "The Design Business Association describes a range of design specialisms and recommends beginning with the challenge that needs attention. That is a useful starting point here: a naming question and a website rollout may need different capabilities even when both appear under branding.",
          "This comparison is written by Branding Tatva, an independent practice. The examples are suggested buying scenarios, not research showing that one business model produces better results."
        ],
        "callout": {
          "label": "Start with the assignment",
          "text": "Write down the decisions and finished outputs you need. Then ask who will be responsible for each one."
        }
      },
      {
        "id": "what-an-agency-is-built-for",
        "heading": "When an agency team may fit the assignment",
        "paragraphs": [
          "An agency is worth considering when its proposed team brings the capabilities and coordination your assignment needs. That could include customer research, identity design, writing and development running together. Confirm that those capabilities are available to your project, whether they sit inside the agency or with named partners.",
          "For an illustrative company launching several service lines, the workload might include one shared positioning decision, different service explanations and a coordinated website release. Ask who keeps those outputs consistent and how changes in one affect the others. This scenario describes a coordination need, not a reason to assume that every agency can meet it.",
          "Meet the people expected to lead delivery and ask how specialist reviews work. A different person handling account coordination can be useful when responsibilities are clear. Senior involvement, thoughtful strategy and direct communication should be confirmed from the proposed arrangement rather than inferred from the agency name."
        ]
      },
      {
        "id": "what-an-independent-is-built-for",
        "heading": "When an independent strategist may fit the assignment",
        "paragraphs": [
          "An independent can suit a focused assignment when that person has the relevant experience and enough capacity. For example, a founder might need to agree a priority buyer and message before an existing designer updates the website. The strategist’s responsibility would need to include a usable handover to that designer.",
          "Direct access can make discussion straightforward, but it does not remove the need for research, review or a realistic schedule. Some independents work with collaborators; some agencies offer close access to a small senior team. Ask who will participate rather than assuming either pattern.",
          "Continuity deserves attention where delivery depends heavily on one person. Discuss availability, how progress is recorded and what happens if a key contributor cannot continue. For outside specialists, identify who briefs them, checks their work and agrees any change in cost."
        ],
        "bullets": [
          "Can the proposed strategist show relevant decisions they have helped a business make?",
          "Who turns the agreed direction into the materials this project requires?",
          "Which parts of the work depend on a collaborator who has not yet been confirmed?"
        ]
      },
      {
        "id": "the-money-follows-the-structure",
        "heading": "Compare fees against a common scope",
        "paragraphs": [
          "Neither independent nor agency is a reliable price category by itself. Experience, research depth, deliverables and implementation can change the proposal. A strategy fee that excludes execution cannot be compared directly with a fee that includes the completed website.",
          "The DBA proposal guidance asks buyers to clarify what will be delivered, how the project will run and what it will cost. For UK work, record the billing currency and ask about any applicable tax or additional supplier charges. Use the same brief for each comparison.",
          "Consider an illustrative consultancy that already has a capable designer. A strategy engagement could give that designer the direction needed for the next stage. Another consultancy may need one supplier to manage the complete assignment. Compare the complete commitment in each case, including the approvals and coordination your own team will provide. This is a suggested comparison method, not a claim about typical savings."
        ],
        "callout": {
          "label": "A missing cost to examine",
          "text": "If one proposal stops at strategy and another includes execution, identify how the first would reach the same finish line before comparing totals."
        }
      },
      {
        "id": "how-this-practice-fits",
        "heading": "Where Branding Tatva may fit",
        "paragraphs": [
          "Branding Tatva is Suman Sharma’s independent brand strategy practice. The dedicated service pages describe positioning, brand audit and messaging engagements. Work is available remotely for businesses in the UK, USA, Canada and India, with scope agreed before the project begins.",
          "A possible fit is a service business that needs to clarify the buyer, the offer or the explanation used across its website and proposals. The first conversation establishes the question and available evidence. A complete website rewrite, development or wider production assignment requires its own confirmed scope and delivery arrangements.",
          "Ask this practice the same questions you ask an agency. Review the named project records and their stated limits. If the proposed work does not cover an essential capability or deadline, discuss that gap before committing. A published starting price does not by itself establish fit."
        ]
      },
      {
        "id": "the-five-questions-that-expose-both",
        "heading": "Five questions to ask either provider",
        "paragraphs": [
          "Bring these questions to the same conversation rather than turning each into a separate pitch exercise. Ask for specific examples where they can be shared, and record anything that still needs confirmation.",
          "After the conversation, write a short decision note: the candidate you prefer, the part of the brief they address, the evidence reviewed and the unresolved conditions. A discovery stage may be useful when the assignment itself is uncertain. A clear brief may instead support a direct appointment with an agreed proposal."
        ],
        "bullets": [
          "Which decision will this engagement help us make, and which decisions remain ours?",
          "Who will perform and review the work, including contributions from outside specialists?",
          "What evidence will you use, and what happens when customer access is unavailable?",
          "What can our team use after handover, and what further work will it need?",
          "How will we assess the delivered work against the original brief?"
        ]
      }
    ],
    "faq": [
      {
        "question": "Is a brand strategist cheaper than a branding agency?",
        "answer": "There is no dependable price rule based on those labels alone. Compare the same research, deliverables, implementation and responsibilities. Branding Tatva’s UK Foundation engagement starts at £1,950, subject to an agreed proposal; that figure is specific to this practice and is not an agency market comparison."
      },
      {
        "question": "Can a solo strategist handle a full rebrand?",
        "answer": "That depends on the scope and the delivery team they can confirm. Strategy, writing, identity design and implementation involve different responsibilities. Ask which work the strategist performs, which work needs a specialist and who is accountable for the finished result."
      },
      {
        "question": "When is a branding agency the right choice?",
        "answer": "An agency may fit when its proposed team can deliver and coordinate the capabilities your brief needs. Relevant experience, available capacity and a clear proposal matter more than the agency label. The same tests apply to a small studio or an independent with collaborators."
      },
      {
        "question": "What should I ask before hiring either one?",
        "answer": "Clarify the decision, proposed people, evidence, handover materials and method of assessing the work. Ask what the fee excludes and what your team must contribute. Put unresolved questions into the proposal discussion before committing."
      },
      {
        "question": "Can I work remotely with a strategist outside the UK?",
        "answer": "Yes, if the proposed working arrangement fits your brief. Branding Tatva offers remote engagements for UK businesses. Agree shared meeting times, customer research access, feedback responsibilities and any need for local production. Confirm the scope and billing currency before work starts."
      }
    ],
    "relatedSlugs": [
      "how-much-does-brand-strategy-cost",
      "how-to-position-a-consulting-business",
      "founder-brand-vs-company-brand"
    ],
    "useEditorialArtwork": false,
    "sources": [
      {
        "title": "How to buy design: Getting started",
        "publisher": "Design Business Association",
        "url": "https://www.dba.org.uk/resources/review-advice-for-design-commissioners-how-to-buy-design/",
        "note": "Describes different design specialisms and starting from the business challenge; it does not rank agencies against independents."
      },
      {
        "title": "How to buy design: Asking for a proposal document",
        "publisher": "Design Business Association",
        "url": "https://www.dba.org.uk/resources/review-links-how-to-buy-design-08-asking-for-a-proposal-document/",
        "note": "Guidance on the scope, delivery arrangements and costs a buyer should clarify in a proposal."
      }
    ]
  }
];
