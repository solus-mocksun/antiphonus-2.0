# Antiphonus — CSS Naming Convention

This site is going to get big (Home, Characters, World, Story, and more).
This doc is the rulebook so classes stay consistent across pages and
across separate work sessions — read it before adding anything to
`assets/css/style.css`, don't invent a new pattern ad hoc.

## Prefixes

| Prefix | Meaning | Example |
|---|---|---|
| `ap-` | A real design-system component. Anything meant to be reused. | `.ap-btn`, `.ap-quote` |
| `fx-` | A decorative, cross-cutting visual effect. Not content. | `.fx-grain`, `.fx-scanlines` |
| `js-` | A hook JS reads/toggles. Never styled directly. | `.js-nav-toggle` |

Everything else (page-specific one-offs that will never repeat) can stay
unprefixed, but if you write the same one-off twice, promote it to an
`ap-` component instead of copy-pasting.

## Components: BEM

`.ap-[block]`, `.ap-[block]__[element]`, `.ap-[block]--[modifier]`

- **Block** — the component itself: `.ap-btn`, `.ap-quote`, `.ap-media`.
- **Element** (`__`) — a part inside it that only makes sense in that
  context: `.ap-quote__mark`, `.ap-quote__cite`.
- **Modifier** (`--`) — a variant of the block: `.ap-btn--primary`,
  `.ap-btn--ghost`.

Don't nest component selectors to reach into another component
(`.ap-card .ap-btn { ... }`) — give the variant its own modifier instead.

## Type roles, not heading tags

We name text by the *role* it plays, not by `<h1>`–`<h6>`, because the
same visual role sometimes lands on a `<div>` or `<span>` depending on
the page. This is the fixed vocabulary — don't invent new role names,
extend these instead:

`header` · `subtitle` · `content-1` · `content-2` · `body` · `mono` · `sub` · `quote`

→ classes: `.ap-type--header`, `.ap-type--subtitle`, `.ap-type--content-1`,
`.ap-type--content-2`, `.ap-type--body`, `.ap-type--mono`, `.ap-type--sub`,
`.ap-type--quote`.

If a page needs a text role that isn't on this list, add it to this
table first, *then* add the class — so the vocabulary stays a shared
reference instead of drifting per page.

## Tokens are named by role, not by value or theme name

Custom properties describe *what something is for*, never the literal
color or the theme's name — so swapping the whole visual theme later
means changing values in one place, not renaming classes across the
site.

```
--ap-color-bg           background
--ap-color-surface      a slightly-off-bg panel fill (e.g. the contact section)
--ap-color-ink          primary text
--ap-color-mid          secondary/muted text
--ap-color-dim          hairlines, borders, faint fills, placeholder media
--ap-color-accent       the one accent color
--ap-color-accent-ink   text/label color used *on top of* the accent fill
--ap-font-display       headings (currently Oswald)
--ap-font-script        the one cursive/overlap use (currently Italianno)
--ap-font-body          everything else (currently Work Sans)
--ap-font-mono          numbers/data only (system mono stack)
--ap-radius             corner radius (0 in this theme)
```

A theme-specific geometry token (like the old `--ap-cut` for cut
corners) is fine to add back if a future theme needs it — just name it
by what it controls, and remove it from this table when that theme is
retired so the table never lists a token the live theme doesn't use.

Never write a literal hex color or px radius directly on a component —
always go through a token, even if today only one theme exists.

## Current theme: `bloodline`

White / near-black / blood-red, flat (no gradients, no glow, no cut
corners — those belonged to the previous exploration, not this one).
Built directly from the site's real spec (`Website Notes.md` in the
vault root): a thin red-on-white header strip, a red transition strip,
and a blood-red accent used throughout as the one color beat. Display
type is Oswald, the overlapping cursive subtitle is Italianno, body
copy is Work Sans.

This is the theme actually implemented in `index.html` and the Jekyll
build under this folder — treat it as live, not a mockup.

## Theme history

- **`autotape-red`** (superseded) — an earlier exploration: near-black
  ground, terracotta-red accent, sharp/cut corners, a port of
  [1612elphi's Autotape Obsidian theme](https://github.com/1612elphi/autotape-theme).
  Built while testing visual directions before the real site spec was
  handed over; not used in the actual build. Kept here only so a future
  session doesn't reinvent it from scratch if it's ever wanted again.

If a new theme is ever built, name it the same way (short, memorable,
lowercase-hyphenated), move the current one into this history section,
and record the new one above — this file is meant to be the running
log of which theme is live and why, so a future session doesn't have
to reverse-engineer it from the CSS.

## Effects (`fx-`)

- `.fx-reveal` — generic scroll-triggered fade/rise-in (used by
  `scroll.js` via `IntersectionObserver`); visible by default so it
  degrades gracefully with JS off or `prefers-reduced-motion`.
- `.fx-grain` (not currently used in `bloodline`) — a fixed
  full-viewport noise texture from the `autotape-red` exploration.
  If it's ever wanted again: use `mix-blend-mode: screen`, not
  `overlay` — overlay crushes to black against a near-black background
  no matter the opacity.

## File layout (Jekyll)

```
Antiphonus 2.0/            ← repo root, served directly by GitHub Pages
  CNAME                    ← anti.sundog.rip
  STYLE-GUIDE.md        ← this file
  _config.yml
  Gemfile
  _layouts/
    default.html        ← page shell: gate + header + {{ content }}
  _includes/
    header.html
    gate.html            ← content-warning / load-bar / glitch overlay
  assets/
    css/style.css        ← tokens + components, single source for now
    js/
      gate.js             ← first-visit gate logic
      scroll.js            ← scroll-driven reveal/fade behavior
    img/
      README.md           ← expected image paths, until real art exists
  index.html               ← home page (all Home-page sections)
  characters/index.html    ← empty until that page is specified
  world/index.html         ← empty until that page is specified
  story/index.html         ← empty until that page is specified
```

As pages get built out, split `style.css` by component if it gets
unwieldy (`css/components/btn.css`, etc.), but keep the token block in
one place and keep every filename/class following the rules above.

Run locally with `bundle install` then `bundle exec jekyll serve` from
this folder's root.
