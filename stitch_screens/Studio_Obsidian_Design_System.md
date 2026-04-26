# Design System: Studio Obsidian

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Sonic Gallery."** 

In a professional music collaboration environment, the interface must never compete with the art being created. This system treats the UI as a curated, high-end gallery space—quiet, expansive, and authoritative. We move beyond the "standard SaaS dashboard" by employing high-end editorial layouts. This means embracing intentional asymmetry, utilizing extreme typographic scale for rhythm, and treating white space (negative space) as a functional element rather than "empty" space. 

By eliminating traditional structural lines and opting for tonal transitions, we create a seamless, liquid experience that feels "carved" out of a single block of dark obsidian rather than assembled from components.

---

## 2. Colors & Tonal Architecture
This system utilizes a "Soft Dark" palette. We avoid pure blacks and high-contrast whites to reduce eye strain during long studio sessions.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or layout containment. 
Boundaries must be defined through:
- **Background Shifts:** Placing a `surface-container-low` (#131316) element against a `surface` (#0e0e10) background.
- **Negative Space:** Using the spacing scale (e.g., `spacing-12` or `spacing-16`) to create distinct content groupings.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
- **Base Layer:** `surface` (#0e0e10)
- **Secondary Workspace:** `surface-container` (#19191d)
- **Elevated Interactive Elements:** `surface-container-high` (#1f1f24)
- **Deep Inset/Recessed Elements:** `surface-container-lowest` (#000000)

### The Glass & Gradient Rule
To achieve a premium "Apple-style" depth, floating elements (modals, context menus, navigation bars) should utilize **Glassmorphism**:
- **Background:** `surface-container` (#19191d) at 70% opacity.
- **Effect:** Backdrop Blur (20px to 40px).
- **Signature Texture:** For primary actions, use a subtle linear gradient from `primary` (#c2c1ff) to `primary-container` (#332dbc) at a 135-degree angle. This adds "soul" to the indigo/violet focus point.

---

## 3. Typography
The typographic system creates an editorial rhythm by pairing the geometric, rhythmic **Manrope** for expression with the Swiss-functional **Inter** for utility.

*   **Display & Headlines (Manrope):** Use `display-lg` (3.5rem) for hero moments and `headline-md` (1.75rem) for section starts. Keep letter-spacing at -0.02em for a "tight" professional look.
*   **Utility & UI (Inter):** Use `body-md` (0.875rem) for general interface text. Inter provides the legibility required for complex metadata (track titles, timestamps, BPM).
*   **The Power of Scale:** Create drama by placing a `label-sm` (0.6875rem) in `secondary` (#9f9da1) directly above a `display-sm` (2.25rem) headline. This high-contrast scale is the hallmark of high-end editorial design.

---

## 4. Elevation & Depth
In "The Sonic Gallery," depth is achieved through **Tonal Layering** rather than structural shadows.

*   **The Layering Principle:** Instead of a drop shadow, elevate a card by moving from `surface` (#0e0e10) to `surface-container-low` (#131316). 
*   **Ambient Shadows:** For floating elements (Modals/Popovers), use a "Long-Fall" shadow: 
    *   `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);` 
    *   The shadow must feel like ambient light occlusion, not a "glow."
*   **The Ghost Border:** If a boundary is strictly required for accessibility (e.g., input fields), use a "Ghost Border": `outline-variant` (#47474d) at 20% opacity. Never use 100% opaque borders.
*   **Consistent Roundness:** Use the `md` (0.375rem) token for standard buttons and inputs. Use `xl` (0.75rem) for larger containers and cards. This subtle rounding maintains a professional, "machined" aesthetic.

---

## 5. Components

### Buttons
- **Primary:** Background `primary` (#c2c1ff), Text `on-primary` (#2c23b6). Use `rounded-md`.
- **Secondary:** Background `surface-container-high` (#1f1f24), Text `on-surface`. No border.
- **Tertiary:** No background. Text `primary`. Use for low-emphasis actions.

### Inputs (Text/Search)
- **Static State:** Background `surface-container-low` (#131316). No border.
- **Focus State:** Subtle Ghost Border (20% opacity `primary`) and a slight increase in background brightness to `surface-container`.

### Cards & Lists
- **Rule:** Absolute prohibition of divider lines. 
- **Execution:** Group list items using `spacing-2` (0.7rem) vertical gaps. Use a `surface-container-low` background on hover to indicate interactivity.
- **Editorial Card:** Use asymmetric padding—e.g., `spacing-8` on the left/top and `spacing-12` on the right—to create a modern, non-grid-bound feel.

### Waveform / Audio Track Component
- **Background:** `surface-container-lowest` (#000000).
- **Active State:** `primary` (#c2c1ff).
- **Inactive State:** `secondary-container` (#3c3b3f).
- Use `rounded-sm` (0.125rem) for individual waveform bars to maintain the "machined" look.

---

## 6. Do's and Don'ts

### Do
- **Do** use `spacing-16` (5.5rem) and `spacing-20` (7rem) to separate major sections.
- **Do** use `on-surface-variant` (#abaab1) for secondary metadata to create a clear hierarchy.
- **Do** lean into asymmetry. For example, left-align a headline and right-align the supporting action with a large gap between them.
- **Do** use `backdrop-filter: blur(24px)` on all floating overlays.

### Don't
- **Don't** use a 1px border to separate the sidebar from the main content. Use a background shift from `surface-container` to `surface`.
- **Don't** use pure white (#ffffff) for text. Always use `on-surface` (#e6e4ec) to maintain the soft dark aesthetic.
- **Don't** use standard "Indigo" (#3F51B5). Only use the designated `primary` (#c2c1ff) or `primary-container` (#332dbc) to ensure the sophisticated violet tone.
- **Don't** clutter the view. If a piece of information isn't vital to the current task, hide it behind a subtle "More" (Label-SM) interaction.

## Theme Tokens
- Color Mode: DARK
- Roundness: ROUND_FOUR
- Custom Color: #5E5CE6
- Headline Font: MANROPE
- Body Font: INTER
- Label Font: INTER
- Spacing Scale: 3
