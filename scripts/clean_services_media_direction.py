#!/usr/bin/env python3
"""Remove stale stock-era direction notes from the Services media pass."""

from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "src/app/services/page.tsx"
README = ROOT / "public/videos/generated/README.txt"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return text.replace(old, new, 1)


def regex_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S | re.M)
    if count != 1:
        raise SystemExit(f"{label}: expected one match, found {count}")
    return updated


def main() -> None:
    page = PAGE.read_text()

    page = replace_once(
        page,
        '''// process sequence was also rendering with overlapping text, a real
// bug, not just a pacing call. See the plan doc (Phase 14) for the
// full original reasoning, including why GSAP ScrollTrigger.pin
// appears exactly once (PinnedBrandBuild) and Three.js exactly once
// (inside PerceptionLadder, via AmbientElementShader) rather than
// throughout — every other pinned moment on this page and site runs on
// the same sticky mechanism already proven everywhere else.''',
        '''// process sequence was also rendering with overlapping text, a real
// bug, not just a pacing call. See the plan doc (Phase 14) for the
// original reasoning. PinnedBrandBuild now uses the same CSS-sticky
// mechanism proven elsewhere on the site; Three.js remains scoped once
// inside PerceptionLadder rather than becoming a page-wide effect.''',
        "page architecture note",
    )

    page = replace_once(
        page,
        '''// so every chapter competed with its own background. The seams stay as
// the site's one transition grammar; the shader repeats and particle
// fields are gone, leaving the filmed footage to carry atmosphere.''',
        '''// so every chapter competed with its own background. The seams stay as
// the site's one transition grammar; repeated shaders and particle
// fields are gone, leaving original films and material stills to carry
// atmosphere without competing with the chapter interaction.''',
        "ambient consolidation note",
    )

    page = replace_once(
        page,
        '''      {/* Charcoal ground for the whole experience — the permanent fix
          for the "white space at left and right" class of bug. The
          site's body ground is cream; on this page every full-bleed
          scene paints its own dark background, and the one section
          whose paint is delegated to a GSAP-pinned child
          (PinnedBrandBuild) can transiently narrow when the pin's
          cached width measurement goes stale — the documented pin
          artifact class — exposing cream at both edges. With the page
          ground itself charcoal (and the #authority wrapper painting
          charcoal below), no measurement artifact anywhere on this
          page can ever expose a light edge again: worst case is
          charcoal on charcoal, invisible. The parchment chapter still
          paints its own bg-background-alt deliberately. */}''',
        '''      {/* Charcoal is the page-level ground beneath every full-bleed
          chapter and scene handoff. It prevents the cream body colour
          from flashing at a sticky or transformed boundary, while the
          deliberately light contextual CTA continues to paint its own
          surface. */}''',
        "page ground note",
    )

    page = replace_once(
        page,
        '''          {/* Scene dissolve system, boundary 1 of 7: the hero's last
              frames darken into Authority's charcoal, so the cut into
              the pinned build reads as the same shot getting darker
              rather than a new page section starting. Every following
              chapter opens with the same device — a veil of the
              PREVIOUS chapter's mood color dissolving into its own —
              one continuous color journey instead of stacked blocks. */}''',
        '''          {/* The hero's last frames darken into the Situation
              chapter's charcoal. Every later chapter uses the same
              veil-and-handoff grammar, so the page reads as one colour
              journey rather than a stack of unrelated blocks. */}''',
        "hero handoff note",
    )

    page = replace_once(
        page,
        '''          {/* Original procedural Situation film: one coherent material
    world holds three different starting conditions. A pale
    mineral seed begins, shifted strata wait to realign, and
    repeating rings carry consistency forward. The chapter now
    teaches diagnosis without borrowing the Package selector's
    separate water-current metaphor. */}
<BackgroundVideo
  parallax
  video="/videos/generated/bt-services-situation-paths.mp4"
  videoMobile="/videos/generated/bt-services-situation-paths-mobile.mp4"
  poster="/images/generated/bt-services-situation-paths-poster.jpg"
  playbackRate={1.06}
/>
          {/* A left-weighted charcoal scrim protects the diagnosis copy
    while keeping all three material states visible across the
    lower frame. */}''',
        '''          {/* Original procedural Situation film: one coherent material
              world holds three different starting conditions. A pale
              mineral seed begins, shifted strata wait to realign, and
              repeating rings carry consistency forward. The chapter now
              teaches diagnosis without borrowing the Package selector's
              separate water-current metaphor. */}
          <BackgroundVideo
            parallax
            video="/videos/generated/bt-services-situation-paths.mp4"
            videoMobile="/videos/generated/bt-services-situation-paths-mobile.mp4"
            poster="/images/generated/bt-services-situation-paths-poster.jpg"
            playbackRate={1.06}
          />
          {/* A left-weighted charcoal scrim protects the diagnosis copy
              while keeping all three material states visible across the
              lower frame. */}''',
        "Situation media formatting",
    )

    page = replace_once(
        page,
        '''        {/* Desire — the real package selector, moved to chapter three
            per the conversion redesign: packages exposed inside the
            first two scrolls instead of after the teaching chapters.
            Mood: DEEP WATER — same fungi clip and overlay as before the
            move; only the dissolve colors changed with the new
            neighbours. The full art direction history for this chapter
            lives in git on the pre move block. */}''',
        '''        {/* Desire exposes the packages early enough for a ready
            visitor to act before the teaching chapters. Its original
            deep-water film keeps three legitimate currents visible,
            then lets them resolve into one legible scope. */}''',
        "Desire direction note",
    )

    page = replace_once(
        page,
        '''        {/* Authority — the one deliberate ScrollTrigger.pin section. */}
        {/* The wrapper paints charcoal itself — it sits in normal flow,
            is never transformed by GSAP, and therefore always spans the
            full viewport regardless of what the pin does to its child.
            See the main-level comment above for the full root cause. */}''',
        '''        {/* Authority is the page's one extended CSS-sticky teaching
            chapter. The wrapper stays in normal flow and paints its own
            charcoal ground, so the five-layer build never disagrees
            with the viewport width. */}''',
        "Authority wrapper note",
    )

    page = regex_once(
        page,
        r'''^[ \t]*\{/\* Education — the one Three\.js moment.*?See MOOD in sectionWash\.ts\. \*/\}\n''',
        '''        {/* Education turns recognition into a changing point of view.
            PerceptionLadder keeps the page's one scoped Three.js accent,
            while the original perception-ascent film clarifies terrain
            around a signal instead of borrowing generic growth footage. */}
''',
        "Education direction notes",
    )

    page = regex_once(
        page,
        r'''^[ \t]*\{/\* Approved Education footage \(Pexels 8522207.*?reads as shrinking\)\. \*/\}\n''',
        "",
        "stale Education stock note",
    )

    page = replace_once(
        page,
        '''        {/* Deliverables — direct feedback wanted these to feel
            tangible rather than left as bullet points inside a card. Every
            item traces to real services.ts data (see the component's
            own comment). No id/jump-nav entry — a supporting beat within
            Desire's own objection. Same shader treatment as the
            sections around it — see WeakBrandingCost's comment above
            for why. */}''',
        '''        {/* Deliverables makes the invisible work tangible. Every
            artifact traces to real services data, and the live explorer
            stays the primary interaction inside an original paper-and-
            vellum material environment. */}''',
        "Deliverables introduction",
    )

    page = replace_once(
        page,
        '''        {/* Mood: THE ARCHIVE. The background now belongs to the work
  being explained: layered paper, vellum, blind-debossed grids,
  and dark folios form one ordered material system. The live
  ArtifactPreview remains the chapter's primary interaction;
  the environment only gives that interaction a tactile world. */}''',
        '''        {/* Mood: THE ARCHIVE. Layered paper, vellum,
            blind-debossed grids, and dark folios form one ordered
            material system behind the live ArtifactPreview. */}''',
        "Deliverables mood formatting",
    )

    page = replace_once(
        page,
        '''          {/* Original generated Deliverables archive: ivory papers,
    translucent vellum, embossed grids, dark folios, and one
    stone weight make the invisible work feel tangible before
    a visitor opens an individual artifact. Its scroll-linked
    drift and edge light remain secondary to the explorer. */}
<DeliverablesCinematicBackdrop image="/images/generated/bt-services-deliverables-archive.png" />''',
        '''          {/* Original generated Deliverables archive: ivory papers,
              translucent vellum, embossed grids, dark folios, and one
              stone weight make the invisible work feel tangible before
              a visitor opens an individual artifact. Its scroll-linked
              drift and edge light remain secondary to the explorer. */}
          <DeliverablesCinematicBackdrop image="/images/generated/bt-services-deliverables-archive.png" />''',
        "Deliverables media formatting",
    )

    page = replace_once(
        page,
        '''          {/* Scene dissolve: Education's blue mist settles onto the
    archive's charcoal and paper planes. */}''',
        '''          {/* Education's blue mist settles onto the archive's
              charcoal and paper planes. */}''',
        "Deliverables handoff formatting",
    )

    page = replace_once(
        page,
        '''        {/* A slower alternative to Desire's one-click pick, for a visitor
            who wants to think it through before Risk removal and the
            booking CTA — direct feedback wanted the visitor to feel
            invested before the calendar appears. Transparent scoring,
            real package mapping, see the component's own comment for
            why it's a distinct mechanism from PackageSelector rather
            than a duplicate of it. Same shader treatment as the
            sections around it — see WeakBrandingCost's comment above
            for why. */}
        {/* Mood: FOREST — deep green-black after the light editorial
            break; the stream clip's mossy greens finally read as green
            instead of being re-warmed to amber by a soil overlay. */}''',
        '''        {/* Brand Health Check is the slower diagnostic alternative
            to the package selector. Transparent scoring and real package
            mapping sit over an original reflection film that reveals
            hidden misalignment beneath an apparently coherent surface.
            Mood: deep forest green-black after the light editorial break. */}''',
        "Health direction notes",
    )

    page = replace_once(
        page,
        '''          {/* Scene dissolve: the dossier's parchment light spills into
              the top of the forest — light traveling downward into the
              next scene. */}
          {/* Scene dissolve: the study's warm dark hands into the
              forest — lamplight dimming into green-black. */}''',
        '''          {/* The archive's pale paper light dims into the Health
              Check's green-black reflection. */}''',
        "Health handoff note",
    )

    PAGE.write_text(page)

    readme = README.read_text()
    readme = replace_once(
        readme,
        "- renderer: scripts/generate_services_authority_film.py\nStakes / distinctive positioning",
        "- renderer: scripts/generate_services_authority_film.py\n\nStakes / distinctive positioning",
        "Authority README spacing",
    )
    README.write_text(readme)


if __name__ == "__main__":
    main()
