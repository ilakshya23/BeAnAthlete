# Be An Athlete

Strength & conditioning coaching website for Hitesh Sharma (CSCS), built with:

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** — yellow / black / white theme
- **Framer Motion** — page transitions, hover/tap micro-interactions, scroll-reveal stagger
- **GSAP + ScrollTrigger** — kinetic headline reveal, marquee ticker, scroll-triggered reveals
- **Locomotive Scroll** — smooth/inertia scrolling, bridged to GSAP ScrollTrigger

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Add your media

The site references a few media files that aren't included (so you can drop in your own):

```
public/videos/hero-bg.mp4      -> looping hero background video
public/videos/feature.mp4      -> the "Inside the Program" playable video
public/images/hero-poster.jpg  -> hero video poster/fallback frame
public/images/coach.jpg        -> portrait used in the About section
public/images/video-poster.jpg -> poster for the feature video
```

Until you add these, the layout still renders correctly — the video/image areas
will just be empty/transparent.

## Fonts

Fonts (Anton for display headlines, Work Sans for body text) are loaded via a
Google Fonts `<link>` tag in `app/layout.tsx` rather than `next/font`, so no
network access is required at build time — only at runtime in the browser.

## Admin panel

The website content can be managed at `admin.beanathlete.in`. The admin panel
supports the home hero, About Us, feature video, full program CRUD and ordering,
Get In Touch details, media uploads, and password changes.

Production requires these Vercel resources and variables:

- Neon Postgres connected through the Vercel Marketplace (`DATABASE_URL`)
- A public Vercel Blob store (`BLOB_READ_WRITE_TOKEN`)
- `ADMIN_INITIAL_USERNAME` and `ADMIN_INITIAL_PASSWORD` for first-time setup
- A random `ADMIN_AUTH_SECRET` of at least 32 characters

The initial password is used only when the database has no administrator. Once
the account exists, password changes are stored securely as salted scrypt hashes
in Postgres. Admin sessions are signed, HTTP-only, and invalidated after a
password change.

Both `beanathlete.in` and `admin.beanathlete.in` should be attached to the same
Vercel project. The proxy routes the admin subdomain to the protected editor.

## Adding more Programs

The bundled defaults live in `lib/programs.ts`. Once Neon is connected, use the
Programs section of the admin panel to add, edit, delete, or reorder programs.

```ts
{
  id: "strength-block",
  number: "03",
  title: "Strength Block",
  description: "Short description of the program...",
  href: "/programs/strength-block",
}
```

The grid on the homepage and the dynamic detail page at
`/programs/[slug]` both read from this file automatically — no other
changes needed as you grow from 2 up to 10 programs.

## Structure

```
app/
  layout.tsx          Root layout, fonts, header, smooth scroll wrapper
  page.tsx            Home page (assembles all sections)
  globals.css         Tailwind layers + Locomotive Scroll base styles
  programs/[slug]/     Dynamic program detail pages
components/
  Header.tsx           Fixed nav with mobile menu
  Hero.tsx             Looping video hero + GSAP split-text headline
  Marquee.tsx          Infinite GSAP ticker ("Stronger · Faster · ...")
  About.tsx            Coach bio, scroll-triggered reveal
  VideoFeature.tsx     Standalone playable video block
  Programs.tsx         Expandable programs grid (reads lib/programs.ts)
  Contact.tsx          Contact form + details
  Footer.tsx           Footer with newsletter signup
  SmoothScroll.tsx     Locomotive Scroll <-> GSAP ScrollTrigger bridge
  PageTransition.tsx   Framer Motion route transition (yellow wipe)
lib/
  programs.ts          Single source of truth for all program cards
```

## Wiring up the contact form

`Contact.tsx` and the footer newsletter form currently just show a success
state client-side. Connect the `handleSubmit` functions to your email
service of choice (Formspree, Resend, an API route, etc.) when ready.

## Notes on Locomotive Scroll

Locomotive Scroll v4 is initialized in `components/SmoothScroll.tsx` and
disabled automatically on phones/tablets (`smartphone`/`tablet` options) for
better native-feel scrolling on touch devices, while GSAP ScrollTrigger stays
in sync with it via `ScrollTrigger.scrollerProxy`.
