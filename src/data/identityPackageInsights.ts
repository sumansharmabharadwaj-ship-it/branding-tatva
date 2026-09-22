import type { InsightPost } from "@/data/pillarInsights";

// A practical commissioning checklist. Scope examples are illustrative;
// copyright and contrast guidance cite the primary sources they describe.
type SourcedBuyerGuide = InsightPost & {
  sources: { title: string; publisher: string; url: string; note?: string }[];
};

export const identityPackageInsightPosts: SourcedBuyerGuide[] = [
  {
    "slug": "what-a-brand-identity-package-includes",
    "title": "What should a brand identity package include? A buyer’s checklist",
    "seoTitle": "Brand Identity Package: Deliverables and Handover Checklist",
    "excerpt": "Compare brand identity proposals: logo files, colour, typography, templates, guidelines and usage rights, with a practical handover checklist for UK businesses.",
    "directAnswer": "A brand identity proposal should name the visual assets, usage rules, applications and handover included in the fee. Check logo variations, colour specifications, typography, image direction and the templates your team needs. Establish whether strategy and messaging already exist or need separate work. Agree editable files, software access and usage rights before commissioning. A focused logo package can be suitable when the wider system is already in place.",
    "element": "fire",
    "topicSlug": "distinctive-brand",
    "primaryKeyword": "what is included in a brand identity package",
    "secondaryKeywords": [
      "brand identity package contents",
      "brand identity deliverables",
      "brand guidelines checklist",
      "logo package file formats",
      "brand identity package cost"
    ],
    "searchIntent": "Compare brand identity deliverables, clarify exclusions and rights, and prepare a usable brief before commissioning a package.",
    "publishedAt": "2026-09-22",
    "updatedAt": "2026-09-22",
    "readingTime": "9 min read",
    "heroImage": "/images/generated/insights-v2/page-foundation-folio.webp",
    "heroImageAlt": "An open folio holding a curated set of material samples: pale stone, travertine, fluted glass, brass discs and bars, arranged across its pages in warm light",
    "keyTakeaways": [
      "Compare the named deliverables and responsibilities alongside price. A smaller scope can be the right fit.",
      "Existing strategy can supply the design brief; fresh research, positioning and messaging need explicit scope.",
      "Specify how the identity works in the places buyers encounter it: proposals, websites, documents and other relevant materials.",
      "Agree editable files, usable exports, software requirements and a practical handover exercise.",
      "Clarify ownership and licences separately. Payment and file delivery do not, by themselves, settle copyright ownership in the UK."
    ],
    "framework": {
      "title": "Five questions for an identity proposal",
      "introduction": "Use these questions to record what is included, what your team supplies and what needs another quote. The checklist is a commissioning aid, not a fixed package every business must buy.",
      "steps": [
        {
          "title": "What guides the design?",
          "description": "Identify the audience, offer, positioning and existing evidence. Confirm whether the provider reviews supplied strategy or develops it within the project."
        },
        {
          "title": "Which assets arrive?",
          "description": "Name the logo variations, colour specifications, typography and image direction. Match each deliverable to a use your business actually has."
        },
        {
          "title": "Where will they work?",
          "description": "List the website, proposal, social or print applications included. Separate a design mockup from an editable template or a working website."
        },
        {
          "title": "Who can maintain them?",
          "description": "Specify file formats, editing software, account access, instructions and a handover session. Ask a colleague to complete a typical task with the supplied material."
        },
        {
          "title": "What are the terms?",
          "description": "Confirm price, currency, revisions, dates, approval responsibilities and additional costs. Record the agreed rights and any third party licences."
        }
      ]
    },
    "sections": [
      {
        "id": "the-quote-test",
        "heading": "Compare the scope before comparing package names",
        "paragraphs": [
          "“Brand identity package” is a description to investigate. One proposal may cover a logo and basic usage notes; another may include research, messaging, templates and implementation. Either can fit a brief. The useful comparison is what your business needs against what each provider agrees to deliver.",
          "The Design Business Association’s proposal guidance asks buyers to look for the approach, timetable, costs and deliverables. Use that as a starting point, then ask for clarification where a line such as “brand rollout” leaves the finished work unclear.",
          "Branding Tatva provides brand strategy and identity services, so this guide reflects a provider’s perspective. The checklist and examples below are practical suggestions. They are not findings from a survey of agencies or claims that a particular price predicts quality."
        ],
        "callout": {
          "label": "Make quotes comparable",
          "text": "Give each provider the same brief. Mark each requested item as included, supplied by your team, optional or excluded."
        }
      },
      {
        "id": "layer-one-decisions",
        "heading": "Establish which decisions the design must carry",
        "paragraphs": [
          "Start with the priority buyer, the offer and the reason someone would choose it. Share your current positioning, customer questions and examples of how the business explains itself. The provider can then identify which decisions are settled and which need investigation.",
          "An identity project can use an existing strategy. New positioning, naming, interviews, a message hierarchy and a full tone of voice guide are separate tasks to discuss. A visual identity fee does not establish that all of them are included.",
          "Illustrative UK consultancy brief: the founder already has an agreed audience and service proposition, but proposals and website pages look unrelated. The initial need might be a coherent visual system and proposal template. If interviews instead reveal that buyers misunderstand the offer, the team can discuss a messaging scope before committing to design. This is an example, not a client result."
        ]
      },
      {
        "id": "layer-two-the-system",
        "heading": "Specify the visual assets and their usage rules",
        "paragraphs": [
          "Ask the designer to show how the proposed logo works at the sizes and on the backgrounds you use. A presentation mockup alone does not show whether the mark remains legible in a small website header or an email signature. Request the variations needed for those uses.",
          "Colour and typography instructions should explain practical choices: text on a light background, a reversed mark on a dark surface, document headings and fallback fonts. Ask which combinations have been checked in the applications you are commissioning.",
          "For digital text, WCAG 2.2’s AA contrast criterion generally requires 4.5:1, or 3:1 for qualifying large text. Text within a logo is exempt from that criterion; the exception does not cover ordinary branded page copy. Contrast is one accessibility check, not proof that a whole website meets WCAG. The W3C explanation below gives the conditions and exceptions."
        ],
        "bullets": [
          "Logo: required variations, clear space, minimum sizes and examples on the intended backgrounds.",
          "Colour: values for agreed screen and print uses, with text and background pairings identified.",
          "Typography: families, weights, hierarchy, fallback choices and the licence details your team needs.",
          "Images and illustration: examples of the intended style and clarity on whether production or sourcing is included.",
          "Guidelines: instructions and worked examples for the people who will apply the identity."
        ]
      },
      {
        "id": "layer-three-application",
        "heading": "Name the templates, files and handover tasks",
        "paragraphs": [
          "Choose applications around your work. A consultancy might prioritise proposals and presentation slides; a clinic might need appointment information and signage. These are illustrative priorities. Record the number and purpose of the templates, the software used and who supplies the text.",
          "Keep design, production and implementation distinct in the quote. A website visual does not include development unless agreed. An email signature design may still need setup. Printing, photography, copywriting and migration of existing material can each involve additional work.",
          "Agree a handover task before final approval: a colleague opens a supplied template, replaces a heading and image, adds a page and exports a usable PDF. Check the result together. This gives you a practical way to identify missing instructions, software access or assets before the engagement closes."
        ],
        "bullets": [
          "Editable masters in the agreed application, with the required software and account access identified.",
          "Appropriate exports, such as SVG for web use, PNG with transparency where needed and a PDF prepared to the printer’s specification.",
          "A file index distinguishing approved versions, working files and any material excluded from handover.",
          "Template instructions and a named contact for agreed support or later changes."
        ]
      },
      {
        "id": "what-cheap-packages-omit",
        "heading": "Check exclusions at every price",
        "paragraphs": [
          "A lower fee can reflect a narrower brief, supplied assets or less implementation. A higher fee does not establish that every item below is included. Ask each provider the same questions and decide which exclusions matter to your team.",
          "Phasing can be useful. You might agree the core identity and a proposal template first, then add social templates when the team has a content plan. Record what later work depends on and how it will be quoted."
        ],
        "bullets": [
          "Research and strategy: what is reviewed, what is created and what the client supplies?",
          "Revisions: how many review stages are included, who approves them and what counts as a change of brief?",
          "Applications: which finished templates or implemented materials will you receive?",
          "Purchases: who pays for fonts, stock assets, subscriptions, printing or specialist production?",
          "Support: what is included after handover, for how long and how are later changes priced?"
        ]
      },
      {
        "id": "ownership-and-licences",
        "heading": "Clarify copyright and licences before commissioning",
        "paragraphs": [
          "For UK commissioned work, the Intellectual Property Office explains that the creator generally owns copyright initially unless otherwise agreed in writing. Commissioning a design, paying an invoice or receiving its files does not by itself establish that you own its copyright.",
          "A licence gives permission to use work on agreed terms; an assignment transfers copyright ownership. GOV.UK explains that a copyright transfer requires a written agreement signed by the owner. Ask the provider to identify the arrangement for original work and the rights available for any third party material.",
          "For fonts, photographs and other licensed assets, request the applicable terms and ask who needs to hold the licence for your intended use. Do not assume that every font file can be passed to another supplier. A qualified adviser can review uncertain contract terms, particularly where the parties work in different countries."
        ]
      },
      {
        "id": "reading-a-quote",
        "heading": "Turn the checklist into a UK buying brief",
        "paragraphs": [
          "Write a short brief describing the business, priority audience, materials that need changing and what your team already has. Add your desired launch date and the person responsible for approvals. Ask for a response that separates essential work from optional additions.",
          "For a UK purchase, request the fee in GBP and ask the provider to state applicable taxes, payment stages, licence costs and any expenses. For remote work, agree meeting times, feedback deadlines and where the current files will live. These are points to clarify, not a universal contract template.",
          "Bring the same checklist to Branding Tatva when comparing our engagement formats. A 30 minute conversation can establish which questions need resolving; the written scope confirms the work and fee. Choose based on the proposal, relevant project evidence and the responsibilities your team can take on."
        ],
        "callout": {
          "label": "Before approval",
          "text": "Can your team explain what arrives, what remains outside scope, who can use and edit it, and what happens if the brief changes? Resolve unclear answers before agreeing the work."
        }
      }
    ],
    "faq": [
      {
        "question": "How much does a brand identity package cost?",
        "answer": "The fee depends on the agreed research, design and applications. At Branding Tatva, Foundation starts at £1,950 in the UK, US$2,800 in the USA and CA$3,200 in Canada. These are this practice’s regional starting prices, not market averages or fixed quotes for every checklist item. Compare the service scope and request a written proposal."
      },
      {
        "question": "Does a small business need brand guidelines?",
        "answer": "A short guide can help when several people prepare materials. Include the rules and examples they actually use, then check whether a colleague can complete a task with them. Choose the contents around the work rather than a promised page count."
      },
      {
        "question": "What file formats should the handover include?",
        "answer": "Agree editable source formats your team can use, plus exports for the intended applications. These may include SVG, transparent PNG and a print PDF that meets the printer’s requirements. Confirm template software, access and licence details. A file extension alone does not establish editability or usage rights."
      },
      {
        "question": "Can I commission a logo now and other materials later?",
        "answer": "Yes, a phased scope can work when the business decisions and dependencies are clear. Identify the immediate uses, what later templates will require and whether the existing identity or strategy can be reused. Ask how later work will be quoted."
      },
      {
        "question": "What should I ask before approving a package?",
        "answer": "Ask which inputs guide the design, which assets and applications arrive, how feedback is handled and what remains excluded. Request a handover example and clarify software, support and usage terms. Compare those answers with the same brief across providers."
      },
      {
        "question": "Will I own the copyright once I have paid?",
        "answer": "Do not assume so. UK commissioning guidance distinguishes paying for work from acquiring copyright. Establish whether your agreement grants a licence or transfers ownership, and clarify any third party assets separately. Get advice if the proposed rights do not clearly cover your intended use."
      }
    ],
    "relatedSlugs": [
      "brand-strategy-vs-brand-identity",
      "how-to-choose-a-branding-agency",
      "distinctive-brand-assets-audit"
    ],
    "useEditorialArtwork": false,
    "sources": [
      {
        "title": "How to buy design: asking for a proposal document",
        "publisher": "Design Business Association",
        "url": "https://www.dba.org.uk/resources/review-links-how-to-buy-design-08-asking-for-a-proposal-document/",
        "note": "Commissioning guidance on proposal contents and clarification. The checklist and consultancy example here are Branding Tatva’s practical suggestions."
      },
      {
        "title": "Ownership of copyright works",
        "publisher": "Intellectual Property Office, GOV.UK",
        "url": "https://www.gov.uk/guidance/ownership-of-copyright-works",
        "note": "UK guidance on initial copyright ownership, including commissioned work."
      },
      {
        "title": "Using somebody else’s intellectual property: copyright",
        "publisher": "GOV.UK",
        "url": "https://www.gov.uk/using-somebody-elses-intellectual-property/copyright",
        "note": "Distinguishes licensing from ownership transfer and explains the written agreement required for a transfer."
      },
      {
        "title": "Understanding WCAG 2.2: Contrast (Minimum)",
        "publisher": "World Wide Web Consortium (W3C)",
        "url": "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
        "note": "Explains text contrast thresholds and exceptions, including the limited exception for text within logos."
      }
    ]
  }
];
