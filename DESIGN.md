---
name: Aura Finance
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#909097'
  outline-variant: '#45464d'
  surface-tint: '#bec6e0'
  primary: '#bec6e0'
  on-primary: '#283044'
  primary-container: '#0f172a'
  on-primary-container: '#798098'
  inverse-primary: '#565e74'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#3cddc7'
  on-tertiary: '#003731'
  tertiary-container: '#001c18'
  on-tertiary-container: '#009182'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#62fae3'
  tertiary-fixed-dim: '#3cddc7'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005047'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 32px
  gutter: 24px
  margin-sm: 16px
  margin-md: 32px
  margin-lg: 48px
---

## Brand & Style

This design system is built upon a high-end Glassmorphism aesthetic, tailored for a sophisticated fintech environment. The brand personality is precise, exclusive, and technologically advanced. It aims to evoke a sense of clarity amidst complex data, using transparency and depth to suggest an open and trustworthy financial ecosystem. 

The visual language rejects flat, opaque surfaces in favor of layered, semi-transparent materials that mimic frosted glass. This "layered intelligence" allows the user to maintain context of the overall dashboard while focusing on specific data modules. The atmosphere is calm and dark, utilizing deep tones to reduce cognitive load and highlight vibrant, meaningful data trends.

## Colors

The palette is anchored in a dark-mode-first philosophy. The primary foundation is a **Deep Navy**, providing a vast, stable canvas. **Soft Slate** acts as the secondary tone for structural elements and secondary containers. 

Interactive elements and positive growth indicators utilize a **Teal-to-Emerald gradient**, symbolizing prosperity and movement. Conversely, a **Soft Rose gradient** is reserved for negative trends or cautionary alerts, ensuring high visibility without feeling aggressive. 

Transparency is critical: surfaces should never be 100% opaque. Instead, use the `glass_background` with a backdrop filter to create the signature frosted effect. Borders must be subtle and semi-transparent to define edges without breaking the glass illusion.

## Typography

This design system utilizes **Hanken Grotesk** for its sharp, contemporary geometry and exceptional legibility in data-heavy environments. The typographic hierarchy is designed to be "airy," with generous line heights to offset the visual complexity of glass layers.

Large headlines (XL and LG) should be used sparingly for total portfolio balances or section headers. Labels are consistently uppercase with slight tracking to provide a technical, "instrument-panel" feel to the dashboard. For mobile, headline sizes scale down to ensure the glass cards remain the primary container without being overcrowded by text.

## Layout & Spacing

The layout follows a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile devices. The core spacing rhythm is based on an 8px base unit. 

Because of the glass aesthetic, negative space is a functional requirement. Cards must have a minimum gutter of 24px to allow the background blurs to "breathe" and maintain the illusion of depth. On desktop, the dashboard uses a fixed sidebar for navigation and a fluid main content area. On mobile, margins reduce to 16px, and cards stack vertically to maintain readability.

## Elevation & Depth

In this design system, elevation is not achieved through simple drop shadows, but through a combination of **Backdrop Blur (20px to 40px)** and **Inner Glows**. 

1.  **Level 1 (Surface):** The base background of the application (Deep Navy).
2.  **Level 2 (Cards):** Semi-transparent layers with a 1px solid border at 10% white. These sit "above" the surface with a soft, diffused shadow (Blur: 30px, Opacity: 20%, Color: Black).
3.  **Level 3 (Overlays/Modals):** Increased backdrop blur (60px) and a more prominent inner stroke to simulate a thicker piece of glass closer to the user.

Depth is further emphasized by placing subtle, out-of-focus accent blobs (Teal/Navy) in the background that move or shift slightly, visible only through the frosted containers.

## Shapes

The shape language is sophisticated and rounded. A base radius of **0.5rem (8px)** is used for small interactive elements like inputs and buttons. Larger containers and "Glass Cards" utilize **1rem (16px)** to soften the technical edge of the finance data. 

Avoid sharp 90-degree corners entirely; the roundedness is essential to maintaining the "organic" feel of the glass material. Circles are reserved for user avatars and status indicators only.

## Components

### Glass Cards
The primary container for all data. Must use `backdrop-filter: blur(20px)` and a subtle gradient fill (top-left to bottom-right) using white at 5% to 2% opacity.

### Buttons
- **Primary:** Uses the Teal-to-Emerald gradient with white text. High-contrast and no transparency to ensure clear CTA.
- **Secondary:** A glass-style button with a 1px white border (20% opacity) and no fill, becoming slightly more opaque on hover.

### Input Fields
Inputs should be treated as "etched" into the glass. Use a darker slate background with 40% opacity and a bottom-only or subtle all-around stroke. The focus state should illuminate the border with the primary teal color.

### Positive/Negative Chips
Small, pill-shaped indicators for percentage changes. Positive chips use a 10% teal background with solid teal text; negative chips use a 10% rose background with solid rose text.

### Charts & Data Visualization
Use thin, high-contrast lines for line charts. Areas under lines should use a subtle vertical gradient that fades to 0% opacity. Avoid heavy grid lines; use very faint dots or omit them entirely to let the glass background shine through.

### Navigation Sidebar
A vertical blur-surface that spans the full height of the viewport. Active states for navigation items should be marked by a vertical teal "light bar" on the left edge and a subtle increase in text brightness.