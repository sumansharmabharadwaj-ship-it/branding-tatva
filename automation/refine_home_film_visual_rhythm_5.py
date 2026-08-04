from pathlib import Path


def replace_once(source: str, old: str, new: str, label: str) -> str:
    if new in source and old not in source:
        return source
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one old match, found {count}")
    return source.replace(old, new, 1)


path = Path("src/sections/Home/MoodboardTatvaFilm.tsx")
source = path.read_text()

source = replace_once(
    source,
    """  useScroll,
  useSpring,
} from "framer-motion";""",
    """  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";""",
    "import the Tatva exit transform",
)
source = replace_once(
    source,
    """  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.25,
  });""",
    """  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.25,
  });
  const foregroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.9, 0.975, 1],
    [1, 1, 0, 0],
  );
  const foregroundY = useTransform(scrollYProgress, [0.9, 1], [0, -18]);""",
    "create the Tatva exit dissolve",
)
source = replace_once(
    source,
    '        <div className="absolute inset-x-6 top-24 z-30 flex items-center justify-between text-[0.52rem] uppercase tracking-[0.22em] sm:inset-x-10 lg:inset-x-14 lg:top-28">',
    '        <motion.div className="absolute inset-x-6 top-24 z-30 flex items-center justify-between text-[0.52rem] uppercase tracking-[0.22em] sm:inset-x-10 lg:inset-x-14 lg:top-28" style={{ opacity: foregroundOpacity }}>',
    "fade the Tatva chapter marker",
)
source = replace_once(
    source,
    """          </span>
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[94rem] items-start px-6 pb-20 pt-36 sm:px-10 lg:px-14 lg:pt-40">""",
    """          </span>
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto flex h-full max-w-[94rem] items-start px-6 pb-20 pt-36 sm:px-10 lg:px-14 lg:pt-40"
          style={{ opacity: foregroundOpacity, y: foregroundY }}
        >""",
    "animate the Tatva foreground",
)
source = replace_once(
    source,
    """            </div>
          </div>
        </div>

        <div className="absolute inset-x-6 bottom-6 z-30 sm:inset-x-10 lg:inset-x-14">""",
    """            </div>
          </div>
        </motion.div>

        <div className="absolute inset-x-6 bottom-6 z-30 sm:inset-x-10 lg:inset-x-14">""",
    "close the animated Tatva foreground",
)

path.write_text(source)
