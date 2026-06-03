# Design System Inspired by Splatoon 3

## 1. Visual Theme & Atmosphere

The Splatoon 3 design system embodies vibrant chaos with youthful energy and playful rebellion. It blends bold, contrasting neon colors—electric yellows, cyans, and magentas—against deep blacks and pure whites, creating a high-contrast, dynamic visual language. The aesthetic is deliberately irreverent: splatter effects, angular geometric accents, and unconventional layouts mirror the ink-splatting core of the game. This system celebrates expressive color blocking, experimental typography mixing, and an almost chaotic-yet-intentional layout structure that feels native to youth culture and digital gaming. The atmosphere is forward-thinking, inclusive, and unapologetically bold—every element demands attention.

**Key Characteristics**
- High-contrast color palette (neons against deep neutrals)
- Playful splatter and organic shape motifs
- Angular and geometric accent elements
- Mix of bold, sans-serif typography with varying weights
- Energetic, youth-oriented visual language
- Dynamic depth through layering and perspective
- Intentionally unconventional layout and composition

## 2. Color Palette & Roles

### Primary
- **Neon Blue** (`#0000EE`): Primary call-to-action buttons, hyperlinks, core interactive elements; dominant brand color
- **Deep Blue** (`#0066FF`): Alternative primary accent for depth variation and secondary CTAs

### Accent Colors
- **Electric Purple** (`#603BFF`): Secondary accent for highlights, featured content, and emphasis layers
- **Vibrant Magenta** (`#AF50FF`): Tertiary accent for interactive states and decorative splatter effects
- **Neon Cyan** (`#6AF7CE`): Accent for play buttons, special interactive controls, and positive feedback
- **Coral Orange** (`#FF9750`): Warm accent for secondary actions, warnings, and decorative elements
- **Deep Orange** (`#FA5A00`): Darker orange accent for emphasis and contrast against light backgrounds

### Interactive
- **Bright Red** (`#E60012`): Error states, critical alerts, and destructive actions
- **Lime Yellow** (`#EAFF3D`): Warning states, caution indicators, and attention-grabbing UI elements
- **Electric Red-Pink** (`#FF505E`): Hover states, active buttons, and interactive feedback

### Neutral Scale
- **Pure White** (`#FFFFFF`): Primary text color, backgrounds, high-contrast overlays
- **Deep Black** (`#0D0D0D`): Primary background, dominant dark surface, main text on light backgrounds
- **True Black** (`#000000`): Maximum contrast text, shadow elements, component outlines
- **Almost Black** (`#0E0E0E`): Subtle variation of deep black for layering
- **Neutral Gray** (`#6A6A71`): Secondary text, disabled states, subtle UI elements
- **Light Gray** (`#E0E0E0`, `#DFDFDF`, `#CCCCCC`): Borders, dividers, input field borders

### Surface & Borders
- **Border Gray** (`#D1D1D1`): Input field borders, subtle dividers between sections
- **Disabled Gray** (`#CCCCCC`): Inactive component borders and disabled state backgrounds

### Semantic / Status
- **Warning** (`#EAFF3D`): Caution, warnings, notice states
- **Error** (`#E60012`): Critical errors, destructive confirmations, danger zones

## 3. Typography Rules

### Font Family
**Primary: obviously-narrow**
Fallback: `Arial, sans-serif`
Used for headings and bold display text; compressed, geometric, and commanding.

**Secondary: Montserrat**
Fallback: `'Trebuchet MS', sans-serif`
Used for body text, labels, and standard UI copy; clean, modern, and highly legible.

**Tertiary: Helvetica Neue**
Fallback: `Helvetica, Arial, sans-serif`
Used for small UI elements, captions, and utility text; neutral and professional.

**Display: fooregular**
Fallback: `Arial, sans-serif`
Used for dramatic hero headings; bold and impactful.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / H1 | fooregular | 80px | 500 | 80px | 0px | Hero titles, maximum visual impact |
| Heading / H2 | obviously-narrow | 37px | 600 | 37px | 0px | Section headings, page titles |
| Subheading / H3 | obviously-narrow | 24px | 600 | 32px | 0px | Content subsections, callouts |
| Heading / H4 | obviously-narrow | 14px | 600 | 19.6px | 0px | Card titles, minor headings |
| Body Large | Montserrat | 20px | 500 | 32px | 0px | Primary body text, descriptions |
| Body Standard | Montserrat | 16px | 400 | 24px | 0px | Standard UI text, list items |
| Label | Montserrat | 16px | 600 | 24px | 0px | Form labels, button text inside buttons |
| Input | Montserrat | 16px | 400 | 24px | 0px | Form input placeholder and text |
| Caption / Small | Helvetica Neue | 12.5px | 400 | 18.75px | 0px | Captions, metadata, secondary info |
| Micro / UI | Helvetica Neue | 10px | 400 | 15px | 0px | Button labels, tiny UI elements, hints |

### Principles
- **Contrast Over Subtlety**: Use bold weight and size variations to create clear hierarchy; do not rely on opacity alone
- **Geometric Precision**: Stick to the obviously-narrow typeface for headers; it commands attention through form, not decoration
- **Legibility at Scale**: All body text uses Montserrat for consistent readability; never drop below 16px for input or standard body copy
- **Neon Typography**: Pair electric colors with bold fonts; black backgrounds amplify the vibrancy of white and neon text
- **Compact Spacing**: Line heights track closely to type size to reinforce bold, energetic rhythm
- **Weight Discipline**: Stick to 400, 500, and 600 weights; avoid lighter weights on small text

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background**: `rgba(0, 0, 0, 0)` (transparent)
- **Text Color**: `#FFFFFF`
- **Font**: obviously-narrow, 16px, weight 600
- **Padding**: `12px 16px`
- **Border Radius**: `0px`
- **Border**: `0px none`
- **Height**: `40px`
- **Line Height**: `16px`
- **Hover State**: Background `#0000EE`, text `#FFFFFF`
- **Active State**: Background `#603BFF`, text `#FFFFFF`
- **Disabled State**: Background `rgba(0, 0, 0, 0)`, text `#CCCCCC`

#### Secondary Button (Accent Variations)
- **Background**: `rgba(0, 0, 0, 0)`
- **Text Color**: `#FFFFFF`
- **Font**: obviously-narrow, 16px, weight 600
- **Padding**: `12px 24px`
- **Border Radius**: `17px`
- **Border**: `2px solid` (color varies by accent: `#603BFF`, `#AF50FF`, or `#6AF7CE`)
- **Height**: `auto`
- **Line Height**: `16px`
- **Hover State**: Background matches border color with 20% opacity, text `#FFFFFF`

#### Circular Button (Icon/Control)
- **Background**: `rgba(0, 0, 0, 0)`
- **Text Color**: `#FFFFFF`
- **Font**: obviously-narrow, 16px, weight 600
- **Padding**: `0px`
- **Border Radius**: `50%`
- **Border**: `2px solid #EAFF3D`
- **Height**: `13px`
- **Width**: `13px`
- **Line Height**: `16px`
- **Hover State**: Border color `#FF9750`, scale 1.1
- **Active State**: Background `#EAFF3D`, text `#0D0D0D`

#### Micro Button (Text/Link Style)
- **Background**: `rgba(0, 0, 0, 0)`
- **Text Color**: `#FFFFFF` or `#0000EE` (context dependent)
- **Font**: Helvetica Neue, 10px, weight 400
- **Padding**: `0px`
- **Border Radius**: `0px`
- **Border**: `0px none`
- **Height**: `auto`
- **Width**: `auto`
- **Line Height**: `15px`
- **Hover State**: Text opacity 0.8, underline `1px solid`
- **Active State**: Text opacity 1, text decoration underline

### Cards & Containers

#### Full-Width Card (Hero/Feature)
- **Background**: `rgba(0, 0, 0, 0)` (transparent, image background)
- **Text Color**: `#FFFFFF`
- **Font**: Montserrat, 20px, weight 500
- **Padding**: `0px 12px`
- **Border Radius**: `0px`
- **Border**: `0px none`
- **Height**: `503px` to `585px`
- **Width**: `1440px` (full container)
- **Line Height**: `32px`
- **Overlay**: Semi-transparent dark (`rgba(0, 0, 0, 0.4)`) for text readability over images

#### Content Card (Mid-Size)
- **Background**: `rgba(0, 0, 0, 0)`
- **Text Color**: `#FFFFFF`
- **Font**: Montserrat, 20px, weight 500
- **Padding**: `0px 12px`
- **Border Radius**: `0px`
- **Border**: `0px none`
- **Height**: `504px`
- **Width**: `590px`
- **Line Height**: `32px`
- **Shadow**: None (flat design)
- **Border Accent**: Optional 2px top/left border in accent color (`#EAFF3D` or `#6AF7CE`)

### Inputs & Forms

#### Text Input (Default)
- **Background**: `#FFFFFF`
- **Text Color**: `#0D0D0D`
- **Font**: Montserrat, 16px, weight 400
- **Padding**: `6px 35px 6px 15px`
- **Border Radius**: `50px`
- **Border**: `1px solid #D1D1D1`
- **Height**: `31px`
- **Width**: `100%`
- **Line Height**: `24px`
- **Placeholder Color**: `#6A6A71`
- **Focus State**: Border color `#0000EE`, box-shadow `0 0 0 3px rgba(0, 0, 238, 0.1)`
- **Error State**: Border color `#E60012`, background `rgba(230, 0, 18, 0.05)`
- **Disabled State**: Background `#E0E0E0`, text color `#CCCCCC`, border color `#CCCCCC`

#### Form Label
- **Text Color**: `#FFFFFF` or `#0D0D0D` (context dependent)
- **Font**: Montserrat, 16px, weight 600
- **Padding**: `0px 0px 8px 0px`
- **Line Height**: `24px`

### Navigation

#### Top Navigation Element
- **Background**: `rgba(0, 0, 0, 0)` or `#0D0D0D` (context dependent)
- **Text Color**: `#0D0D0D` or `#FFFFFF`
- **Font**: Helvetica Neue, 12.5px, weight 400
- **Padding**: `16px 0px`
- **Border Radius**: `0px`
- **Border**: `0px none`
- **Height**: `19px`
- **Line Height**: `18.75px`
- **Hover State**: Text color shifts to primary accent `#0000EE` or `#FFFFFF` with 0.8 opacity
- **Active State**: Border-bottom `2px solid #EAFF3D`, text color `#FFFFFF`

#### Menu Item (Icon + Label)
- **Background**: `rgba(0, 0, 0, 0)`
- **Text Color**: `#FFFFFF`
- **Font**: Montserrat, 16px, weight 500
- **Padding**: `12px 16px`
- **Border Radius**: `2px`
- **Border**: `0px none`
- **Hover State**: Background `rgba(255, 255, 255, 0.1)`, text color `#EAFF3D`
- **Active State**: Background `#0000EE`, text color `#FFFFFF`

### Links

#### Inline Link (Body)
- **Text Color**: `#0000EE`
- **Font**: Montserrat, 20px, weight 500
- **Background**: `rgba(0, 0, 0, 0)`
- **Padding**: `0px`
- **Border Radius**: `0px`
- **Border**: `0px none`
- **Text Decoration**: `none`
- **Line Height**: `32px`
- **Hover State**: Text decoration `underline`, color `#603BFF`
- **Active State**: Color `#0066FF`, text decoration `underline`
- **Visited State**: Color `#603BFF`

#### CTA Link (White on Dark)
- **Text Color**: `#FFFFFF`
- **Font**: obviously-narrow, 16px, weight 600
- **Background**: `rgba(0, 0, 0, 0)`
- **Padding**: `0px`
- **Border Radius**: `0px`
- **Border**: `0px none`
- **Text Decoration**: `none`
- **Line Height**: `25.6px`
- **Hover State**: Text color `#EAFF3D`, text decoration `underline`
- **Active State**: Text color `#6AF7CE`, text decoration `underline`

## 5. Layout Principles

### Spacing System
**Base Unit**: `4px`

**Scale**:
- `4px` — Micro spacing (button icon gaps, tight component padding)
- `8px` — Compact spacing (small component padding, internal gaps)
- `12px` — Standard spacing (form field padding, card internal spacing)
- `16px` — Default margin (section spacing, link padding, navigation items)
- `20px` — Generous padding (container internal space, section headers)
- `24px` — Large spacing (prominent section dividers, card padding)
- `28px` — Extra-large spacing (between major content blocks)
- `32px` — Substantial spacing (hero section padding, major layout divisions)
- `40px` — Large margin (between distinct sections)
- `48px` — Extra spacing (footer, major breaks)
- `56px` — Hero spacing (top-level section separation)
- `64px` — Maximum spacing (full-width container padding, major visual breaks)

**Usage Context**:
- Buttons and controls: `4px`–`16px` internal padding
- Form fields: `12px` vertical, `16px` horizontal
- Cards: `16px`–`32px` padding
- Section margins: `32px`–`64px`
- Page top/bottom padding: `56px`–`64px`

### Grid & Container
**Max Width**: `1440px` (full container width for desktop layouts)

**Column Strategy**:
- Desktop: 12-column grid with `16px` gutters
- Tablet: 8-column grid with `12px` gutters
- Mobile: Single-column or 4-column grid with `8px` gutters

**Section Patterns**:
- Full-width hero sections spanning the entire viewport width with `1440px` content container
- Two-column layouts for feature sections (main content left, secondary right; reversed on mobile)
- Modular card grids with 2–4 items per row (responsive)
- Sticky navigation with `0px` top margin, `16px` padding

### Whitespace Philosophy
Splatoon 3's design embraces **aggressive negative space** paired with dense content blocks. Use generous margins between major sections (`32px`–`64px`) to let high-contrast, playful visuals breathe. Within cards and components, compress spacing (`12px`–`16px`) to reinforce grouping. Never center-align large blocks of body text; use left alignment for legibility. Balance dense ink splatter and angular graphics with clean white space around CTAs and navigation.

### Border Radius Scale
- `0px` — Sharp corners for buttons, cards, inputs (default; maintains geometric aesthetic)
- `2px` — Subtle rounding for menu items, micro-interactions
- `17px` — Moderate rounding for secondary buttons, badges
- `50px` — Full rounding for pill-shaped inputs, circular avatars
- `50%` — Perfect circles for icon buttons, control elements

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base | No shadow; flat surface | Default buttons, cards, navigation, surfaces |
| Raised | `0 2px 8px rgba(0, 0, 0, 0.15)` | Hovered cards, lifted buttons on hover |
| Floating | `0 4px 16px rgba(0, 0, 0, 0.25)` | Modal overlays, dropdown menus, popovers |
| Overlay | `0 8px 32px rgba(0, 0, 0, 0.4)` | Full-page modals, heavy overlays, dialog boxes |
| Extreme | `0 16px 48px rgba(0, 0, 0, 0.5)` | Top-level alerts, critical modals, splash screens |

**Shadow Philosophy**:
Splatoon 3 prioritizes flat design and bold color contrast over dimensional shadows. Shadows are minimal and used sparingly for interactive feedback and layering clarity. When shadows appear, they are soft and dark (`rgba(0, 0, 0, 0.15)` to `0.5)`) rather than sharp. Avoid long blur radii; keep shadows compact and direct. The visual depth primarily comes from color layering and z-index stacking, not shadow rendering.

## 7. Do's and Don'ts

### Do
- **Use high contrast**: Pair neon colors (`#EAFF3D`, `#6AF7CE`) against deep blacks (`#0D0D0D`, `#000000`) for maximum legibility and visual punch
- **Embrace angular geometry**: Use sharp `0px` border-radius for buttons and cards to reinforce the angular, modern aesthetic
- **Mix typography boldly**: Combine obviously-narrow headers with Montserrat body text for dynamic hierarchy
- **Layer colors intentionally**: Stack multiple accent colors in buttons, splatter effects, and UI elements for playful complexity
- **Maintain high readability**: Ensure all body text is at least `16px` on light backgrounds; use `#FFFFFF` text on dark backgrounds
- **Apply icon treatments**: Use Neon Cyan (`#6AF7CE`) for play buttons and interactive controls; it reads instantly
- **Maximize white space**: Give hero images and splatter effects room to breathe with generous padding (`32px`–`64px`)
- **Test on dark backgrounds**: Default is dark UI; ensure all colors and fonts are legible on `#0D0D0D` and `#000000` backgrounds

### Don't
- **Avoid muted colors**: Do not use pale grays or de-saturated palettes; Splatoon 3 is vibrant and unapologetic
- **Do not soften corners**: Skip rounded corners on primary UI elements; the flat, sharp aesthetic is core to the brand
- **Avoid nested drop shadows**: Do not layer multiple shadows; keep elevation simple and direct
- **Do not mix serif fonts**: Stay with sans-serif typefaces; geometric and modern sensibility is paramount
- **Avoid low-contrast text**: Never use `#6A6A71` (gray) text on light gray backgrounds; always contrast against deep blacks or whites
- **Do not justify body text**: Maintain left alignment for all body copy; justified text reads as rigid and corporate, contrary to the playful energy
- **Avoid overuse of white text**: Do not apply white text on light backgrounds; ensure strong color separation
- **Do not exceed the color palette**: Stick to the 18 documented colors; introducing new hues breaks visual cohesion
- **Avoid centering large CTA buttons**: Buttons should align naturally within grid or flow; centered buttons disrupt dynamic composition

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | 320px–479px | Single-column layout, `8px` gutters, full-width cards, 80% max-width for content |
| Small Tablet | 480px–767px | 4-column grid, `12px` gutters, card stacking, 90% max-width |
| Tablet | 768px–1023px | 8-column grid, `16px` gutters, 2-column card layouts, full-width hero sections |
| Desktop | 1024px–1439px | 12-column grid, `16px` gutters, multi-column layouts, `1440px` max-width containers |
| Large Desktop | 1440px+ | Full `1440px` width with centered alignment, extended spacing |

### Touch Targets
- **Minimum interactive height**: `44px` (for touch on mobile; derived from button variants)
- **Minimum interactive width**: `44px`
- **Padding around clickable elements**: `8px` minimum margin between adjacent buttons or links
- **Text link underline**: Add underline on mobile hover states for clarity
- **Form input height**: `31px` minimum on all devices (current extraction); increase to `44px` on mobile for comfortable tapping

### Collapsing Strategy
- **Hero sections**: Reduce height from `585px` to `300px` on tablet; `240px` on mobile
- **Card width**: Full-width (`100%`) on mobile and small tablet; 2-up grid on tablet; revert to `590px` on desktop
- **Typography scale**: Reduce H1 from `80px` to `48px` on tablet, `32px` on mobile; maintain Montserrat body at `16px` minimum
- **Navigation**: Convert horizontal navigation to hamburger menu on mobile (breakpoint: `768px`); show full menu on desktop
- **Padding**: Reduce all padding by 20%–30% on mobile devices (e.g., `64px` → `40px`, `32px` → `20px`)
- **Margin**: Compress vertical margins between sections by 25% on mobile (e.g., `40px` → `28px`)
- **Input fields**: Full-width on mobile; constrain to max-width `400px` on tablet and desktop
- **Button width**: Full-width on mobile; auto-width with min-width `120px` on tablet and desktop

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA**: Neon Blue (`#0000EE`)
- **Secondary Accent**: Electric Purple (`#603BFF`)
- **Warm Accent**: Coral Orange (`#FF9750`)
- **Playful Accent**: Neon Cyan (`#6AF7CE`)
- **Emphasis**: Lime Yellow (`#EAFF3D`)
- **Error State**: Bright Red (`#E60012`)
- **Background (Dark)**: Deep Black (`#0D0D0D`)
- **Text (Light)**: Pure White (`#FFFFFF`)
- **Text (Dark)**: True Black (`#000000`)
- **Neutral/Disabled**: Neutral Gray (`#6A6A71`)

### Iteration Guide
1. **Start with deep blacks and pure whites**: All backgrounds default to `#0D0D0D` or `#FFFFFF`; neon colors accent against these foundations
2. **Sharp corners everywhere**: Border radius is `0px` for buttons, cards, and inputs; only use `50px` for pill inputs and `50%` for circular icons
3. **Bold typography hierarchy**: Use obviously-narrow for all headings; Montserrat for body; never drop below `16px` for standard UI text
4. **High contrast text**: Always pair `#FFFFFF` text with `#0D0D0D` or `#000000` backgrounds; `#0000EE` links on white/light backgrounds only
5. **Spacing in multiples of 4px**: All margins and padding must align to the 4px base unit; use `16px`, `24px`, `32px`, `48px`, `64px` for major sections
6. **Minimal shadows**: Flat design is default; use shadows only for hovering/interactive states; max blur radius `16px`
7. **Accent colors for interactive elements**: Use `#EAFF3D` for warnings, `#6AF7CE` for play buttons, `#603BFF` for secondary actions
8. **Full-width hero sections**: Hero cards and feature sections span `1440px` max-width with `0px` border radius and semi-transparent dark overlay for text readability
9. **Mobile-first responsive**: Start single-column on mobile; expand to 4-column on tablet, 8–12 column on desktop; compress spacing by 25%–30% on mobile
10. **Accessibility**: Ensure all interactive elements are at least `44px` × `44px` on mobile; maintain WCAG AA contrast ratios (4.5:1 for body text, 3:1 for large text)