const fs = require("node:fs");

function patchFile(path, replacements) {
  let text = fs.readFileSync(path, "utf8");
  for (const [oldText, newText, label] of replacements) {
    const count = text.split(oldText).length - 1;
    if (count !== 1) {
      throw new Error(`${path}: expected one ${label}, found ${count}`);
    }
    text = text.replace(oldText, newText);
  }
  fs.writeFileSync(path, text);
}

patchFile("src/sections/Work/CaseStudyExperience.tsx", [
  [
    `  const chapters = buildChapters(project);\n  const [activeChapter, setActiveChapter] = useState(0);\n  const chapterRefs = useRef<(HTMLElement | null)[]>([]);`,
    `  const chapters = buildChapters(project);\n  const [activeChapter, setActiveChapter] = useState(0);\n  const currentChapter = chapters[activeChapter] ?? chapters[0];\n  const chapterRefs = useRef<(HTMLElement | null)[]>([]);`,
    "current chapter state",
  ],
  [
    `<section id="story" className="scroll-mt-24 py-20 sm:py-28"`,
    `<section id="story" className="scroll-mt-24 py-14 sm:py-28"`,
    "mobile story spacing",
  ],
  [
    `<div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16">`,
    `<div className="mt-8 grid gap-8 sm:mt-12 sm:gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16">`,
    "story grid spacing",
  ],
  [
    `                      aria-current={activeChapter === index ? "step" : undefined}\n                      onClick={() => {\n                        setActiveChapter(index);\n                        chapterRefs.current[index]?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });\n                      }}`,
    `                      aria-current={activeChapter === index ? "step" : undefined}\n                      aria-pressed={activeChapter === index}\n                      aria-controls="mobile-case-study-chapter"\n                      onClick={() => {\n                        setActiveChapter(index);\n                        if (window.matchMedia("(min-width: 1024px)").matches) {\n                          chapterRefs.current[index]?.scrollIntoView({\n                            behavior: prefersReducedMotion ? "auto" : "smooth",\n                            block: "center",\n                          });\n                        }\n                      }}`,
    "chapter button behaviour",
  ],
  [
    `              </ol>\n            </div>\n\n            <div>\n              {chapters.map((chapter, index) => (`,
    `              </ol>\n\n              {currentChapter && (\n                <AnimatePresence mode="wait" initial={false}>\n                  <motion.article\n                    id="mobile-case-study-chapter"\n                    key={currentChapter.id}\n                    role="region"\n                    aria-label={\`${"${currentChapter.label}"}: ${"${currentChapter.title}"}\`}\n                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}\n                    animate={{ opacity: 1, y: 0 }}\n                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}\n                    transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: EASE }}\n                    className="mt-5 rounded-[1.35rem] border p-5 lg:hidden"\n                    style={{ borderColor: \`${"${palette.accent}"}66\`, backgroundColor: \`${"${palette.surface}"}F2\` }}\n                  >\n                    <p\n                      className="flex items-center justify-between gap-4 text-[0.58rem] font-medium uppercase tracking-[0.17em]"\n                      style={{ color: palette.secondary }}\n                    >\n                      <span>{currentChapter.label}</span>\n                      <span className="font-display text-sm" aria-hidden="true">\n                        {String(activeChapter + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}\n                      </span>\n                    </p>\n                    <h3 className="mt-3 font-display text-2xl font-normal leading-tight text-white min-[430px]:text-3xl">\n                      {currentChapter.title}\n                    </h3>\n                    <p className="mt-4 text-[0.95rem] leading-relaxed text-white/76">\n                      {currentChapter.body}\n                    </p>\n                  </motion.article>\n                </AnimatePresence>\n              )}\n            </div>\n\n            <div className="hidden lg:block">\n              {chapters.map((chapter, index) => (`,
    "mobile chapter deck",
  ],
]);

patchFile("src/sections/Work/SystemFlagship.tsx", [
  [
    `  ];\n\n  useEffect(() => {`,
    `  ];\n  const currentStep = steps[active] ?? steps[0];\n\n  useEffect(() => {`,
    "current system step",
  ],
  [
    `    if (!hydrated || prefersReducedMotion) return;`,
    `    if (!hydrated || prefersReducedMotion || !window.matchMedia("(min-width: 1024px)").matches) return;`,
    "desktop-only observer",
  ],
  [
    `  function goToStep(index: number) {\n    setActive(index);\n    const element = stepRefs.current[index];`,
    `  function goToStep(index: number) {\n    setActive(index);\n    if (!window.matchMedia("(min-width: 1024px)").matches) return;\n    const element = stepRefs.current[index];`,
    "mobile step selection",
  ],
  [
    `<section className="relative scroll-mt-28 overflow-hidden py-20 sm:py-28"`,
    `<section className="relative scroll-mt-28 overflow-hidden py-14 sm:py-28"`,
    "system section spacing",
  ],
  [
    `className="grid gap-8 border-b pb-10 lg:grid-cols-[1fr_auto] lg:items-end"`,
    `className="grid gap-6 border-b pb-7 sm:gap-8 sm:pb-10 lg:grid-cols-[1fr_auto] lg:items-end"`,
    "system heading spacing",
  ],
  [
    `className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"`,
    `className="mt-8 grid gap-8 sm:mt-12 sm:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"`,
    "system grid spacing",
  ],
  [
    `                    onClick={() => goToStep(index)}\n                    aria-current={active === index ? "step" : undefined}\n                    aria-label={\`${"${String(index + 1).padStart(2, \"0\")}"}: ${"${step.label}"}\`}`,
    `                    onClick={() => goToStep(index)}\n                    aria-current={active === index ? "step" : undefined}\n                    aria-pressed={active === index}\n                    aria-controls="mobile-system-step"\n                    aria-label={\`${"${String(index + 1).padStart(2, \"0\")}"}: ${"${step.label}"}\`}`,
    "system step accessibility",
  ],
  [
    `            </ol>\n          </div>\n\n          <div>\n            {steps.map((step, index) => (`,
    `            </ol>\n\n            <AnimatePresence mode="wait" initial={false}>\n              <motion.article\n                id="mobile-system-step"\n                key={currentStep.label}\n                role="region"\n                aria-label={\`${"${currentStep.label}"}: ${"${currentStep.title}"}\`}\n                initial={animateTransitions ? { opacity: 0, y: 10 } : false}\n                animate={{ opacity: 1, y: 0 }}\n                exit={animateTransitions ? { opacity: 0, y: -8 } : undefined}\n                transition={{ duration: animateTransitions ? 0.42 : 0, ease: EASE_ORGANIC }}\n                className="mt-4 rounded-[1.35rem] border p-5 lg:hidden"\n                style={{ borderColor: "rgba(198,169,122,0.3)", backgroundColor: "rgba(23,32,39,0.92)" }}\n              >\n                <p className="flex items-center justify-between gap-4 text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: WORK.sand }}>\n                  <span>{currentStep.label}</span>\n                  <span className="font-display text-sm" aria-hidden="true">\n                    {String(active + 1).padStart(2, "0")} / 03\n                  </span>\n                </p>\n                <h3 className="mt-3 font-display text-2xl font-normal leading-tight text-white min-[430px]:text-3xl">\n                  {currentStep.title}\n                </h3>\n                <p className="mt-4 text-[0.95rem] leading-relaxed text-white/76">{currentStep.body}</p>\n              </motion.article>\n            </AnimatePresence>\n\n            <div\n              className="mt-4 rounded-[1.35rem] border p-5 lg:hidden"\n              style={{ borderColor: "rgba(198,169,122,0.3)", backgroundColor: "rgba(198,169,122,0.08)" }}\n            >\n              <p className="text-[0.58rem] font-medium uppercase tracking-[0.17em]" style={{ color: WORK.sand }}>\n                Outcome on record\n              </p>\n              <p className="mt-3 text-[0.95rem] leading-relaxed text-white/82">{project.outcome}</p>\n              <Link\n                href={\`/work/${"${project.slug}"}\`}\n                className="link-underline mt-5 inline-flex items-center gap-2 text-sm font-medium"\n                style={{ color: WORK.sand }}\n              >\n                Read the full case study <span aria-hidden="true">→</span>\n              </Link>\n            </div>\n          </div>\n\n          <div className="hidden lg:block">\n            {steps.map((step, index) => (`,
    "mobile system board",
  ],
]);

console.log("Applied the mobile case-study chapter deck and system board.");
