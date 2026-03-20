/**
 * bibleApi.ts — cliente para bible-api.com com cache SQLite offline-first
 *
 * Estratégia de cache:
 *   SQLite (permanente) → rede → salva no SQLite
 *
 * Busca full-text via SQLite (funciona offline após primeiro download).
 */

import axios from 'axios';
import { BIBLE_BOOKS, type BookMeta } from '../constants/bibleBooks';
import {
  isChapterCached,
  getChapterFromDB,
  saveChapterToDB,
  searchInDB,
} from './database';
import type { BibleBook, BibleChapter, BibleVerse, BiblePassage } from '../types/bible';
import type { Language, BibleVersion } from '../types/bible';

const BASE_URL = 'https://bible-api.com';

export const TRANSLATION_ID: Record<BibleVersion, string> = {
  ARC: 'almeida',
  WEB: 'web',
  KJV: 'kjv',
};

export const DEFAULT_VERSION: Record<Language, BibleVersion> = {
  pt: 'ARC',
  en: 'WEB',
};

const api = axios.create({ baseURL: BASE_URL, timeout: 12000 });

// ─── Books (estático) ─────────────────────────────────────────────────────────

export function getBooks(language: Language): BibleBook[] {
  return BIBLE_BOOKS.map((b: BookMeta) => ({
    id: b.id,
    name: language === 'pt' ? b.namePt : b.nameEn,
    nameLong: language === 'pt' ? b.namePt : b.nameEn,
    abbreviation: b.id,
    testament: b.testament,
  }));
}

// ─── Chapters (estático) ──────────────────────────────────────────────────────

export function getChapters(bookId: string): BibleChapter[] {
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) return [];
  return Array.from({ length: book.chapters }, (_, i) => ({
    id: `${bookId}.${i + 1}`,
    bookId,
    number: String(i + 1),
    reference: `${book.namePt} ${i + 1}`,
  }));
}

// ─── Chapter verses — SQLite first, rede como fallback ───────────────────────

export async function getChapterVerses(
  bookId: string,
  chapter: number,
  version: BibleVersion = 'ARC',
): Promise<BibleVerse[]> {
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) throw new Error(`Book not found: ${bookId}`);

  const translation = TRANSLATION_ID[version];

  // 1. Tenta o SQLite
  const cached = await isChapterCached(bookId, chapter, translation);
  if (cached) {
    const rows = await getChapterFromDB(bookId, chapter, translation);
    if (rows && rows.length > 0) return rows;
  }

  // 2. Busca na rede
  const { data } = await api.get(`/data/${translation}/${bookId}/${chapter}`);

  const bookName = data.verses[0]?.book ?? (version === 'ARC' ? book.namePt : book.nameEn);

  const verses: BibleVerse[] = data.verses.map((v: any) => ({
    id: `${bookId}.${chapter}.${v.verse}`,
    bookId,
    chapterId: `${bookId}.${chapter}`,
    reference: `${bookName} ${chapter}:${v.verse}`,
    text: v.text.replace(/\u00a0/g, '').trim(),
  }));

  // 3. Salva no SQLite para uso offline futuro
  await saveChapterToDB(verses, chapter, translation);

  return verses;
}

// ─── Single verse ─────────────────────────────────────────────────────────────

export async function getVerse(
  bookId: string,
  chapter: number,
  verse: number,
  version: BibleVersion = 'ARC',
): Promise<BibleVerse> {
  const verses = await getChapterVerses(bookId, chapter, version);
  const found = verses.find((v) => v.id === `${bookId}.${chapter}.${verse}`);
  if (found) return found;
  throw new Error(`Verse not found: ${bookId} ${chapter}:${verse}`);
}

// ─── Passage ──────────────────────────────────────────────────────────────────

export async function getPassage(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  version: BibleVersion = 'ARC',
): Promise<BiblePassage> {
  const verses = await getChapterVerses(bookId, chapter, version);
  const slice = verses.filter((v) => {
    const n = parseInt(v.id.split('.')[2], 10);
    return n >= verseStart && n <= verseEnd;
  });

  return {
    id: `${bookId}.${chapter}.${verseStart}-${verseEnd}`,
    reference: `${slice[0]?.reference.replace(/:\d+$/, '')}:${verseStart}-${verseEnd}`,
    content: slice.map((v) => v.text).join(' '),
    copyright: 'Public Domain',
  };
}

// ─── Search full-text via SQLite ──────────────────────────────────────────────

export async function searchVerses(
  query: string,
  version: BibleVersion = 'ARC',
): Promise<BibleVerse[]> {
  return searchInDB(query, TRANSLATION_ID[version]);
}

// ─── Random verse ─────────────────────────────────────────────────────────────

export async function getRandomVerse(version: BibleVersion = 'ARC'): Promise<BibleVerse> {
  const translation = TRANSLATION_ID[version];
  const { data } = await api.get(`/data/${translation}/random`);
  const book = BIBLE_BOOKS.find(
    (b) => b.nameEn.toLowerCase() === (data.verses?.[0]?.book ?? '').toLowerCase(),
  );
  return {
    id: `random_${Date.now()}`,
    bookId: book?.id ?? '',
    chapterId: '',
    reference: data.reference,
    text: data.text.replace(/\u00a0/g, '').trim(),
  };
}

// ─── Download de um livro inteiro em background ───────────────────────────────

export async function downloadBook(
  bookId: string,
  version: BibleVersion,
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) return;

  const translation = TRANSLATION_ID[version];

  for (let ch = 1; ch <= book.chapters; ch++) {
    const already = await isChapterCached(bookId, ch, translation);
    if (!already) {
      await getChapterVerses(bookId, ch, version);
      // Respeita o rate limit da API (15 req/30s)
      await new Promise((r) => setTimeout(r, 300));
    }
    onProgress?.(ch, book.chapters);
  }
}
