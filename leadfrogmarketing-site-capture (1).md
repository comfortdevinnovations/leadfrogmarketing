# Site Capture: leadfrogmarketing.com

Captured from a Jam.dev screen recording (71s, no audio/transcript). Source is a React app (component paths visible in DOM via `data-source-location` attributes — appears to be built with a React framework using Tailwind CSS utility classes). Use this as reference material for a future rebuild prompt (e.g. in Next.js).

---

## Stack / conventions observed
- **Framework**: React (JSX component files, e.g. `src/components/pages/HomePage.tsx`, `src/components/pages/ServicesPage.tsx`, `src/components/pages/ContactPage.tsx`)
- **Styling**: Tailwind CSS utility classes throughout
- **Routing**: Client-side navigation between `/`, `/services`, `/contact` (uses `data-discover="true"` on links, consistent with a framework like React Router / Remix-style routing)
- **Font/heading conventions**: custom Tailwind theme tokens — `font-paragraph`, `font-heading`, `text-primary`, `text-secondary`, `text-secondary-foreground`, `bg-secondary`, `border-secondary-foreground`

---

## Page 1 — Home (`/`)

**Hero section**
- Large italic display heading: "Accelerated Growth"
  - Classes: `font-paragraph italic text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] text-primary mb-8 md:mb-12`
  - Very large, responsive type scale (6xl → 8xl → 9rem across breakpoints)
- Background/embedded video on the hero
- Highlighted phrase "Trusted Partner" with a highlight-style background: `span.bg-secondary.px-3` (colored block behind text, common "highlighter" effect)

**"Proven Results, Trusted Partner" section**
- Key stat callouts:
  - **$210M** — Lead Value Created
  - **98%** — Client Retention

**"Our Expertise" section**
- Three-item numbered list of services:
  1. Lead Generation
  2. Digital Strategy
  3. Analytics

**"Why Partner with Lead Frog?" section**
- Present below Expertise, content not fully itemized in the capture (scrolled past)

---

## Page 2 — Services (`/services`)

Source file: `src/components/pages/ServicesPage.tsx`

List of five services, each with its own description block:
1. SEO & Content Marketing
2. Paid Advertising (PPC)
3. Social Media Marketing
4. Email Marketing Automation
5. Lead Nurturing & CRM Integration

**CTA button** at bottom of page:
- Text: "Contact Us Today"
- Classes: `inline-flex items-center gap-2 font-heading uppercase text-sm tracking-wider text-secondary-foreground border-2 border-secondary-foreground px-8 py-4 hover:bg-secondary-foreground hover:text-primary-foreground transition-colors`
- Style: outlined button, uppercase small tracked label, inverts fill/text color on hover
- Links to `/contact`

---

## Page 3 — Contact (`/contact`)

Source file: `src/components/pages/ContactPage.tsx`

**Form fields observed:**
- "Your Name" — `input[name="your_name"]`, placeholder "John Doe"
  - Classes: `bg-white border-2 border-secondary-foreground focus:border-secondary px-4 py-3 rounded-lg w-full`
- "Email Address" — `input[name="email"]`, placeholder "john@company.com"
  - Same input styling as above (rounded, bordered, white bg, border color shifts on focus)
- Additional fields likely present below the fold (not captured — recording ended mid-form)

**Layout wrapper**: `section.w-full.max-w-[120rem].mx-auto.pt-32.pb-24.px-8` — full-width section, very wide max container (120rem), generous vertical padding

---

## Gaps / not captured
- Footer content (not scrolled to)
- "Why Partner with Lead Frog?" full content
- Full contact form (only first 2 of likely more fields seen)
- No color hex values — only Tailwind semantic tokens (`primary`, `secondary`, `secondary-foreground`) are visible; actual theme colors would need to be pulled from the site's Tailwind config or inspected directly
- No mobile/responsive behavior captured beyond the responsive text scale on the H1

---

## Design Language Proposal — "Crown Glass"

A hybrid of **liquid glass** (translucent, refractive, blurred panels — evokes a pond surface and ties to the "crown" pun on optical crown glass) for structural/hero elements, and **claymorphism** (soft, rounded, tactile, slightly puffy) for the mascot-driven icons and small UI — balancing the site's need to feel credible/premium (glass) with cozy/playful (clay).

### Signature interaction concepts
- **Scroll-linked frog**: a small crowned-frog icon rides down a dotted "lily pad trail" fixed to the viewport edge as the user scrolls, acting as a scroll-progress indicator. It visibly "hops" between pads rather than sliding smoothly (spring/overshoot easing).
- **Crown that dissolves into ripple**: on the hero, the crown atop "Accelerated Growth" catches light like glass; as the user starts scrolling, it dissolves into a subtle pond-ripple SVG that trails down the page as a recurring section divider motif.
- **Page-transition leap**: navigating between Home → Services → Contact, the outgoing page's content leaps off-screen (frog-hop arc + squash/stretch) while the incoming page ripples in as if landing in water.
- **Cursor ripple (desktop)**: clicks/taps emit a soft expanding ripple ring at the cursor, reinforcing the water motif without being overdone.

### Section-by-section treatment

**Home — Hero**
- Hero video sits inside a glass-panel frame: backdrop-blur, faint green/gold gradient tint, 1px light-catching edge (glass rim highlight).
- "Accelerated Growth" H1 keeps its current huge italic scale; crown glyph rendered in a metallic gold gradient with a subtle glass-glint sweep on load.
- "Trusted Partner" highlight (`bg-secondary` block) becomes a soft clay-pill behind the text — slightly puffy, subtle inner shadow — rather than a flat highlighter block.

**Home — Proven Results ($210M / 98%)**
- Each stat becomes a glass "droplet" callout: rounded card, backdrop-blur, faint condensation-drip detail along the bottom edge.
- Numbers count up on scroll-into-view; a thin liquid-fill bar animates behind the percentage stat.

**Home — Our Expertise (3 items)**
- Each of the 3 items (Lead Generation / Digital Strategy / Analytics) becomes a clay-rendered icon tile: soft rounded square, puffy 3D icon, subtle press-down animation on hover/click like a tactile button.
- Items bounce-in staggered on scroll (small hop, not a fade).

**Home — Why Partner with Lead Frog?**
- Use the crowned-frog mark as a large, very low-opacity watermark behind this section's copy — reinforces brand without competing with text.

**Services page (5 services)**
- Each service card becomes a "lily pad": irregular soft-rounded shape (not a plain rectangle), gently bobbing (slow idle float animation), arranged in a loose asymmetric cluster rather than a rigid grid — like pads scattered on a pond.
- Hover triggers a ripple that emanates outward from the card.
- "Contact Us Today" CTA: outlined button gets a light-glint sweep across it on hover (glass catching light) plus a small ripple burst on click.

**Contact page**
- Form sits inside a glass card floating over a very softly blurred green/gold pond-gradient background.
- Input focus state: instead of a plain border-color change, a thin ripple ring pulses outward from the focused field once.
- Submit button: on click, plays a quick frog-hop micro-animation; success state brings the crown down onto the frog's head with a small sparkle/glint — a literal "you've reached royalty" payoff.

### Palette to pair with this direction
- Primary: deep forest green (from mark)
- Accent: warm gold/amber gradient (from crown)
- Base: warm cream/off-white (not stark white) for glass panels to sit on
- Glass surfaces: 8–16% white/green tint + backdrop-blur, 1px semi-transparent light border for the "rim" catch-light effect
- Clay elements: same green/gold palette but flattened to solid fills with soft dual shadows (light top-left, soft dark bottom-right) for the puffy 3D feel
