use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

// ============================================================
// SEEDED RNG (no external deps)
// ============================================================

struct SeededRng {
    state: u64,
}

impl SeededRng {
    fn new(seed: u64) -> Self {
        Self { state: seed.wrapping_add(0x546472984f95) }
    }
    fn next(&mut self) -> u64 {
        self.state = self.state.wrapping_mul(6364136223846270005).wrapping_add(1442695040888963407);
        self.state
    }
    fn gen(&mut self, lo: f64, hi: f64) -> f64 {
        lo + (self.next() as f64 / u64::MAX as f64) * (hi - lo)
    }
}

const GOLD: &str = "FFD700";

// ============================================================
// CARD CONFIG
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CardConfig {
    pub name: String,
    pub arcana: ArcType,
    pub suit: Option<String>,
    pub number: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ArcType {
    #[serde(rename = "major")]
    Major,
    #[serde(rename = "minor")]
    Minor,
}

impl CardConfig {
    fn suit_colors(&self) -> (String, String) {
        match self.arcana {
            ArcType::Minor => match self.suit.as_deref() {
                Some("Wands") => ("ff5a2b".into(), "cc4018".into()),
                Some("Cups") => ("3288d8".into(), "1e60a8".into()),
                Some("Swords") => ("868ca0".into(), "646e80".into()),
                Some("Pentacles") => ("3c963c".into(), "287028".into()),
                _ => ("666".into(), "444".into()),
            },
            ArcType::Major => ("4a2d6b".into(), "331d4d".into()),
        }
    }
    fn rank_label(&self) -> String {
        match self.arcana {
            ArcType::Major => self.name.clone(),
            ArcType::Minor => {
                let s = self.suit.as_deref().unwrap_or("");
                match self.number {
                    1 => format!("Ace of {}", s),
                    11 => format!("Page of {}", s),
                    12 => format!("Knight of {}", s),
                    13 => format!("Queen of {}", s),
                    14 => format!("King of {}", s),
                    n => format!("{} of {}", n, s),
                }
            }
        }
    }
    fn major_numeral(&self) -> u8 {
        match self.name.as_str() {
            "The Fool" => 0, "The Magician" => 1, "The High Priestess" => 2,
            "The Empress" => 3, "The Emperor" => 4, "The Hierophant" => 5,
            "The Lovers" => 6, "The Chariot" => 7, "Strength" => 8,
            "The Hermit" => 9, "Wheel of Fortune" => 10, "Justice" => 11,
            "The Hanged Man" => 12, "Death" => 13, "Temperance" => 14,
            "The Devil" => 15, "The Tower" => 16, "The Star" => 17,
            "The Moon" => 18, "The Sun" => 19, "Judgement" => 20,
            "The World" => 21,
            _ => 0,
        }
    }
}

// ============================================================
// SVG GENERATOR
// ============================================================

pub struct SvgGen;

impl SvgGen {
    pub fn new() -> Self { Self {} }

    pub fn generate(&self, card: &CardConfig, seed: f64) -> String {
        let (primary, secondary) = card.suit_colors();
        let suit = card.suit.as_deref().unwrap_or("");
        let name = card.rank_label();

        let mut s = String::new();

        // HEADER
        s.push_str("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"260\" height=\"450\" viewBox=\"0 0 260 450\">\n");

        // DEFS
        s.push_str("<defs>\n");
        s.push_str(&format!(
            "<linearGradient id=\"sg\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n  <stop offset=\"0%\" stop-color=\"#{}\"/>\n  <stop offset=\"100%\" stop-color=\"#{}\"/>\n</linearGradient>",
            primary, secondary
        ));
        s.push_str("<linearGradient id=\"gg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n  <stop offset=\"0%\" stop-color=\"#FFD700\"/>\n  <stop offset=\"50%\" stop-color=\"#FFF4B0\"/>\n  <stop offset=\"100%\" stop-color=\"#FFD700\"/>\n</linearGradient>\n");
        s.push_str("<filter id=\"sh\" x=\"-3%\" y=\"-3%\" width=\"106%\" height=\"106%\">\n  <feDropShadow dx=\"0\" dy=\"2\" stdDeviation=\"3\" flood-color=\"#000\" flood-opacity=\"0.25\"/>\n</filter>\n");
        s.push_str("</defs>\n");

        // CARD BODY
        let x = 10.0;
        let y = 5.0;
        let w = 240.0;
        let h = 440.0;

        // Shadow
        s.push_str(&format!(
            "<rect x=\"{:.0}\" y=\"{:.0}\" width=\"{:.0}\" height=\"{:.0}\" rx=\"12\" fill=\"#000\" filter=\"url(#sh)\" opacity=\"0.25\"/>\n",
            x + 2.0, y + 2.0, w, h
        ));

        // Background
        s.push_str(&format!(
            "<rect x=\"{:.0}\" y=\"{:.0}\" width=\"{:.0}\" height=\"{:.0}\" rx=\"12\" fill=\"url(#sg)\" stroke=\"#FFD700\" stroke-width=\"2.5\"/>\n",
            x, y, w, h
        ));

        // Inner border
        s.push_str(&format!(
            "<rect x=\"{:.0}\" y=\"{:.0}\" width=\"{:.0}\" height=\"{:.0}\" rx=\"10\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.4\"/>\n",
            x + 10.0, y + 10.0, w - 20.0, h - 20.0
        ));

        // TITLE
        s.push_str(&format!(
            "<text x=\"130\" y=\"30\" text-anchor=\"middle\" fill=\"#FFD700\" font-family=\"Georgia,serif\" font-size=\"15\" font-weight=\"bold\" letter-spacing=\"1\">{}</text>\n",
            name
        ));

        // ILLUSTRATION
        let icx = 130.0;
        let icy = 195.0;
        s.push_str(&format!("<g transform=\"translate({:.0},{:.0})\">", icx, icy));
        match card.arcana {
            ArcType::Major => {
                s.push_str(&self.draw_major(card, &mut SeededRng::new(seed as u64)));
            }
            ArcType::Minor => {
                s.push_str(&self.draw_minor(card, &mut SeededRng::new(seed as u64)));
            }
        }
        s.push_str("</g>\n");

        // BOTTOM LABEL
        let short = match card.arcana {
            ArcType::Major => card.name.clone(),
            ArcType::Minor => {
                let rank = match card.number {
                    1 => "A".into(), 11 => "P".into(), 12 => "Kt".into(), 13 => "Q".into(), 14 => "Kr".into(), n => n.to_string(),
                };
                format!("{} {}", rank, suit)
            }
        };
        s.push_str(&format!(
            "<text x=\"130\" y=\"{:.0}\" text-anchor=\"middle\" fill=\"#FFF\" font-family=\"Georgia,serif\" font-size=\"10\" font-weight=\"bold\" opacity=\"0.8\">{}</text>\n",
            y + h - 18.0, short
        ));

        // CORNER ORNAMENTS
        let m = 14.0;
        let cs = 18.0;

        let draw_corner = |dx: f64, dy: f64| {
            let mut seg = String::new();
            seg.push_str(&format!(
                "M{:.0},{:.0} L{:.0},{:.0} L{:.0},{:.0}",
                dx, dy + cs, dx, dy, dx + cs, dy
            ));
            seg.push_str(format!(
                "\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"0.8\" opacity=\"0.3\"/>"
            ).trim_start());
            format!("<path d=\"{}\"/>", seg)
        };

        // TL
        s.push_str(&draw_corner(x + m, y + m));
        // TR
        s.push_str(&draw_corner(x + w - m - cs, y + m));
        // BL
        s.push_str(&draw_corner(x + m, y + h - m - cs));
        // BR
        s.push_str(&draw_corner(x + w - m - cs, y + h - m));

        // SUIT SYMBOLS / NUMERAL
        match card.arcana {
            ArcType::Major => {
                let n = card.major_numeral();
                let label = match n {
                    0 => "0", 1 => "I", 2 => "II", 3 => "III", 4 => "IV", 5 => "V",
                    6 => "VI", 7 => "VII", 8 => "VIII", 9 => "IX", 10 => "X", 11 => "XI",
                    12 => "XII", 13 => "XIII", 14 => "XIV", 15 => "XV", 16 => "XVI",
                    17 => "XVII", 18 => "XVIII", 19 => "XIX", 20 => "XX", 21 => "XXI",
                    _ => "0",
                };
                s.push_str(&format!(
                    "<text x=\"130\" y=\"{:.0}\" text-anchor=\"middle\" fill=\"#FFD700\" font-family=\"Georgia,serif\" font-size=\"10\" opacity=\"0.5\">{}</text>\n",
                    y + h - 8.0, label
                ));
            }
            ArcType::Minor => {
                let sym = match suit {
                    "Wands" => "🔥", "Cups" => "🏆", "Swords" => "⚔", "Pentacles" => "✦", _ => "✦",
                };
                let fs = 12.0;
                let positions = vec![
                    (x + 20.0, y + 16.0 + fs),
                    (x + w - 20.0, y + 16.0 + fs),
                    (x + 20.0, y + h - 28.0),
                    (x + w - 20.0, y + h - 28.0),
                ];
                for (px, py) in positions {
                    s.push_str(&format!(
                        "<text x=\"{:.0}\" y=\"{:.0}\" text-anchor=\"middle\" fill=\"#FFD700\" font-size=\"{}\" opacity=\"0.25\">{}</text>\n",
                        px, py, fs, sym
                    ));
                }
            }
        }

        s.push_str("</svg>");
        s
    }

    fn draw_major(&self, card: &CardConfig, r: &mut SeededRng) -> String {
        let mut s = String::new();

        match card.name.as_str() {
            "The Fool" => {
                s.push_str(&format!("<circle cx=\"0\" cy=\"-8\" r=\"15\" fill=\"#FFD700\" opacity=\"0.25\"/>"));
                s.push_str(&format!("<circle cx=\"0\" cy=\"-8\" r=\"8\" fill=\"#FFD700\" opacity=\"0.15\"/>"));
                s.push_str(&format!("<path d=\"M-4,-20 L4,-20 L0,-28 Z\" fill=\"#FFD700\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<line x1=\"0\" y1=\"5\" x2=\"0\" y2=\"22\" stroke=\"#FFD700\" stroke-width=\"2\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<path d=\"M-12,10 L12,10\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<circle cx=\"22\" cy=\"0\" r=\"6\" fill=\"#FFD700\" opacity=\"0.35\"/>"));
                s.push_str(&format!("<line x1=\"22\" y1=\"6\" x2=\"22\" y2=\"14\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.35\"/>"));
                s.push_str(&format!("<path d=\"M-45,28 Q-20,18 0,23 Q25,28 45,18\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.25\"/>"));
                s.push_str(&format!("<circle cx=\"35\" cy=\"-35\" r=\"8\" fill=\"#FFD700\" opacity=\"0.15\"/>"));
            }
            "The Magician" => {
                s.push_str(&format!("<circle cx=\"0\" cy=\"-8\" r=\"20\" fill=\"#FFD700\" opacity=\"0.15\"/>"));
                s.push_str(&format!("<circle cx=\"0\" cy=\"-8\" r=\"12\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<path d=\"M-8,-2 Q0,8 8,-2\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<line x1=\"0\" y1=\"10\" x2=\"0\" y2=\"32\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<path d=\"M-20,10 Q-10,5 0,10 Q10,15 20,10 Q10,5 0,0 Q-10,-5 -20,10\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                for dx in &[-15.0, -3.0, 9.0, 21.0] {
                    
                    
                    s.push_str(&format!("<rect x=\"{:.0}\" y=\"{:.0}\" width=\"5\" height=\"5\" rx=\"1\" fill=\"#FFD700\" opacity=\"0.2\"/>", dx - 2.5, 25.5));
                }
            }
            "The High Priestess" => {
                s.push_str(&format!("<rect x=\"-38\" y=\"-32\" width=\"18\" height=\"65\" fill=\"#FFD700\" opacity=\"0.15\" rx=\"3\"/>"));
                s.push_str(&format!("<rect x=\"20\" y=\"-32\" width=\"18\" height=\"65\" fill=\"#FFD700\" opacity=\"0.15\" rx=\"3\"/>"));
                s.push_str(&format!("<line x1=\"-29\" y1=\"-20\" x2=\"-29\" y2=\"25\" stroke=\"#FFD700\" stroke-width=\"0.5\" opacity=\"0.2\"/>"));
                s.push_str(&format!("<line x1=\"29\" y1=\"-20\" x2=\"29\" y2=\"25\" stroke=\"#FFD700\" stroke-width=\"0.5\" opacity=\"0.2\"/>"));
                for yv in &[-18f64, -5.0, 8.0] {
                    let yy = *yv;
                    let y0 = -yy;
                    let y1 = yy - 10.0;
                    let y2 = yy;
                    s.push_str(&format!("<path d=\"M-22,{:.0} L0,{:.0} L22,{:.0}\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"0.8\" opacity=\"0.3\"/>", y0, y1, y2));
                }
                s.push_str(&format!("<path d=\"M-12,0 Q0,-15 12,0 Q8,8 -12,8 Q-16,3 -12,0 Z\" fill=\"#FFD700\" opacity=\"0.35\"/>"));
            }
            "The Empress" => {
                s.push_str(&format!("<path d=\"M-25,15 L-15,-15 L-5,-3 L0,-20 L5,-3 L15,-15 L25,15 Z\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<circle cx=\"0\" cy=\"-20\" r=\"3\" fill=\"#FFD700\" opacity=\"0.4\"/>"));
                for (dx, dy) in &[(-18f64, 20.0), (-5.0, 25.0), (8.0, 20.0), (-12.0, 35.0), (5.0, 35.0)] {
                    
                    let dy = *dy;
                    s.push_str(&format!("<circle cx=\"{:.0}\" cy=\"{:.0}\" r=\"3\" fill=\"#FFD700\" opacity=\"0.25\"/>", dx, dy));
                }
            }
            "The Emperor" => {
                s.push_str(&format!("<rect x=\"-22\" y=\"-32\" width=\"44\" height=\"65\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.4\" rx=\"4\"/>"));
                s.push_str(&format!("<circle cx=\"0\" cy=\"-40\" r=\"11\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<path d=\"M-5,-48 L5,-48 L3,-53 L-3,-53 Z\" fill=\"#FFD700\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<line x1=\"0\" y1=\"-22\" x2=\"0\" y2=\"28\" stroke=\"#FFD700\" stroke-width=\"2\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<circle cx=\"0\" cy=\"-22\" r=\"5\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<path d=\"M-18,25 L18,25\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.3\"/>"));
            }
            "Death" => {
                s.push_str(&format!("<circle cx=\"0\" cy=\"-8\" r=\"18\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<circle cx=\"-5\" cy=\"-11\" r=\"4\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<circle cx=\"5\" cy=\"-11\" r=\"4\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<line x1=\"0\" y1=\"5\" x2=\"0\" y2=\"28\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<path d=\"M18,-28 L8,0\" stroke=\"#FFD700\" stroke-width=\"2.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<line x1=\"8\" y1=\"0\" x2=\"8\" y2=\"30\" stroke=\"#FFD700\" stroke-width=\"2\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<rect x=\"-12\" y=\"25\" width=\"24\" height=\"13\" rx=\"3\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.3\"/>"));
            }
            "Temperance" => {
                s.push_str(&format!("<circle cx=\"0\" cy=\"-12\" r=\"14\" fill=\"#FFD700\" opacity=\"0.25\"/>"));
                s.push_str(&format!("<path d=\"M-10,2 Q0,15 10,2\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<path d=\"M-18,-8 Q-20,5 -15,12 Q-10,8 -15,5 Z\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<path d=\"M15,-8 Q13,5 18,12 Q23,8 18,5 Z\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<path d=\"M-18,-5 Q-25,-15 -20,-20\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<circle cx=\"0\" cy=\"-28\" r=\"8\" fill=\"#FFD700\" opacity=\"0.2\"/>"));
                for i in 0..12 {
                    let a = (i as f64) * std::f64::consts::PI / 6.0;
                    let bx = (15.0 + 5.0 * a.cos()) * a.cos() - 75.0;
                    let by = 15.0 + 5.0 * a.sin();
                    let _ = (bx, by);
                    s.push_str(&format!("<circle cx=\"{:.0}\" cy=\"{:.0}\" r=\"1.5\" fill=\"#FFD700\" opacity=\"0.3\"/>", 0.0, 0.0));
                }
            }
            "The Devil" => {
                s.push_str(&format!("<circle cx=\"0\" cy=\"-15\" r=\"16\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<path d=\"M-8,-28 L-12,-42 L-4,-30 Z\" fill=\"#FFD700\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<path d=\"M8,-28 L12,-42 L4,-30 Z\" fill=\"#FFD700\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<path d=\"M-16,-10 Q-35,-20 -30,-35 Q-20,-25 -16,-15\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<path d=\"M16,-10 Q35,-20 30,-35 Q20,-25 16,-15\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<rect x=\"-5\" y=\"15\" width=\"10\" height=\"25\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<circle cx=\"0\" cy=\"12\" r=\"4\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<path d=\"M-25,20 L-12,15\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<path d=\"M25,20 L12,15\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.3\"/>"));
            }
            "The Tower" => {
                s.push_str(&format!("<path d=\"M0,-40 L-8,-25 L2,-22 L-5,-10\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"2\" opacity=\"0.6\"/>"));
                s.push_str(&format!("<rect x=\"-15\" y=\"-5\" width=\"30\" height=\"45\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<path d=\"M-10,-5 L-10,-15 L0,-20 L10,-15 L10,-5\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<circle cx=\"0\" cy=\"10\" r=\"4\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<rect x=\"-5\" y=\"30\" width=\"10\" height=\"15\" rx=\"2\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<circle cx=\"-25\" cy=\"15\" r=\"4\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<circle cx=\"22\" cy=\"10\" r=\"4\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
            }
            "The Star" => {
                s.push_str(&self.draw_star(0.0, -5.0, 30.0, 8, r));
                s.push_str(&self.draw_star(-18.0, 18.0, 9.0, 8, r));
                s.push_str(&self.draw_star(18.0, 18.0, 9.0, 8, r));
                for i in 0..8 {
                    let x = -12.0 + (i as f64) * 3.5;
                    s.push_str(&format!(
                        "<path d=\"M{:.1},32 Q{:.1},35 {:.1},37\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.2\" opacity=\"0.3\"/>",
                        x, x, x
                    ));
                }
            }
            "The Moon" => {
                s.push_str(&format!("<path d=\"M-18,-15 Q0,-30 18,-15 Q12,-5 -18,-5 Q-22,-10 -18,-15 Z\" fill=\"#FFD700\" opacity=\"0.35\"/>"));
                s.push_str(&format!("<circle cx=\"-35\" cy=\"-20\" r=\"2\" fill=\"#FFD700\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<circle cx=\"35\" cy=\"-18\" r=\"2\" fill=\"#FFD700\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<circle cx=\"-25\" cy=\"5\" r=\"1.5\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<rect x=\"-6\" y=\"5\" width=\"12\" height=\"28\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.2\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<line x1=\"-6\" y1=\"12\" x2=\"6\" y2=\"12\" stroke=\"#FFD700\" stroke-width=\"0.5\" opacity=\"0.2\"/>"));
                s.push_str(&format!("<path d=\"M-32,30 Q-15,20 0,30\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.2\"/>"));
                s.push_str(&format!("<path d=\"M0,30 Q15,20 32,30\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.2\"/>"));
                s.push_str(&format!("<circle cx=\"-20\" cy=\"25\" r=\"3\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<circle cx=\"20\" cy=\"25\" r=\"3\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
            }
            "The Sun" => {
                s.push_str(&format!("<circle cx=\"0\" cy=\"0\" r=\"28\" fill=\"#FFD700\" opacity=\"0.15\"/>"));
                s.push_str(&format!("<circle cx=\"0\" cy=\"0\" r=\"22\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"2\" opacity=\"0.5\"/>"));
                for i in 0..12 {
                    let a = (i as f64) * std::f64::consts::PI / 6.0;
                    let r1 = 25.0;
                    let r2 = 37.0 + r.gen(0.0, 3.0);
                    s.push_str(&format!(
                        "<line x1=\"{:.1}\" y1=\"{:.1}\" x2=\"{:.1}\" y2=\"{:.1}\" stroke=\"#FFD700\" stroke-width=\"2\" opacity=\"0.35\"/>",
                        r1 * a.cos(), r1 * a.sin(), r2 * a.cos(), r2 * a.sin()
                    ));
                }
                s.push_str(&format!("<path d=\"M-6,5 Q0,11 6,5\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<circle cx=\"-5\" cy=\"-3\" r=\"2\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<circle cx=\"5\" cy=\"-3\" r=\"2\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
            }
            "Judgement" => {
                s.push_str(&format!("<circle cx=\"0\" cy=\"-15\" r=\"12\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<path d=\"M-8,-5 Q0,8 8,-5\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<path d=\"M-10,0 Q-30,-10 -25,-25 Q-15,-15 -10,0\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<path d=\"M10,0 Q30,-10 25,-25 Q15,-15 10,0\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<path d=\"M15,-8 Q25,-15 35,-10 Q30,-5 15,-8\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<line x1=\"0\" y1=\"-45\" x2=\"0\" y2=\"-30\" stroke=\"#FFD700\" stroke-width=\"2\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<line x1=\"-8\" y1=\"-38\" x2=\"8\" y2=\"-38\" stroke=\"#FFD700\" stroke-width=\"2\" opacity=\"0.5\"/>"));
                for (px, py) in &[(-15f64, 22.0), (0.0, 25.0), (15.0, 22.0)] {
                    let px = *px;
                    let py = *py;
                    s.push_str(&format!("<circle cx=\"{:.0}\" cy=\"{:.0}\" r=\"3\" fill=\"#FFD700\" opacity=\"0.3\"/>", px, py));
                    s.push_str(&format!("<line x1=\"{:.0}\" y1=\"{:.0}\" x2=\"{:.0}\" y2=\"{:.0}\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.3\"/>", px, py + 3.0, px, py + 10.0));
                }
            }
            "The World" => {
                s.push_str(&format!("<ellipse cx=\"0\" cy=\"0\" rx=\"32\" ry=\"38\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"2\" opacity=\"0.5\"/>"));
                s.push_str(&format!("<circle cx=\"0\" cy=\"-5\" r=\"5\" fill=\"#FFD700\" opacity=\"0.3\"/>"));
                s.push_str(&format!("<line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"18\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.4\"/>"));
                s.push_str(&format!("<path d=\"M-8,12 L0,7 L8,12\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.4\"/>"));
                for (px, py) in &[(0.0, -38.0), (30.0, 5.0), (-30.0, 5.0), (0.0, 35.0)] {
                    let px = *px;
                    let py = *py;
                    s.push_str(&format!("<circle cx=\"{:.0}\" cy=\"{:.0}\" r=\"3\" fill=\"#FFD700\" opacity=\"0.3\"/>", px, py));
                }
                s.push_str(&format!("<path d=\"M-12,40 Q0,45 12,40\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.3\"/>"));
            }
            _ => {
                let num = card.major_numeral();
                let seg = ((num as u32 % 8) + 3).max(3);
                let rad = 25.0 + (num as f64 * 1.5);
                s.push_str(&self.draw_star(0.0, 0.0, rad, seg, r));
                s.push_str(&format!(
                    "<circle cx=\"0\" cy=\"0\" r=\"{:.0}\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.2\"/>",
                    rad + 10.0
                ));
                for i in 0..4 {
                    let a = (i as f64) * std::f64::consts::PI / 2.0;
                    s.push_str(&format!(
                        "<circle cx=\"{:.1}\" cy=\"{:.1}\" r=\"1.5\" fill=\"#FFD700\" opacity=\"0.25\"/>",
                        (rad + 12.0) * a.cos(), (rad + 12.0) * a.sin()
                    ));
                }
            }
        }
        s
    }

    fn draw_minor(&self, card: &CardConfig, r: &mut SeededRng) -> String {
        let mut s = String::new();
        let suit = card.suit.as_deref().unwrap_or("");
        let n = card.number as u32;

        match suit {
            "Wands" => {
                let count = n.min(10);
                let sp = 26.0;
                let sx = -((count as f64 - 1.0) * sp) / 2.0;
                for i in 0..count {
                    let x = sx + (i as f64) * sp;
                    let sw = (i as f64 - (count as f64 / 2.0)) * 3.0 * 0.25;
                    s.push_str(&format!(
                        "<line x1=\"{:.1}\" y1=\"28\" x2=\"{:.1}\" y2=\"-26\" stroke=\"#FFD700\" stroke-width=\"2\" opacity=\"0.55\"/>",
                        x, x + sw
                    ));
                    s.push_str(&format!(
                        "<path d=\"M{:.1},-26 Q{:.1},-35 {:.1},-26\" fill=\"#FFD700\" opacity=\"0.35\"/>",
                        x, x, x
                    ));
                }
            }
            "Cups" => {
                let count = n.min(10);
                let sp = 24.0;
                let sx = -((count as f64 - 1.0) * sp) / 2.0;
                let cy = if count == 1 { 0.0 } else { 12.0 };
                for i in 0..count {
                    let x = sx + (i as f64) * sp;
                    s.push_str(&format!(
                        "<path d=\"M{:.0},{:.0} Q{:.0},{:.0} {:.0},{:.0} Q{:.0},{:.0} {:.0},{:.0} Z\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.3\" opacity=\"0.55\"/>",
                        x - 7.0, cy - 14.0, x - 5.0, cy + 8.0, x, cy + 12.0, x + 5.0, cy + 8.0, x + 7.0, cy - 14.0
                    ));
                    s.push_str(&format!(
                        "<path d=\"M{:.0},{:.0} C{:.0},{:.0} {:.0},{:.0}\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"0.8\" opacity=\"0.35\"/>",
                        x - 9.0, cy - 5.0, x - 14.0, cy - 10.0, x - 9.0, cy - 14.0
                    ));
                    s.push_str(&format!(
                        "<ellipse cx=\"{}\" cy=\"{:.0}\" rx=\"4.5\" ry=\"1.5\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1\" opacity=\"0.3\"/>",
                        x, cy + 12.0
                    ));
                }
            }
            "Swords" => {
                let count = n.min(10);
                let sp = 26.0;
                let sx = -((count as f64 - 1.0) * sp) / 2.0;
                for i in 0..count {
                    let x = sx + (i as f64) * sp;
                    s.push_str(&format!(
                        "<line x1=\"{}\" y1=\"-26\" x2=\"{}\" y2=\"16\" stroke=\"#FFD700\" stroke-width=\"1.3\" opacity=\"0.55\"/>", x, x
                    ));
                    s.push_str(&format!(
                        "<path d=\"M{:.0},-26 L{:.0},-14 L{:.0},-14 Z\" fill=\"#FFD700\" opacity=\"0.35\"/>",
                        x - 1.2, x - 1.0, x + 1.0
                    ));
                    s.push_str(&format!(
                        "<line x1=\"{}\" y1=\"12\" x2=\"{}\" y2=\"12\" stroke=\"#FFD700\" stroke-width=\"1.5\" opacity=\"0.3\"/>",
                        x - 5.0, x + 5.0
                    ));
                    s.push_str(&format!(
                        "<circle cx=\"{}\" cy=\"16\" r=\"2\" fill=\"#FFD700\" opacity=\"0.3\"/>", x
                    ));
                }
            }
            "Pentacles" => {
                let count = n.min(10);
                let sp = 26.0;
                let sx = -((count as f64 - 1.0) * sp) / 2.0;
                for i in 0..count {
                    let x = sx + (i as f64) * sp;
                    let cy = if count == 1 { 0.0 } else { 12.0 };
                    s.push_str(&format!(
                        "<circle cx=\"{}\" cy=\"{:.0}\" r=\"12\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.3\" opacity=\"0.55\"/>", x, cy
                    ));
                    s.push_str(&self.draw_star(x, cy, 7.5, 5, r));
                }
            }
            _ => {
                s.push_str(&format!(
                    "<text x=\"0\" y=\"5\" text-anchor=\"middle\" fill=\"#FFD700\" font-size=\"30\" opacity=\"0.4\">{}</text>", n
                ));
            }
        }
        s
    }

    fn draw_star(&self, cx: f64, cy: f64, r: f64, pts: u32, _rng: &mut SeededRng) -> String {
        let mut path = String::new();
        let ri = r * 0.45;
        for i in 0..pts {
            let a_out = (i as f64) * std::f64::consts::PI / (pts as f64) - std::f64::consts::PI / 2.0;
            let a_in = ((i as f64) + 0.5) * std::f64::consts::PI / (pts as f64) - std::f64::consts::PI / 2.0;
            let ox = cx + r * a_out.cos();
            let oy = cy + r * a_out.sin();
            let ix = cx + ri * a_in.cos();
            let iy = cy + ri * a_in.sin();
            if i == 0 {
                path.push_str(&format!("M{:.1},{:.1} L{:.1},{:.1} ", ox, oy, ix, iy));
            } else {
                path.push_str(&format!("L{:.1},{:.1} L{:.1},{:.1} ", ix, iy, ox, oy));
            }
        }
        path.push_str("Z");
        format!(
            "<path d=\"{}\" fill=\"none\" stroke=\"#FFD700\" stroke-width=\"1.3\" opacity=\"0.55\"/>",
            path
        )
    }
}

// ============================================================
// WASM FFI
// ============================================================

#[wasm_bindgen]
pub struct TarotSvgGen {
    gen: SvgGen,
}

#[wasm_bindgen]
impl TarotSvgGen {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { gen: SvgGen::new() }
    }

    #[wasm_bindgen]
    pub fn generate_card(&self, config_json: &str, seed: f64) -> Result<String, JsValue> {
        let config: CardConfig = serde_json::from_str(config_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid JSON: {}", e)))?;
        Ok(self.gen.generate(&config, seed))
    }

    #[wasm_bindgen]
    pub fn generate_grid(&self, count: u32, seed: f64) -> Result<String, JsValue> {
        let cards = make_cards(count);
        let mut html = String::from(
            r#"<div style="display:grid;grid-template-columns:repeat(auto-fill,180px);gap:16px;justify-content:center;padding:16px;max-width:100%;overflow-x:auto;">"#
        );

        let mut rng = SeededRng::new(seed as u64);

        for card in &cards {
            let svg = self.gen.generate(card, rng.gen(0.0, 100.0));
            let name = card.rank_label();
            let card_html = format!(
                "<div style=\"transition:transform 0.2s;cursor:pointer\" onmouseover=\"this.style.transform='scale(1.08)';this.querySelector('div').style.boxShadow='0 8px 20px rgba(0,0,0,0.4)';this.style.zIndex='10'\" onmouseout=\"this.style.transform='scale(1)';this.querySelector('div').style.boxShadow='0 4px 12px rgba(0,0,0,0.3)';this.style.zIndex='0'\" style=\"margin:0 auto\">\n<div style=\"background:#1a1a2e;border-radius:10px;padding:6px 4px 10px;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:inline-block\">\n{}\n</div>\n<div style=\"text-align:center;color:#FFD700;font-family:Georgia,serif;font-size:10px;margin-top:6px;opacity:0.75;max-width:170px;word-wrap:break-word\">{}</div>\n</div>",
                svg, name
            );
            html.push_str(&card_html);
        }

        html.push_str("</div>");
        Ok(html)
    }

    #[wasm_bindgen]
    pub fn get_full_deck_json(&self) -> Result<String, JsValue> {
        let cards = make_cards(78);
        serde_json::to_string_pretty(&cards)
            .map_err(|e| JsValue::from_str(&format!("JSON error: {}", e)))
    }
}

fn make_cards(count: u32) -> Vec<CardConfig> {
    let mut cards = Vec::new();
    let major = [
        "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
        "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
        "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
        "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
        "Judgement", "The World",
    ];
    for &name in major.iter().take(count as usize) {
        cards.push(CardConfig { name: name.to_string(), arcana: ArcType::Major, suit: None, number: 0 });
    }
    if count > 22 {
        for suit in &["Wands", "Cups", "Swords", "Pentacles"] {
            for num in &[1u8, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] {
                if cards.len() >= count as usize { break; }
                cards.push(CardConfig {
                    name: format!("{} {}", suit, num),
                    arcana: ArcType::Minor,
                    suit: Some(suit.to_string()),
                    number: *num,
                });
            }
        }
    }
    cards
}
