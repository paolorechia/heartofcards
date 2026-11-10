# 🗝️ Tarot Reader

A responsive tarot card reader app with procedural SVG card generation powered by Rust/WASM.

## Features

### 📖 Reading Mode
- Choose from 8 spread types across 5 categories (General, Love, Career, Wellbeing, Decisions)
- Pick your physical cards from a visual grid (78-card Rider-Waite-Smith deck)
- Mark cards as reversed
- Get detailed interpretations with suit-colored cards and position-specific guidance

### ⚡ Card Generator (Rust/WASM)
- Generate up to 78 tarot cards as unique SVG illustrations
- Each card drawn procedurally with:
  - **Major Arcana**: 22 unique designs (Fool, Magician, Death, Sun, Moon, Star, Tower, etc.)
  - **Minor Arcana**: 56 cards with suit-specific artwork (Wands 🔥, Cups 🏆, Swords ⚔, Pentacles ✦)
  - Gold detailing, gradient backgrounds, corner ornaments
  - Seeded randomization for variation
- All rendering happens client-side via Rust compiled to WebAssembly

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **WASM**: Rust with wasm-bindgen, custom seeded RNG (no external dependencies)
- **Cards**: 78-card Rider-Waite-Smith deck

## Project Structure

```
tarot-reader/
├── src/
│   ├── components/
│   │   ├── CardPicker.tsx       # Card selection grid
│   │   ├── Interpretation.tsx   # Reading interpretation display
│   │   ├── SpreadSelector.tsx   # Spread category & selection
│   │   ├── StepIndicator.tsx    # Multi-step progress
│   │   └── WasmCard.tsx         # WASM-powered SVG card renderer
│   ├── data/
│   │   ├── cards.ts             # 78-card database with meanings
│   │   └── spreads.ts           # 8 spread definitions
│   ├── types.ts                 # TypeScript interfaces
│   ├── App.tsx                  # Main app with Reading + Generator modes
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind styles
├── pkg/                         # WASM build output
│   ├── tarot_gen.js             # WASM bindings
│   ├── tarot_gen_bg.wasm        # Compiled WASM module (180KB)
│   └── ...
└── Cargo.toml

tarot-wasm/
├── src/
│   ├── lib.rs                   # 626 lines — SVG card generation engine
│   └── main.rs                  # Binary entry point (not used for WASM)
└── Cargo.toml
```

## Card Generation Details

The WASM module generates SVG cards procedurally:

### Major Arcana Illustrations
| Card | Illustration |
|------|-------------|
| The Fool | Figure with staff, dog, cliff edge |
| The Magician | Figure with tools, infinity symbol |
| The High Priestess | Pillars, veil, crescent moon |
| The Empress | Crown, wheat symbols |
| The Emperor | Throne, scepter, orb |
| Death | Skeleton, scythe, skull |
| Temperance | Angel pouring between vessels |
| The Devil | Horned figure, wings, chains |
| The Tower | Lightning, cracked tower, falling figures |
| The Star | Large 8-pointed star, 2 smaller, water drops |
| The Moon | Crescent moon, stars, tower, dogs |
| The Sun | Sun with face, rays |
| Judgement | Angel with trumpet, cross, rising figures |
| The World | Wreath, figure, 4 corner creatures |
| Other Major | Geometric stars/patterns based on card number |

### Minor Arcana by Suit
- **Wands** (Fire): Diagonal wands with flame tops
- **Cups** (Water): Cups with handles and bases
- **Swords** (Air): Swords with points, guards, and pommels
- **Pentacles** (Earth): Circles with inner 5-pointed stars

## Running

```bash
cd tarot-reader
npm install
npm run dev          # Development server
npm run build        # Production build
```

WASM rebuild:
```bash
cd tarot-wasm
wasm-pack build --target web --out-dir ../tarot-reader/pkg
```

## Future: AI Image Generation

The original plan was to use Candle (Rust ML framework) with Flux or Stable Diffusion to generate tarot card images. This would replace the procedural SVG art with AI-generated illustrations. To implement:

1. Add `candle-core` and `candle-diffusers` to Cargo.toml
2. Load a quantized Stable Diffusion or Flux model from HuggingFace
3. Generate card images from text prompts like "Tarot card of Death, golden art nouveau style"
4. Cache generated images and serve them client-side

This is computationally expensive but would produce much richer imagery. Consider a pre-generation pipeline that creates all 78 cards server-side and serves them as static assets.
