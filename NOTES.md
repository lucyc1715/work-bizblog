# Open notes

Working notes for this site. Nothing here is published — Astro keeps HTML
comments in the output, so notes never go in the page files.

## Content gaps

**`work/licensed-bank-delivery.astro` — the KYC section has no scene in it.**
It has a starting point (operations handed over requirements in the language
of regulation) and an ending point (accepted into production against FSC
requirements), and nothing in between. The page's strongest possible addition
is one concrete round: how many times the spec turned, how the requirements
were narrowed down, what a piece of feedback from FSC or from operations
changed. That detail is not in `drafts/FACTS.md`, so it has to come from Lucy.

## Settled

**The decade — decided, do not re-open (8c6eaaf).** The claim is ten years in
software, of which five are in finance and three are inside a licensed bank.
Every place that counts says it that way now: `index.astro:14`,
`about.astro:8`, `about.astro:13`, `cv.astro:9` and the description in
`layouts/Base.astro:15`. The earlier wording said ten years in banks, which
the CV's own dates do not support. If one of these lines is edited, the other
four have to keep the same arithmetic.

**`writing/stop-searching-for-side-project-ideas-build-a-worklog.astro` —
deleted (8c6eaaf).** Written years ago and republished as is; it contradicted
the CV on degree, job title and years of experience. The page and its card on
the writing index are gone. Republishing it means rewriting it first.

## Open

**`npm run check` cannot run — `@astrojs/check` is not installed.** AGENTS.md
lists it as the one gate that has to pass before a push, but the package is
not in `package.json` and running the script only offers to install it.
Installing needs Lucy's say-so, since the project is meant to depend on astro
alone. Until that is settled, `npm run build` is the only gate that actually
runs.

**With JavaScript off, every page renders blank.** `site.css` hides `.route` by
default and only `.route.active` is visible, and the `active` class is added by
`site.js:308-310` at init. Nothing adds it without JS, so a visitor or crawler
that does not run scripts sees an empty page. This is a leftover from the
single-file prototype, which used a hash router and needed to hide the inactive
routes. Now that Astro emits one route per page the hiding has no job left, and
`.route{display:none}` could probably just go. Left alone because it touches
every page and the reveal animations read the same class. The print stylesheet
already works around it by forcing `.route{display:block}`. Worth noting that
AGENTS.md describes the `data-site` fallback text as being there for crawlers
and no-JS visitors, which cannot be true while this rule stands.

**Four dead CSS blocks predate the recruiter-first rewrite.** `.diagram-box`,
`.rlist`, `.sublist` and `.placeholder` are defined in `site.css` but referenced
by nothing under `src/`. They were already unused before the rewrite (checked
against HEAD), so they were left alone rather than swept up in an unrelated
change. Delete them whenever `site.css` is next touched for real.

**Wide tables scroll sideways on phones and the last column is cut off.**
`.cheat-sheet` and `.decision-table` become their own scroll container below
700px (`site.css`, responsive block), which stops them pushing the whole page
sideways, but there is no visual hint that the row continues past the edge.
Stacking each row into a card is the better mobile treatment; it was left out
because it changes how the tables read, not just how they fit.

## Known, deliberate

- Product screenshots carry a "sample data" note. That is intentional.
- Chinese characters in the writing articles are Taiwanese organisation names,
  not stray notes.
- The second Engineering card on the writing index ("Three payment rails, one
  entitlement") is a placeholder marked Coming soon, not a broken link.
