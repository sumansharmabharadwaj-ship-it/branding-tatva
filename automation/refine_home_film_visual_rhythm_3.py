from pathlib import Path


def replace_once(source: str, old: str, new: str, label: str) -> str:
    if new in source and old not in source:
        return source
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one old match, found {count}")
    return source.replace(old, new, 1)


tatva = Path("src/sections/Home/MoodboardTatvaFilm.tsx")
source = tatva.read_text()
source = replace_once(
    source,
    '        <div className="absolute inset-x-6 top-7 z-30 flex items-center justify-between text-[0.52rem] uppercase tracking-[0.22em] sm:inset-x-10 lg:inset-x-14">',
    '        <div className="absolute inset-x-6 top-24 z-30 flex items-center justify-between text-[0.52rem] uppercase tracking-[0.22em] sm:inset-x-10 lg:inset-x-14 lg:top-28">',
    "move Tatva chapter label below the fixed header",
)
source = replace_once(
    source,
    '        <div className="relative z-10 mx-auto flex h-full max-w-[94rem] items-center px-6 sm:px-10 lg:px-14">',
    '        <div className="relative z-10 mx-auto flex h-full max-w-[94rem] items-center px-6 pb-20 pt-24 sm:px-10 lg:px-14 lg:pt-28">',
    "protect Tatva composition on short laptop screens",
)
tatva.write_text(source)


home = Path("src/sections/Home/MoodboardHome.tsx")
source = home.read_text()
source = replace_once(
    source,
    'position="center"/><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,31,25,.08),rgba(22,31,25,.3)_52%,rgba(22,31,25,.68))]"/><div className="relative z-10 mx-auto flex min-h-[92svh] max-w-[94rem] items-end px-6 pb-16 pt-28 sm:px-10 sm:pb-20 lg:px-14">',
    'position="center"/><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,31,25,.08),rgba(22,31,25,.3)_52%,rgba(22,31,25,.68))]"/><div className="relative z-10 mx-auto flex min-h-[92svh] max-w-[94rem] items-end px-6 pb-10 pt-28 sm:px-10 sm:pb-16 lg:px-14 lg:pb-20">',
    "move the mobile closing question below the fixed header",
)
home.write_text(source)
