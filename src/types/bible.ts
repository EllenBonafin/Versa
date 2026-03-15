export type Language = 'pt' | 'en';

// Versões disponíveis na bible-api.com (upgrade para API.Bible no futuro)
export type BibleVersion = 'ARC' | 'WEB' | 'KJV';

export interface BibleBook {
  id: string;
  name: string;
  nameLong: string;
  abbreviation: string;
  testament: 'OT' | 'NT';
}

export interface BibleChapter {
  id: string;
  bookId: string;
  number: string;
  reference: string;
}

export interface BibleVerse {
  id: string;
  bookId: string;
  chapterId: string;
  reference: string;
  text: string;
  verseCount?: number;
}

export interface BiblePassage {
  id: string;
  reference: string;
  content: string;
  copyright: string;
}

export interface DailyVerse {
  reference: string;
  text: string;
  textEn?: string;
  referenceEn?: string;
  date: string;
}

export interface FavoriteVerse {
  id: string;
  reference: string;
  text: string;
  language: Language;
  savedAt: string;
}

export interface BibleApiVersion {
  id: string;
  name: string;
  abbreviation: string;
  language: Language;
}
