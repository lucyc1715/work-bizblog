# work.lucycbiz.com

Lucy Chen's professional site, served from a subdomain of lucycbiz.com. Astro, static output, no framework runtime.

Built from the v3 prototype at
`lucy-minions/prototypes/lucycbiz/preview/v3/index.html`. That file was a single
HTML document with a hash router; here every route is a real page. The copy,
markup, CSS and motion code are unchanged.

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site into dist/
npm run preview  # serve dist/ locally
```

## Layout

```
src/
  layouts/Base.astro         head, header, footer, theme bootstrap
  components/Header.astro    nav; the active link is resolved at build time
  components/Footer.astro
  pages/                     one file per route (12)
  styles/site.css            the prototype's stylesheet, verbatim
  scripts/site.js            the prototype's script, minus the hash router
public/assets/               images
```

## Two things worth knowing before you edit

**Availability lives in one place.** `src/scripts/site.js` holds `CITIES`,
`ROLE` and `NOTICE` at the top. Anywhere the site names a city or a notice
period, the markup carries a `data-site="key"` slot that the script fills in.
Change a city or a start date there and every page follows. Do not hand-edit
those strings in the pages.

**Nav highlighting is a build-time job.** The prototype's router set the `on`
class as you navigated. `Header.astro` now derives it from `Astro.url.pathname`,
so a new top-level section needs its link added there with a `data-nav` value.

## Adding a page

Add a `.astro` file under `src/pages/`, wrap the body in
`<Base title="Page name">` with a single `<section class="route">` inside, and
link to it. The section class is what the motion code hooks onto.
