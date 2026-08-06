from __future__ import annotations

import re
from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def update_photo_hero() -> None:
    path = Path("src/components/PhotoHero.tsx")
    text = path.read_text()

    text = replace_once(
        text,
        "  video,\n  poster,",
        "  video,\n  videoMobile,\n  poster,",
        "PhotoHero destructuring",
    )
    text = replace_once(
        text,
        "  video?: string;\n  poster?: string;",
        "  video?: string;\n  videoMobile?: string;\n  poster?: string;",
        "PhotoHero prop type",
    )
    text = replace_once(
        text,
        "  accentColor,\n}: {",
        "  accentColor,\n  overlayGradient = gradient,\n}: {",
        "PhotoHero overlay destructuring",
    )
    text = replace_once(
        text,
        "  accentColor?: string;\n}) {",
        "  accentColor?: string;\n  overlayGradient?: string;\n}) {",
        "PhotoHero overlay type",
    )

    old_video = '''          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
            style={{ objectPosition: imagePosition }}
            src={video}
            autoPlay
            muted
            loop
            playsInline
          />'''
    new_video = '''          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
            style={{ objectPosition: imagePosition }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            {videoMobile && <source src={videoMobile} media="(max-width: 767px)" type="video/mp4" />}
            <source src={video} type="video/mp4" />
          </video>'''
    text = replace_once(text, old_video, new_video, "PhotoHero video element")

    gradient_count = text.count("style={{ backgroundImage: gradient }}")
    if gradient_count != 2:
        raise SystemExit(
            f"PhotoHero gradient: expected two matches, found {gradient_count}"
        )
    text = text.replace(
        "style={{ backgroundImage: gradient }}",
        "style={{ backgroundImage: overlayGradient }}",
    )

    path.write_text(text)


def update_background_video() -> None:
    path = Path("src/components/BackgroundVideo.tsx")
    text = path.read_text()

    text = replace_once(
        text,
        "  video,\n  videoWebm,",
        "  video,\n  videoMobile,\n  videoWebm,",
        "BackgroundVideo destructuring",
    )
    text = replace_once(
        text,
        "  video: string;\n  // Optional WebM sibling,",
        "  video: string;\n"
        "  // Optional lower-bandwidth MP4 selected by the browser on phones.\n"
        "  videoMobile?: string;\n"
        "  // Optional WebM sibling,",
        "BackgroundVideo prop type",
    )
    text = replace_once(
        text,
        '          {videoWebm && <source src={videoWebm} type="video/webm" />}\n'
        '          <source src={video} type="video/mp4" />',
        '          {videoMobile && <source src={videoMobile} media="(max-width: 767px)" type="video/mp4" />}\n'
        '          {videoWebm && <source src={videoWebm} type="video/webm" />}\n'
        '          <source src={video} type="video/mp4" />',
        "BackgroundVideo source list",
    )

    path.write_text(text)


def update_services_page() -> None:
    path = Path("src/app/services/page.tsx")
    text = path.read_text()

    text = replace_once(
        text,
        'preload("/images/pexels-aspen-sunburst-poster.jpg", { as: "image", fetchPriority: "high" });',
        'preload("/images/generated/bt-services-hero-root-system-poster.jpg", { as: "image", fetchPriority: "high" });',
        "Services hero preload",
    )

    text = replace_once(
        text,
        '''        <PhotoHero
          video="/videos/pexels-aspen-sunburst.mp4"
          poster="/images/pexels-aspen-sunburst-poster.jpg"
          minHeight="70vh"
        >''',
        '''        <PhotoHero
          video="/videos/generated/bt-services-hero-root-system.mp4"
          videoMobile="/videos/generated/bt-services-hero-root-system-mobile.mp4"
          poster="/images/generated/bt-services-hero-root-system-poster.jpg"
          minHeight="70vh"
          overlayGradient="linear-gradient(180deg, rgba(12,17,16,0.54) 0%, rgba(12,17,16,0.64) 58%, rgba(12,17,16,0.82) 100%)"
        >''',
        "Services hero media props",
    )

    hero_comment_pattern = re.compile(
        r"          \{/\* Approved awakening footage \(Pexels 31883946, Joshua.*?page wakes into the burst\. \*/\}\n",
        re.DOTALL,
    )
    text, count = hero_comment_pattern.subn(
        '''          {/* Original generated hero loop: a living underground root
              network becomes legible as a restrained mineral-ivory
              signal travels through connected paths. The image explains
              the page's premise before the copy does: brand recognition
              is a system beneath the visible surface, not one isolated
              deliverable. A dedicated mobile encode and generated poster
              keep the first paint quiet, fast, and semantically intact. */}
''',
        text,
        count=1,
    )
    if count != 1:
        raise SystemExit(f"Hero comment: expected one match, found {count}")

    offerings_open = '''        <section id="offerings" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          <Container className="relative max-w-6xl">'''
    offerings_new = '''        <section id="offerings" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24" style={{ backgroundColor: MOOD.charcoal }}>
          {/* Original generated strategy terrain: mist withdraws from a
              tactile topographic world while one pale route becomes
              clear. The six disciplines stay distinct in the foreground,
              but the moving terrain makes the shared strategic foundation
              visible without turning the chapter into another card grid. */}
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-strategy-topography.mp4"
            videoMobile="/videos/generated/bt-services-strategy-topography-mobile.mp4"
            poster="/images/generated/bt-services-strategy-topography-poster.jpg"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgba(16,20,19,0.9) 0%, rgba(16,20,19,0.74) 46%, rgba(16,20,19,0.56) 100%)",
            }}
          />
          <Container className="relative max-w-6xl">'''
    text = replace_once(
        text,
        offerings_open,
        offerings_new,
        "Offerings generated media",
    )

    old_health = '''          <BackgroundVideo
            parallax
            video="/videos/pexels-moss-stream.mp4"
            videoWebm="/videos/pexels-moss-stream.webm"
            poster="/images/pexels-moss-stream-poster.jpg"
          />'''
    new_health = '''          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-health-reflection.mp4"
            videoMobile="/videos/generated/bt-services-health-reflection-mobile.mp4"
            poster="/images/generated/bt-services-health-reflection-poster.jpg"
          />'''
    text = replace_once(
        text,
        old_health,
        new_health,
        "Health Check generated media",
    )

    health_comment_pattern = re.compile(
        r"          \{/\* Media replaced per direct approval \(Pexels id 38507614,.*?2\.0MB MP4 / 0\.7MB WebM\. \*/\}\n",
        re.DOTALL,
    )
    text, count = health_comment_pattern.subn(
        '''          {/* Original generated diagnostic reflection loop: the
              surface first reads as coherent, then faint misalignments
              reveal themselves beneath it before settling into visible
              priorities. It turns the Health Check's actual job into the
              motion itself, with a smaller mobile encode and a still
              generated from the same visual world for reduced motion. */}
''',
        text,
        count=1,
    )
    if count != 1:
        raise SystemExit(f"Health comment: expected one match, found {count}")

    required_paths = (
        "/videos/generated/bt-services-hero-root-system.mp4",
        "/videos/generated/bt-services-strategy-topography.mp4",
        "/videos/generated/bt-services-health-reflection.mp4",
        "/videos/generated/bt-services-hero-root-system-mobile.mp4",
        "/videos/generated/bt-services-strategy-topography-mobile.mp4",
        "/videos/generated/bt-services-health-reflection-mobile.mp4",
    )
    for required in required_paths:
        if required not in text:
            raise SystemExit(f"Missing final Services reference: {required}")

    path.write_text(text)


def main() -> None:
    update_photo_hero()
    update_background_video()
    update_services_page()
    print("Generated Services media references installed successfully.")


if __name__ == "__main__":
    main()
