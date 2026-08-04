from pathlib import Path


def replace_once(source: str, old: str, new: str, label: str) -> str:
    if new in source and old not in source:
        return source
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one old match, found {count}")
    return source.replace(old, new, 1)


home = Path("src/sections/Home/MoodboardHome.tsx")
source = home.read_text()

source = replace_once(
    source,
    '        <div className="film-reveal relative min-h-[38rem] overflow-hidden rounded-[2rem] border border-[#22231F]/10 bg-[#1E2A22] sm:min-h-[44rem]">',
    '        <div className="film-reveal relative min-h-[44rem] overflow-hidden rounded-[2rem] border border-[#22231F]/10 bg-[#1E2A22]">',
    "restore founder portrait height",
)
source = replace_once(
    source,
    '          <Image src="/images/own-portrait.jpg" alt="Suman Sharma, founder of Branding Tatva" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition:"center 62%" }} />',
    '          <Image src="/images/own-portrait.jpg" alt="Suman Sharma, founder of Branding Tatva" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition:"center 36%" }} />',
    "restore founder portrait focal point",
)
source = replace_once(
    source,
    '        <div className="film-reveal grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end">',
    '        <div className="film-reveal grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">',
    "rebalance three paths intro",
)
source = replace_once(
    source,
    '          <div><p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#9D6B4C]">Three paths</p><h2 className="mt-5 max-w-3xl font-display text-[clamp(3.05rem,6.15vw,6.2rem)] font-normal leading-[0.94] tracking-[-0.045em]">The work meets the business wherever it stands.</h2></div>',
    '          <div><p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#9D6B4C]">Three paths</p><h2 className="mt-5 max-w-4xl font-display text-[clamp(2.85rem,4.8vw,4.9rem)] font-normal leading-[0.96] tracking-[-0.04em]">The work meets the business wherever it stands.</h2></div>',
    "resize three paths heading",
)
home.write_text(source)


tatva = Path("src/sections/Home/MoodboardTatvaFilm.tsx")
source = tatva.read_text()
source = replace_once(
    source,
    '                exit={{ opacity: 0.58, y: -14 }}',
    '                exit={{ opacity: 0, y: -6, transition: { duration: 0 } }}',
    "synchronise Tatva copy",
)
source = replace_once(
    source,
    '                    exit={{ opacity: 0.56, scale: 1.025 }}',
    '                    exit={{ opacity: 0, scale: 1, transition: { duration: 0 } }}',
    "synchronise Tatva diagram",
)
source = replace_once(
    source,
    '                  exit={{ opacity: 0.58, x: -10 }}',
    '                  exit={{ opacity: 0, x: 0, transition: { duration: 0 } }}',
    "synchronise Tatva change card",
)
tatva.write_text(source)
