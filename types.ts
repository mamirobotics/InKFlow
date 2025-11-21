export enum AppView {
  GENERATOR = 'GENERATOR',
  PRACTICE = 'PRACTICE',
  TUTOR = 'TUTOR'
}

export interface CalligraphyStyle {
  id: string;
  name: string;
  description: string;
  era: string;
}

export const CALLIGRAPHY_STYLES: CalligraphyStyle[] = [
  { id: 'copperplate', name: 'Copperplate', description: 'Elegant, flowing script with contrast between thick and thin strokes.', era: '18th Century' },
  { id: 'gothic', name: 'Blackletter (Gothic)', description: 'Dense, dark texture with dramatic angular strokes.', era: '12th Century' },
  { id: 'italic', name: 'Italic Hand', description: 'Slanted, fluid handwriting style popular in the Renaissance.', era: '15th Century' },
  { id: 'uncial', name: 'Uncial', description: 'Rounded, majuscule script used by Latin and Greek scribes.', era: '4th Century' },
  { id: 'brush', name: 'Modern Brush', description: 'Expressive, free-flowing style mimicking brush pens.', era: 'Modern' },
];
