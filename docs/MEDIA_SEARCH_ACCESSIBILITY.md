# Media search and accessibility contract

## Current classification

- Atmospheric films are silent, looping visual layers. They repeat or deepen meaning already present in nearby HTML copy and remain `aria-hidden="true"`.
- Project evidence diagrams are the searchable visual record. Each case-study route supplies a descriptive alt value, an `ImageObject`, a caption, credit text, and a sitemap image entry.
- Every published Insight supplies a descriptive hero-image alt value, an `ImageObject` in its article graph, and a sitemap image entry.
- Core commercial routes expose one representative image in the XML sitemap.

## Informational-video rule

Any future video that introduces meaning unavailable in nearby DOM copy must include:

1. A captions track.
2. A stable adjacent transcript identified from the video with `data-transcript-id`.
3. A descriptive title and poster.
4. `VideoObject` markup only when the video is prominent on a stable page and the title, description, thumbnail, duration, upload date, and content URL are verified.

The media search gate rejects an unclassified `<video>` before deployment. This keeps cinematic scenery separate from client evidence and prevents decorative loops from being presented to search engines as documentary work.
