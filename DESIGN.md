# Design Brief

**Equation Drawer** — Minimalist productivity tool for freehand mathematical drawing and persistent storage.

## Tone & Differentiation
Minimalist precision. Warm, approachable color palette (sand base, rust accents) avoids generic dark-tech aesthetic. Canvas is the hero—chrome is minimal. Mathematical rigor meets human accessibility.

## Color Palette

| Token | Light L C H | Dark L C H | Usage |
|-------|-------------|-----------|-------|
| background | 0.97 0.02 70 | 0.14 0.01 70 | Page surfaces |
| foreground | 0.15 0.01 70 | 0.93 0.01 70 | Body text |
| card | 0.98 0.01 70 | 0.18 0.01 70 | Elevated surfaces |
| primary | 0.42 0.16 28 | 0.72 0.18 30 | Destructive/secondary actions |
| accent | 0.55 0.24 30 | 0.62 0.24 30 | CTAs, active states, highlights |
| muted | 0.85 0.04 70 | 0.28 0.02 70 | Disabled, secondary hierarchy |
| border | 0.92 0.02 70 | 0.26 0.01 70 | Dividers, input borders |

## Typography
- **Display**: Fraunces (geometric, precise—headers, titles)
- **Body**: GeneralSans (friendly, legible—interface text, labels)
- **Mono**: GeistMono (code-style—equation snippets, timestamps)
- Hierarchy: 32px display (title), 18px semibold (section), 14px body, 12px caption.

## Shape Language
Minimal radius variation. Borders: 0px (strict edges), 8px (contained elements), 12px (cards, popovers). No decorative curves.

## Structural Zones

| Zone | Background | Border | Depth |
|------|-----------|--------|-------|
| Header | card | border-b | elevated |
| Canvas (main) | background + subtle grid | none | flat |
| Sidebar (library) | card | border-l | elevated |
| Floating toolbar | card | border | elevated (shadow) |
| Footer/status | muted/30 | border-t | flat |

## Spacing & Rhythm
- Padding: 12px, 16px, 24px (no 8px exceptions)
- Gap: 8px (compact), 16px (standard), 24px (generous)
- Canvas toolbar: 12px inset from edges, 8px gap between controls.

## Component Patterns
- Buttons: accent for primary action, muted for secondary, border for tertiary, destructive (red) for delete
- Input fields: border-input bg-muted/50, focus: ring-2 ring-accent
- Cards: bg-card border-border rounded-lg shadow-sm
- Canvas: bg-background border-border, light grid pattern (1px, 40px spacing, border-color/20 opacity)

## Motion
Smooth transitions (0.3s ease-out) for hover states, panel open/close. No decorative animations—only functional feedback. Canvas drawing is real-time, zero latency.

## Constraints
- No gradients, no glassmorphism, no neon/glow effects
- Icons use stroke (2px) over fill where possible
- Canvas cursor is precise crosshair during draw, default elsewhere
- Equation library thumbnails max 120px × 90px

## Signature Detail
Equation titles inherit formula structure—monospace font at 11px in muted tone, showing captured timestamp below thumbnail. Creates visual connection between drawing and archive.
