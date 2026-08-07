# Physical AI & Robotics Lab — Galgotias University

Landing page for the Physical AI & Robotics Lab at Galgotias University: one of the country's most significant institutional commitments to Physical AI education and research.

Built with Next.js 16 (App Router, Turbopack), Tailwind CSS v4, TypeScript, [Motion](https://motion.dev) and [Lenis](https://lenis.darkroom.engineering/) smooth scroll. Design system inspired by scale.com/physical-ai — light base, inset rounded black canvases, light-weight display type, mono eyebrows, pill buttons.

## The design

- **Type** — Archivo (bold display, 700–900), Hanken Grotesk (body), Geist Mono (eyebrows, telemetry, ledger).
- **Palette** — strict monochrome: off-white `#fafafa`, near-black canvas `#121316`, white `#f5f5f4`, grey `#6b7076`. Accents are black-on-light / white-on-dark — no color. (Token names `forest`/`cream`/`ivory` are historical; values are neutral.)
- **Imagery** — hero: exploded open-source humanoid blueprint (`public/humanoid-diagram.png`); DGX card: NVIDIA HGX H200 8-GPU baseboard (`public/hgx-h200.png`), both background-removed via Pillow (luminance→alpha for line art, border-connected flood masking for the product shot).
- **Signature** — the hero's full-bleed exploded-humanoid blueprint (`public/humanoid-diagram.png`): background removed and linework recolored to cream via Pillow (see git history / regenerate with any dark-lines-on-light source), masked so the text side stays calm, with subtle scroll parallax. The earlier cursor-chasing IK arm still lives in `components/RobotArm.tsx` (currently unused) if you ever want it back.
- **Scroll animation** — `components/anim.tsx`: Scale-style word-by-word headline reveals (`WordReveal`), staggered fade-ups, count-up stats, hero parallax, and a progress rail that fills as you scroll the stack section. `components/SmoothScroll.tsx` runs Lenis. All of it respects `prefers-reduced-motion`.
- **Navbar / footer** — official Galgotias University logo (`public/galgotias-logo.png`, white-text version fetched from galgotiasuniversity.edu.in) on a forest brand bar.

## Gotcha worth remembering

`whileInView` on an element that starts fully translated inside an `overflow-hidden` clip never fires — a fully clipped element never intersects. `WordReveal` therefore observes the un-clipped wrapper (`useInView`) and animates the words from there.

## Develop

```bash
npm install
npm run dev
```

## To wire up

- No contact email is published by design — CTAs point at galgotiasuniversity.edu.in; add a lab email/form later if wanted.
- Footer X/GitHub links are placeholders (`#`).
- Equipment values/statuses live in the `LABS` array in `app/page.tsx` (rendered by `components/LabCard.tsx`); the DGX flagship card is in `Labs()`.
