# Branding Tatva — Email Automation Pack

Production ready. Every string follows the sitewide copywriting standard (zero literal "not", zero dashes in rendered copy, zero agency clichés). The only remaining step is pasting these into Mailchimp once the account automation is connected; tags and triggers below match what the site already sends.

## Audience architecture

**Tags the site already writes** (via `/api/newsletter`):
- `recognition-audit` — requested the Brand Recognition Audit (Services or Insights placement)
- untagged — plain newsletter signup (Contact page)

**Segments to create in Mailchimp:**
| Segment | Rule | Why |
|---|---|---|
| Audit leads | tag = `recognition-audit` | Highest intent; entered through a diagnostic |
| Newsletter only | has no tag | Reading interest; slower nurture |
| Engaged | opened 2 of last 3 campaigns | Candidates for the consultation invitation |
| Booked | manually tagged `booked` after a Calendly booking | Excluded from the invitation sequence |

## Journey map

```
Signup (double opt in confirm)
  └─ Email 1 · Welcome + delivery       (immediately after confirmation)
       └─ Email 2 · Brand discovery      (+3 days)
            └─ Email 3 · Authority       (+4 days)
                 └─ Email 4 · Case study (+4 days)
                      └─ Email 5 · Consultation invitation (+5 days)
Exit conditions: books a session (tag `booked`), or unsubscribes.
Audit leads enter at Email 1. Newsletter only signups skip Email 1's
audit framing and enter at Email 2.
```

---

## Email 1 — Welcome and audit delivery

- **Trigger:** double opt in confirmed, tag = `recognition-audit`
- **Delay:** immediate
- **Psychology objective:** reciprocity and immediate usefulness; the first email delivers value before asking anything
- **Subject:** Your Brand Recognition Audit, plus how to use it
- **Preview text:** Ten checks, one honest instruction.
- **Body:**

> Hi \*|FNAME|\*,
>
> Here is the full Brand Recognition Audit: ten checks that tell you where recognition stands today. You saw the first five on the site; all ten are attached here with room to score them.
>
> One instruction before you start. Score it fast, in one sitting, gut answers only. The checks measure what buyers actually experience, and buyers decide in seconds. A slow, generous self assessment defeats the whole exercise.
>
> Fewer than seven holding true usually means recognition is leaking somewhere specific. Keep your score; the next few emails will help you read it.
>
> Suman
> Branding Tatva

- **CTA:** none (deliberate; delivery email earns trust by asking for nothing)

## Email 2 — Brand discovery

- **Trigger:** Email 1 sent (or opt in confirmed, for newsletter only signups)
- **Delay:** +3 days
- **Psychology objective:** problem recognition; the reader diagnoses themselves before any service is named
- **Subject:** The mistake that keeps visible brands forgettable
- **Preview text:** Volume feels like progress. Memory disagrees.
- **Body:**

> Hi \*|FNAME|\*,
>
> The most common mistake I see in brand audits: treating visibility as the goal. More posts, more channels, more reach. Volume feels like progress because it has a dashboard.
>
> Memory works differently. A week later, with nothing on screen, can a buyer describe what your brand was and why it mattered? That question separates brands people saw from brands people choose.
>
> One real example: a nutrition brand I worked with cut posting by 48% and earned 104% more followers per post. The platform rewarded relevance over cadence, and so did the audience.
>
> If your audit score leaked in the recognition checks, this is usually why.
>
> Suman

- **CTA:** Read the full piece → /insights/visible-versus-remembered

## Email 3 — Authority

- **Trigger:** Email 2 sent
- **Delay:** +4 days
- **Psychology objective:** credibility through method rather than claims; explains why this practice sees differently
- **Subject:** Why I studied minds before I touched brands
- **Preview text:** Psychology decides what people notice. Language decides what they keep.
- **Body:**

> Hi \*|FNAME|\*,
>
> A quick word on how this practice works, because it explains every recommendation I make.
>
> My training pairs clinical psychology with English literature. One taught me how attention lands, how memory holds, and how a choice actually gets made. The other taught me how a sentence frames value and why some phrases stick for decades.
>
> Brand strategy lives exactly where those two overlap: what people notice, what they believe, and what they repeat. That is why my work starts with positioning decisions rather than design, and why every decision arrives with its reasoning written down.
>
> Decoration follows decisions. Never the other way around.
>
> Suman

- **CTA:** The thinking behind the practice → /about

## Email 4 — Case study

- **Trigger:** Email 3 sent
- **Delay:** +4 days
- **Psychology objective:** proof; a verified result told as decisions rather than magic
- **Subject:** Eight weeks, one decision, 2.81%
- **Preview text:** The whole engagement turned on posting less.
- **Body:**

> Hi \*|FNAME|\*,
>
> A real engagement, told in three beats.
>
> **The ambiguity.** Dr. Haley Nutrition's account was growing in volume while trust lagged behind. More posts kept going out; fewer people stayed.
>
> **The decision.** Post less. Make every post earn its place. Let relevance carry the account instead of cadence.
>
> **The verified result.** 104% more followers earned per post. A 1,350% jump in comments per post. Engagement rate from 0.71% to 2.81% in eight weeks, with impressions barely moving even as posting dropped by nearly half.
>
> Every number above is on the public case study, with the reasoning documented.
>
> Suman

- **CTA:** Read the full case study → /work/dr-haley-nutrition

## Email 5 — Consultation invitation

- **Trigger:** Email 4 sent, tag `booked` absent
- **Delay:** +5 days
- **Psychology objective:** low friction invitation; frames the call as diagnosis, never as pitch
- **Subject:** Bring me your hardest brand question
- **Preview text:** Twenty minutes. Honest feedback either way.
- **Body:**

> Hi \*|FNAME|\*,
>
> You have had the audit for a couple of weeks now. If a specific check kept bothering you, that is usually the place to start.
>
> The Brand Strategy Session is twenty minutes: you describe where the brand stands, I ask direct questions about positioning and recognition, and you get honest feedback either way. If it makes sense to continue, we agree what the first thirty days would look like. If it makes no sense, I will say that too.
>
> Alternatively, just reply to this email with your hardest brand question. I read every reply personally.
>
> Suman

- **CTA:** Book a Brand Strategy Session → /contact#call

---

## Setup notes (one time, in Mailchimp)

1. Create the four segments above; create the `booked` tag and apply it manually (or via Calendly's Mailchimp integration) when a session is booked.
2. Build one Customer Journey starting at "tag added: recognition-audit" with the delays above; a second journey for untagged signups entering at Email 2.
3. Attach the audit as a styled PDF or link to /services (the audit lives on the page); the ten checks are in `src/sections/Services/RecognitionAudit.tsx`.
4. `FNAME` merge field is already populated by the site's form.
