# Tarot Reader — Component Architecture

## Overview

A mystical tarot reading app built with React + Vite + Tailwind CSS 4 + Rust/WASM.

## Component Hierarchy

```
App
├── Header (mode switcher, logo, reset link)
├── MainContent
│   ├── Reading Mode
│   │   ├── StepIndicator (progress dots)
│   │   ├── SpreadSelector
│   │   │   ├── CategoryFilter (pill buttons)
│   │   │   └── SpreadCard (×N)
│   │   ├── CardPicker
│   │   │   ├── TabbedPanel (major/minor tabs)
│   │   │   ├── CardCell (×N)
│   │   │   └── ReversedToggle (×selected)
│   │   └── Interpretation
│   │       ├── CardPosition (×N)
│   │       └── ReadingSummary
│   └── Generator Mode
│       ├── GeneratorView
│       │   ├── GeneratorControls (slider, seed)
│       │   ├── WasmCardGrid
│       │   │   └── WasmCard (×N)
│       │   └── GeneratorSummary
│       └── WasmCard (individual SVG card)
└── Footer
```

## Components

### Layout
| Component | Props | Purpose |
|---|---|---|
| `Header` | mode, step, onModeChange, onReset | Top nav with logo and mode buttons |
| `Footer` | — | Bottom credits |
| `StepIndicator` | currentStep, totalSteps, title | 3-step progress dots |

### Spread Selection
| Component | Props | Purpose |
|---|---|---|
| `SpreadSelector` | onSelect | Category filter + spread cards grid |
| `CategoryFilter` | categories, selectedCategory, onSelectCategory | Pill buttons for spread categories |
| `SpreadCard` | name, numCards, description, positions, onClick | Clickable spread card |

### Card Selection
| Component | Props | Purpose |
|---|---|---|
| `CardPicker` | numCards, onPick | Major/Minor tabs + card grid |
| `TabbedPanel` | tabs, activeTab, onTabChange | Reusable tab component |
| `CardCell` | name, isSelected, isReversed, onClick | Individual selectable card |
| `ReversedToggle` | cardName, isReversed, onToggle | Reversed state toggle |

### Interpretation
| Component | Props | Purpose |
|---|---|---|
| `Interpretation` | spread, cards | Full reading view |
| `CardPosition` | index, positionName, positionDescription, cardName, isReversed, spreadCategory | Position + card + meaning |
| `ReadingSummary` | positions, cards | Summary box with all cards |

### Generator
| Component | Props | Purpose |
|---|---|---|
| `GeneratorView` | count, seed, onCountChange, onSeedChange | WASM card generator |
| `GeneratorControls` | count, seed, totalCards, onCountChange, onSeedChange | Slider + seed input |
| `WasmCard` | cardName, arcana, suit, number, index | WASM SVG card |
| `WasmCardGrid` | cards | Grid of WASM cards |

## Styling System

### Design Tokens (`src/styles/tokens.css`)
CSS custom properties for colors, shadows, radii, spacing, fonts, transitions.

### Component Classes (`src/styles/components.css`)
Semantic class names following BEM-like naming:
- `.app-shell`, `.app-header`, `.app-footer`
- `.btn`, `.btn--primary`, `.btn--secondary`
- `.spread-grid`, `.spread-card`
- `.card-grid`, `.card-cell`
- `.interpretation`, `.interpretation__position`
- `.generator`, `.generator__controls`
- `.wasm-card`, `.wasm-card-grid`

### Animations (`src/styles/animations.css`)
- `fadeIn` — page load entrance
- `pulse` — loading state
- `glow` — card hover effect
- `float` — subtle floating animation
- `spin` — rotation animation

## Data Flow

1. **App** manages mode, step, spread, cards, and generator state
2. **Reading flow**: SpreadSelector → CardPicker → Interpretation
3. **Generator flow**: GeneratorControls → WasmCardGrid → WasmCard
4. **Cards data** from `src/data/cards.ts` (78 cards × meanings)
5. **Spreads data** from `src/data/spreads.ts` (8 spreads)
6. **SVG generation** via WASM from `tarot-wasm` crate

## Key Design Decisions

- **Semantic CSS over utility classes**: Clean component markup with meaningful class names
- **Design tokens**: Single source of truth for colors, spacing, shadows
- **Composition over inheritance**: Small, focused components composed together
- **Unidirectional data flow**: State bubbles up, callbacks bubble down
- **Zero inline styles**: All styling via CSS classes and Tailwind
