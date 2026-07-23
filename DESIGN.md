---
name: Vibrant Neon
colors:
  surface: '#0c0c21'
  surface-dim: '#0c0c21'
  surface-bright: '#292949'
  surface-container-lowest: '#000000'
  surface-container-low: '#111128'
  surface-container: '#171730'
  surface-container-high: '#1d1d38'
  surface-container-highest: '#232341'
  on-surface: '#e5e3ff'
  on-surface-variant: '#aaa8c4'
  inverse-surface: '#fcf8ff'
  inverse-on-surface: '#53536b'
  outline: '#74738d'
  outline-variant: '#46465d'
  surface-tint: '#ff8aa5'
  primary: '#ff8aa5'
  on-primary: '#620027'
  primary-container: '#ff7195'
  on-primary-container: '#4d001d'
  inverse-primary: '#bd0052'
  secondary: '#00fcca'
  on-secondary: '#005b47'
  secondary-container: '#006b54'
  on-secondary-container: '#dffff1'
  tertiary: '#ffeeab'
  on-tertiary: '#675800'
  tertiary-container: '#fedf49'
  on-tertiary-container: '#5e4f00'
  error: '#ff716c'
  on-error: '#490006'
  error-container: '#9f0519'
  on-error-container: '#ffa8a3'
  primary-fixed: '#ff7195'
  primary-fixed-dim: '#ff5486'
  on-primary-fixed: '#000000'
  on-primary-fixed-variant: '#5e0025'
  secondary-fixed: '#00fcca'
  secondary-fixed-dim: '#00edbd'
  on-secondary-fixed: '#004737'
  on-secondary-fixed-variant: '#006650'
  tertiary-fixed: '#fedf49'
  tertiary-fixed-dim: '#efd13b'
  on-tertiary-fixed: '#483d00'
  on-tertiary-fixed-variant: '#695900'
  primary-dim: '#e40a65'
  secondary-dim: '#00edbd'
  tertiary-dim: '#efd13b'
  error-dim: '#d7383b'
  background: '#0c0c21'
  on-background: '#e5e3ff'
  surface-variant: '#232341'
typography:
  headline-lg:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

# Design System: Vibrant Neon

## Brand & Style
The brand identity has shifted toward a high-energy, "Vibrant" aesthetic. It evokes a sense of digital-first excitement, precision, and modernity. By moving to a dark color mode with high-saturation accents, the UI should feel like a premium, neon-infused dashboard. The target audience is tech-forward users who value bold, high-contrast interfaces and a distinct, futuristic personality.

The style is a blend of **High-Contrast / Bold** and **Cyber-Modern**. It utilizes deep neutral backgrounds to make vibrant primary and secondary colors pop, creating a clear visual hierarchy through luminosity rather than traditional shading.

## Colors
The palette is built on a "Dark" foundation to maximize the impact of the "Vibrant" accent colors. 

- **Primary (#ff2d78):** A high-octane pink used for primary actions, branding, and critical highlights.
- **Secondary (#00ffcc):** A bright teal/cyan used for supporting information, success states, and secondary interactive elements.
- **Tertiary (#ffe04a):** A luminous yellow for warnings, accents, or specialized features.
- **Neutral (#28283e):** A deep, saturated navy-charcoal that serves as the base for all surfaces, ensuring high contrast with the neon accents.

## Typography
The typography strategy uses three distinct fonts to create a technical yet approachable feel.

- **Headlines (Sora):** A geometric sans-serif with a modern flair, used for bold, impactful headers.
- **Body (Inter):** A highly legible sans-serif designed for screen readability, used for all long-form content and UI text.
- **Labels (Space Grotesk):** A quirky, monospaced-adjacent sans-serif used for buttons, metadata, and technical labels to reinforce the "Vibrant/Cyber" aesthetic.

## Layout & Spacing
The system uses a fluid grid with a base 8px spacing rhythm. Layouts should feel organized and spacious to balance the intensity of the colors. 

Margins and gutters are standardized at 24px and 16px respectively on desktop, scaling down for mobile devices. Content blocks should rely on consistent padding (typically 16px or 24px) to maintain a rhythmic vertical flow.

## Elevation & Depth
In this dark, vibrant theme, depth is achieved through **Tonal Layers** and **Luminous Outlines**. Because shadows are less visible on dark backgrounds, surfaces "lift" by becoming slightly lighter in color. 

High-priority elements (like active cards or buttons) may use a subtle outer glow or a 1px solid border using the primary or secondary colors to simulate light emission.

## Shapes
The shape language is "Soft," featuring a subtle 4px (0.25rem) corner radius for standard UI components. This provides a clean, modern look that is more approachable than sharp corners but more structured and professional than fully rounded/pill-shaped elements.

## Components
- **Buttons:** Primary buttons use the Primary Pink (#ff2d78) with white or high-contrast dark text. Use the Space Grotesk font for labels.
- **Cards:** Use the Neutral color (#28283e) as the base, with a 1px border that is slightly lighter than the background or accented with a secondary color when hovered.
- **Inputs:** Dark backgrounds with subtle borders; the border changes to Secondary Teal (#00ffcc) on focus.
- **Chips:** High-contrast background with Space Grotesk labels, used for tags and status indicators.