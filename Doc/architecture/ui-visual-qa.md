# Visual QA vs design language (UI14.07)

## Target language

Premium AI SaaS: white surfaces, blue accent `#2563eb`, large radius, soft shadows, Plus Jakarta Sans via tokens, generous spacing.

## Pass criteria

| Check | Expectation |
|-------|-------------|
| Surfaces | White/card on light gray app canvas (`#f8fafc` dash content) |
| Accent | Blue CTAs / active nav / links — no purple theme |
| Cards | Soft border + `dm-shadow-sm/md`, `dm-radius-xl` |
| Density | Large padding on landing; calm dashboard grids |
| Chrome | Sticky public header; sticky app topbar; 16rem sidebar desktop |
| Motion | Subtle fade/lift only; reduced-motion safe |
| States | Empty / error / loading use shared feedback components |

## Out of scope for this pass

Pixel-perfect match to any third-party glassmorphism mock; brand is DOC Manager blue/white, not a fork of the reference screenshot palette.
