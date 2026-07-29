export type ElementPhilosophy = {
  element: "earth" | "water" | "fire" | "air" | "space";
  thinker: string;
  text: string;
};

// One real, correctly-attributed idea per element, tying the practical
// meaning already established in elements.ts (poetic/meaning fields) to
// something older than a brand-strategy framework. Kept to real,
// verifiable ideas rather than invented or approximate quotes, since a
// misattributed quote is worse than no reference at all. Weighted
// toward Indian thought on purpose (three of five), given the practice's
// own name and the standing rule that Indian references here carry real
// meaning, never decoration.
export const philosophy: ElementPhilosophy[] = [
  {
    element: "earth",
    thinker: "Chanakya",
    text: "Chanakya built his Arthashastra on one premise: read the actual terrain honestly before making a single move. Every project here starts the same way, with purpose, audience, and positioning worked out before anything gets designed.",
  },
  {
    element: "water",
    thinker: "Dostoyevsky",
    text: "Dostoyevsky's method was staying inside one person's experience long enough to actually understand it. A customer journey map is trying to do the same thing, on a smaller and much less literary scale.",
  },
  {
    element: "fire",
    thinker: "Nietzsche",
    text: "Nietzsche's own instruction was to become who you are. Good creative direction does the same work: it finds the identity already sitting inside a brand and gives it the nerve to be seen.",
  },
  {
    element: "air",
    thinker: "Kabir",
    text: "Kabir's dohas cut through centuries of ornament with plain, direct language, and they are still quoted for exactly that reason. Messaging works the same way: the plainest true sentence usually beats the clever one.",
  },
  {
    element: "space",
    thinker: "Tagore",
    text: "Tagore built a body of work meant to be carried in memory across generations. Recognition works the same way: it is built through months of steady presence, one deliberate showing at a time.",
  },
];
