# Design System: Nocturne Pro

## 1. Overview & Creative North Star
The objective of this design system is to bridge the gap between the immersive, atmospheric depth of a premium streaming service and the authoritative, structured clarity of a professional networking platform. 

### Creative North Star: "The Digital Backstage"
The design system avoids the "cluttered social feed" aesthetic in favor of a sophisticated, editorial experience. It mimics the exclusive environment of a high-end recording studio—dimly lit, acoustically treated, and focused on the work. We achieve this through "Organic Brutalism": using a rigid, professional grid but softening it with overlapping glass layers, deep tonal shifts, and high-contrast typography that feels like a premium print magazine. This is a space for serious creators to build an "Elite Professional Identity."

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep charcoals and slates to provide a low-glare, focused environment for long-form professional collaboration.

### The "No-Line" Rule
To maintain a bespoke, premium feel, **1px solid borders are strictly prohibited** for defining sections or layout boundaries. Instead:
*   **Background Shifts:** Use the `surface-container` tokens to differentiate areas. 
*   **Tonal Transitions:** A `surface-container-low` section sitting on a `surface` background provides all the separation needed.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of "Matte Glass." Use the following depth scale:
*   **Base Layer:** `surface` (#131313) - The primary canvas.
*   **Nesting Layer 1:** `surface-container-low` (#1c1b1b) - For sidebar navigation or secondary feeds.
*   **Nesting Layer 2:** `surface-container-high` (#2a2a2a) - For interactive cards or highlighted content blocks.
*   **Floating Elements:** `surface-bright` (#393939) with 60% opacity and a 20px backdrop blur for overlays and menus.

### Signature Textures
Main CTAs and Hero sections must not be flat. Utilize a **Signature Gradient**: Transitioning from `primary` (#c1c1ff) to `primary_container` (#5d5fef) at a 135-degree angle. This adds "soul" and a sense of motion that resonates with a music-focused audience.

---

## 3. Typography
The typography is designed to feel authoritative yet modern. We utilize **Manrope** for high-impact editorial moments and **Inter** for precision data and communication.

*   **Display (Manrope):** Large, aggressive scales (`display-lg`: 3.5rem) with tight tracking (-2%) for headers. This conveys the "Elite" status of the platform.
*   **Headline & Title (Manrope):** Bold and clear. These act as the "Signposts" in the layout.
*   **Body & Label (Inter):** High-readability sans-serif. Use `body-md` (0.875rem) with increased letter-spacing (0.02em) for professional correspondence, mimicking the clarity of LinkedIn but with a modern tech edge.
*   **Hierarchy Note:** Use `on-surface-variant` (#c7c4d7) for secondary metadata to create a natural visual recession without reducing font size to illegible levels.

---

## 4. Elevation & Depth
In this design system, elevation is a feeling, not a drop-shadow.

*   **The Layering Principle:** Depth is achieved by stacking `surface-container` tiers. For example, a card using `surface-container-highest` (#353534) should sit on a background of `surface-container-low` (#1c1b1b).
*   **Ambient Shadows:** If a floating element requires a shadow, it must be "Ambient."
    *   *Blur:* 40px - 60px.
    *   *Opacity:* 4% - 8% of the `on-surface` color. 
    *   *Offset:* 8px - 12px Y-axis only.
*   **The "Ghost Border" Fallback:** For accessibility in high-density data views, use the `outline-variant` token at **15% opacity**. This provides a "suggestion" of a boundary without the harshness of a traditional stroke.
*   **Glassmorphism:** Use for persistent navigation or floating player controls. Apply `surface_variant` at 40% opacity with a `24px` backdrop-blur to allow colors from the content below to bleed through softly.

---

## 5. Components
### Buttons
*   **Primary:** Rounded `full` (9999px). Gradient fill (Primary to Primary-Container). No border. Label in `on_primary_fixed`.
*   **Secondary:** Rounded `md` (0.75rem). `surface-container-highest` fill. Ghost border (15% opacity `outline-variant`).
*   **Tertiary:** No background. Bold `label-md` in `primary`.

### Cards & Lists
*   **Forbid Dividers:** Use `spacing-4` (1.4rem) or `spacing-6` (2rem) of vertical white space to separate list items. 
*   **Card Styling:** Use `rounded-lg` (1rem). Background should be one step higher than the section it sits on (e.g., `surface-container-low` on a `surface` background).

### Chips (Professional Tags)
*   **Action Chips:** Small, `rounded-sm` (0.25rem). Background `secondary-container`. Use for "Skills" or "Genres."

### Specialized Component: The "Collaboration Node"
A bespoke card type for MUSYNC. Uses a `surface-container-high` background with an `Electric Indigo` (Primary) accent glow on the left edge (2px wide) to signify an active professional opportunity.

---

## 6. Do's and Don'ts

### Do
*   **Do use asymmetric layouts.** Overlap a typography element (`headline-lg`) slightly over a `surface-container` card to break the "boxed-in" feel.
*   **Do lean into the dark.** Use `surface-container-lowest` (#0e0e0e) for "deep focus" areas like project workspaces.
*   **Do use generous spacing.** Music needs "air" to breathe; follow the `spacing-10` and `12` scales for section margins.

### Don't
*   **Don't use pure white (#FFFFFF).** The brightest text should be `on-surface` (#e5e2e1) to maintain the premium, low-glare aesthetic.
*   **Don't use social media "noise".** Avoid emojis in professional labels, high-frequency notification dots, or "Like" animations. Use "Endorse" or "Collaborate" instead.
*   **Don't use standard shadows.** Standard CSS `box-shadow: 0 2px 4px rgba(0,0,0,0.5)` is strictly forbidden. It feels cheap. Use the Tonal Layering or Ambient Shadow rules defined in Section 4.

## Theme Tokens
- Color Mode: DARK
- Roundness: ROUND_EIGHT
- Custom Color: #5D5FEF
- Headline Font: MANROPE
- Body Font: INTER
- Label Font: INTER
- Spacing Scale: 3
