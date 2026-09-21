import type { InsightPost } from "@/data/pillarInsights";

// Naming under saturation — the last essay of the September 2026
// trending set. Every claim that leans on research names the study in
// the research record; the register and sound arguments are the
// psycholinguistics literature, applied.

type InsightResearchSource = {
  title: string;
  publisher: string;
  url: string;
  note?: string;
};

type SourcedInsightPost = InsightPost & {
  sources: InsightResearchSource[];
};

export const namingInsightPosts: SourcedInsightPost[] = [
  {
    slug: "how-to-name-a-brand-when-good-names-are-taken",
    title: "Naming a brand when every good name feels taken",
    seoTitle: "How to name a brand in 2026 when the good names are taken",
    excerpt:
      "Founders now meet the same wall: every clean name is registered, every short domain is parked, and the generators keep proposing the same twelve inventions. The wall is real for one kind of name and imaginary for the kind worth having.",
    directAnswer:
      "The naming shortage of 2026 applies to descriptive names, and mostly leaves distinctive ones alone. A name works as a retrieval cue, so its job is being found in memory, and description is work for the sentence that follows it. The reliable route: decide the single job the name must do, screen candidates by sound rather than dictionary meaning, measure distance from the category's existing soundscape, check trademark strength before domain availability, and then commit, because every name arrives empty and earns its meaning through repetition.",
    element: "air",
    topicSlug: "brand-messaging",
    primaryKeyword: "how to name a brand",
    secondaryKeywords: [
      "brand name ideas taken",
      "business naming strategy",
      "phonetic symbolism brand names",
      "brand name availability 2026",
      "made up brand names",
    ],
    searchIntent:
      "Name a new business or product when obvious names look unavailable, and learn what makes a name work in memory, in sound, and at the trademark office.",
    publishedAt: "2026-09-21",
    updatedAt: "2026-09-21",
    readingTime: "12 min read",
    heroImage: "/images/generated/insights-v2/messaging-framework-letterpress.webp",
    heroImageAlt:
      "A letterpress type drawer with rows of metal letters, a few pulled out and arranged on the workbench beside it",
    keyTakeaways: [
      "The shortage is real for descriptive names and mostly imaginary for distinctive ones. The register is crowded exactly where memory is weakest.",
      "A name is a retrieval cue. Asking it to also describe the business gives one short word two jobs, and the description job wins the argument while losing the customer.",
      "Sound carries meaning before the dictionary arrives: vowels and consonants set expectations of size, speed, and sharpness that the ear trusts more than the pitch deck.",
      "AI name generators sample the statistical centre of existing names, which is why every founder now receives the same soft two syllable inventions.",
      "Names arrive empty. Google meant nothing, Kodak meant nothing; repetition deposited the meaning. The scarce resource is the nerve to keep spending into one.",
    ],
    framework: {
      title: "The naming audition",
      introduction:
        "Five screens, run in order, turn a naming free for all into a decision. Each screen removes candidates for a stated reason, so the surviving name wins on the record rather than on the loudest voice in the room.",
      steps: [
        {
          title: "Job",
          description:
            "Write the one job this name must do: be retrieved when the category question comes up. Anything else it does is a bonus. This screen deletes every candidate chosen mainly to explain the offer.",
        },
        {
          title: "Sound",
          description:
            "Say each survivor aloud and score what the sound promises: front vowels and crisp consonants read small, quick, and precise; back vowels and soft consonants read large, warm, and slow. Keep the candidates whose sound agrees with the strategy.",
        },
        {
          title: "Distance",
          description:
            "List the ten names your buyer already knows in the category and read yours in the middle of them. A candidate that rhymes with the category, or shares its endings, files itself under a competitor's memory.",
        },
        {
          title: "Rights",
          description:
            "Check trademark strength before domain vanity: a coined or arbitrary name is defensible, a descriptive one is weak everywhere. An imperfect domain with a strong mark beats the reverse.",
        },
        {
          title: "Deposit",
          description:
            "Commit in writing to a repetition budget: the name appears in one form, one spelling, one voice, everywhere, for years. The meaning arrives on schedule only if the spending stays consistent.",
        },
      ],
    },
    sections: [
      {
        id: "the-full-register",
        heading: "The full register",
        paragraphs: [
          "The complaint arrives in every naming project now, usually in week one: everything is taken. The trademark office receives hundreds of thousands of applications a year, Verisign's quarterly count of registered dot com names has sat far past one hundred and fifty million for years, and the short dictionary words went decades ago. Founders respond with the era's workarounds: a dropped vowel, a doubled letter, a dot ai suffix doing the work the name gave up on.",
          "Look closer at what is actually exhausted. The crowded shelf holds descriptive names: the clear, sensible compounds that say what the business does. Swift Logistics, Bright Analytics, TrueNorth Advisory, in every spelling arithmetic allows. Scarcity lives precisely where every founder shops.",
          "The shelf of distinctive names is close to infinite. English alone offers tens of thousands of usable words with no category attachment, and coined words multiply that without limit. Nobody had claimed Kodak until someone invented it. The wall founders hit is a preference, and the preference is the actual problem this essay works on.",
        ],
        callout: {
          label: "The real shortage",
          text:
            "The register is full of names that describe. It stays open for names that get remembered.",
        },
      },
      {
        id: "what-a-name-is-for",
        heading: "What a name is for",
        paragraphs: [
          "A brand name has one commercial job: retrieval. When the buying situation arrives, some name surfaces in the customer's memory, and the business carrying that name gets the enquiry. Everything a strategy hopes for funnels through that half second.",
          "Description feels safer because it seems to shorten the explanation. It rarely does. A descriptive name explains the category, and the category is the one thing the buyer already knew. What the buyer lacks is a handle for you specifically, and a name built from category vocabulary hands them a handle shaped exactly like your competitors' handles.",
          "The division of labour that works: the name is the hook, the sentence after the name does the describing. Apple carries zero information about computers, which left it free to hold forty years of accumulated meaning. The description job belongs to positioning lines, category entries, and the written record, all of which can change. The name is the one word that must never need to.",
        ],
      },
      {
        id: "sound-before-meaning",
        heading: "Sound carries meaning before the dictionary arrives",
        paragraphs: [
          "Psycholinguistics has measured for decades what poets and novelists always practised: sounds carry meaning on their own. In the classic demonstration, people across languages match the invented word kiki to a spiky shape and bouba to a rounded one, agreement running near total. Klink's brand name experiments made it commercial: front vowels, the ee and ih sounds, read smaller, faster, sharper, and more feminine; back vowels, the oh and oo sounds, read larger, heavier, and slower. Plosive consonants snap; fricatives glide.",
          "Lowrey and Shrum then showed the effect steers preference: buyers like a name more when its sound fits the product's promise, a crisp front vowel for the nimble app, a deep back vowel for the heavyweight machine. Literature got there first. Dickens built character in sound before biography: Gradgrind grinds, Scrooge scrapes, and a reader trusts the ear's verdict on page one.",
          "Fluency completes the picture. Alter and Oppenheimer found that companies with easily pronounced tickers outperformed hard ones in early trading, purely on processing ease. The practical screen for a shortlist: say every candidate aloud, score what the sound promises against what the strategy promises, and keep the candidates where ear and strategy agree. A name whose sound argues with its positioning fights that argument in every single exposure.",
        ],
        bullets: [
          "Read the shortlist aloud to someone who has seen no brief. Ask only: does this sound fast or slow, small or large, warm or precise?",
          "Check the stressed vowel: front vowels promise agility and edge, back vowels promise weight and warmth.",
          "Count the syllables. Two beats survive speech, search boxes, and a customer recommending you at dinner.",
        ],
      },
      {
        id: "the-generator-pond",
        heading: "Everyone is fishing the same generator pond",
        paragraphs: [
          "The 2026 twist on the shortage is partly manufactured. Ask a language model for name ideas and it predicts the most probable answer, which means the statistical centre of every startup name it has read: soft two syllable coinages, familiar suffix endings, the vaguely Latin glow. Thousands of founders prompt the same tools with similar briefs, then meet each other at the trademark office holding near identical inventions.",
          "This is the modal content trap wearing a name tag. Generators are genuinely useful as pressure tests and shortlist expanders, and genuinely dangerous as deciders, because their default output is the category's average, and average is the one quality a name exists to escape.",
          "The countermove is the same one that governs AI content everywhere: feed the machine your specifics and reserve the judgement. Give it your positioning, your sound direction, your banned suffixes, and let it generate against those constraints. Then run the audition yourself. A rival's tool could produce the candidate list; only your strategy can produce the choice.",
        ],
        callout: {
          label: "The generator test",
          text:
            "If the tool would have proposed your name to your competitor, it is the category's name, and you are renting it.",
        },
      },
      {
        id: "rights-before-vanity",
        heading: "Rights before vanity",
        paragraphs: [
          "Trademark law quietly agrees with memory science. Marks are graded on a spectrum of strength, and descriptive names sit at the weak end: hard to register, expensive to defend, forever sharing the register with lookalikes. Coined and arbitrary names sit at the strong end, where protection is broad and conflicts are rare. The name that is easiest to defend is the same name that is easiest to remember, and both for the same reason: nobody else was standing there.",
          "The exact match dot com deserves demotion from requirement to preference. Buyers arrive through search, social profiles, and increasingly through assistants that resolve a spoken name to an entity, and every one of those routes runs on recall rather than typing. A distinctive name with a modified domain outperforms a compromised name with a perfect one, because the name is spoken, remembered, and asked for far more often than it is typed.",
          "The order of operations that saves money: audition first, then screen the survivors through a trademark search in your classes and markets, then accept whatever sensible domain exists. Founders who run it backwards let a parking page veto their strongest candidate, which hands naming authority to whoever squatted fastest.",
        ],
      },
      {
        id: "spending-meaning-into-a-name",
        heading: "Spending meaning into a name",
        paragraphs: [
          "Every name is born empty. Google was a misspelt maths term, Kodak was invented for the sound of the shutter, and both acquired their meaning the only way meaning is acquired: deposits. Repetition, consistency, and years. Choosing a name is opening an account; the balance arrives later, and only if the deposits keep landing in one place.",
          "This is where naming projects actually fail. The distinctive candidate feels exposed on day one precisely because it is empty, the descriptive candidate feels safe because it borrows the category's existing meaning, and committees walk toward the borrowed comfort. My own practice carries the choice in its name: tatva is the Sanskrit word for essence, the element beneath a thing, and it explained zero services on day one. The name held still, the work filled it, and the filling is the point.",
          "So the last screen in the audition is a commitment, written down: one spelling, one pronunciation, one visual setting, repeated everywhere the business speaks, for years. A distinctive name with that discipline compounds. Without it, even a brilliant name stays an empty account with a lovely sound.",
        ],
        bullets: [
          "Say the name the same way in every channel, including the boring ones: invoices, voicemail, email signatures.",
          "Refuse the rebrand itch for the first several years; renaming resets the account to zero.",
          "Pair the name with one repeated visual cue so the eye and the ear deposit into the same memory.",
        ],
      },
    ],
    faq: [
      {
        question: "Should a brand name describe what the business does?",
        answer:
          "Description is the job of the sentence after the name, and giving it to the name itself buys clarity nobody needed at the price of memory everybody needed. Buyers already know the category exists; what they lack is a retrievable handle for you. Keep the name distinctive and let a plain positioning line beside it carry the explanation.",
      },
      {
        question: "Are made up words good brand names?",
        answer:
          "Coined names are the strongest option on both fronts that matter: they are maximally protectable at the trademark office and maximally free of competitor associations in memory. Their cost is a slower start, since an invented word begins empty. Screen coinages by sound, because with no dictionary meaning available, sound symbolism does all of the first impression work.",
      },
      {
        question: "Is a dot ai domain a good idea in 2026?",
        answer:
          "A dot ai address works fine as an address and poorly as a strategy. The suffix currently signals a category, and category signals age quickly; names that leaned on dot com for meaning two decades ago now read as period pieces. Choose the name for memory and sound, then take whichever sensible domain is available, and treat the suffix as plumbing.",
      },
      {
        question: "How do I test a brand name before committing?",
        answer:
          "Test retrieval rather than opinion. Show people the shortlist once in context, change the subject for ten minutes, then ask what they remember and what they would type to find it. Names win that test through distinctive sound and easy pronunciation, and it predicts the only behaviour that matters commercially. Asking people which name they like ranks familiarity, which rewards the most generic candidate.",
      },
      {
        question: "When is renaming a business worth the cost?",
        answer:
          "Rename when the current name actively blocks the strategy: it is legally undefendable, it files you in the wrong category, or it collides with a bigger entity that owns the association. Boredom is the wrong trigger, because a rename liquidates every deposit of recognition made so far. If the name is merely dull but owned and known, keep it and spend the rebrand budget on repetition instead.",
      },
    ],
    relatedSlugs: [
      "why-ai-content-makes-brands-average",
      "how-ai-assistants-choose-brands-to-recommend",
      "service-line-naming-strategy",
    ],
    sources: [
      {
        title: "Creating brand names with meaning: the use of sound symbolism",
        publisher: "Marketing Letters, Richard R. Klink",
        url: "https://doi.org/10.1023/A:1008184423824",
        note: "The foundational experiments showing vowel and consonant sounds shift perceived size, speed, weight, and sharpness of brands.",
      },
      {
        title: "Phonetic symbolism and brand name preference",
        publisher: "Journal of Consumer Research, Tina M. Lowrey and L. J. Shrum",
        url: "https://doi.org/10.1086/518530",
        note: "Shows buyers prefer names whose sound fits the product's attributes, extending sound symbolism from perception to preference.",
      },
      {
        title: "Predicting short term stock price fluctuations using processing fluency",
        publisher: "PNAS, Adam L. Alter and Daniel M. Oppenheimer",
        url: "https://doi.org/10.1073/pnas.0601071103",
        note: "The fluency evidence: easily pronounced company names and tickers outperformed in early trading purely on processing ease.",
      },
      {
        title: "Synaesthesia: a window into perception, thought and language",
        publisher: "Journal of Consciousness Studies, V. S. Ramachandran and E. M. Hubbard",
        url: "https://philpapers.org/rec/RAMSA",
        note: "Includes the bouba and kiki demonstration of near universal sound to shape mapping across languages.",
      },
      {
        title: "The domain name industry brief",
        publisher: "Verisign",
        url: "https://dnib.com/",
        note: "Verisign's quarterly registration data behind the scale of dot com saturation.",
      },
      {
        title: "Trademarks data and reports",
        publisher: "United States Patent and Trademark Office",
        url: "https://www.uspto.gov/trademarks",
        note: "Application volume context and the strength spectrum for descriptive versus arbitrary and coined marks.",
      },
    ],
  },
];
