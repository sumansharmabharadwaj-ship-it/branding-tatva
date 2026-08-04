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
    '        <div className="relative z-10 mx-auto flex h-full max-w-[94rem] items-center px-6 pb-20 pt-24 sm:px-10 lg:px-14 lg:pt-28">',
    '        <div className="relative z-10 mx-auto flex h-full max-w-[94rem] items-start px-6 pb-20 pt-36 sm:px-10 lg:px-14 lg:pt-40">',
    "anchor the Tatva composition below the fixed header",
)
source = replace_once(
    source,
    '                <h2 className="mt-5 font-display text-[clamp(4.15rem,8.7vw,8.45rem)] font-normal leading-[0.84] tracking-[-0.055em]">',
    '                <h2 className="mt-4 font-display text-[clamp(3.8rem,7.6vw,7.2rem)] font-normal leading-[0.88] tracking-[-0.05em]">',
    "reduce the short-laptop Tatva title",
)
source = replace_once(
    source,
    '              <div className="relative h-[20rem] overflow-hidden rounded-[1.8rem] border border-[#22231F]/14 bg-[#F5F0E8]/82 p-5 shadow-[0_26px_70px_-52px_rgba(34,35,31,.5)] backdrop-blur-xl sm:h-[25rem]">',
    '              <div className="relative h-[20rem] overflow-hidden rounded-[1.8rem] border border-[#22231F]/14 bg-[#F5F0E8]/82 p-5 shadow-[0_26px_70px_-52px_rgba(34,35,31,.5)] backdrop-blur-xl sm:h-[23rem] min-[1400px]:h-[25rem]">',
    "fit the Tatva diagram above the chapter rail",
)

path.write_text(source)
