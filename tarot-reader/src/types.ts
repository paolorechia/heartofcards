export interface CardDefinition {
  name: string;
  arcana: 'major' | 'minor';
  suit?: string; // for Minor Arcana
  number?: number; // for Minor Arcana (Ace=1, 10=10, Page=11, Knight=12, Queen=13, King=14)
}

export interface CardMeaning {
  upright: string[]; // key themes
  reversed: string[]; // key themes
}

export interface CardData {
  def: CardDefinition;
  meanings: CardMeaning;
  // Thematic categories for richer interpretations
  themes: {
    love?: string[];
    career?: string[];
    personal?: string[];
    challenge?: string[];
    advice?: string[];
    general: string[];
  };
}

export interface SpreadPosition {
  name: string;
  description: string;
}

export interface SpreadDefinition {
  id: string;
  name: string;
  category: 'general' | 'love' | 'career' | 'wellbeing' | 'decision';
  positions: SpreadPosition[];
  numCards: number;
  description: string;
}
