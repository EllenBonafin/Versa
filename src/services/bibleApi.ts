import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BibleBook, BibleChapter, BibleVerse, BiblePassage } from '../types/bible';

const BASE_URL = 'https://api.scripture.api.bible/v1';

// Replace with your API.Bible key (free at https://scripture.api.bible)
const API_KEY = process.env.EXPO_PUBLIC_BIBLE_API_KEY ?? 'YOUR_API_BIBLE_KEY';

// Bible version IDs on API.Bible
export const BIBLE_VERSIONS = {
  NVI: 'bf8f1c7f3f9f8f8f-01',   // NVI Português — update with real ID after registering
  ARC: '55212e3cf5d04d49-01',   // Almeida Revista e Corrigida
  NIV: '06125adad2d5898a-01',   // NIV English
  ESV: '9879dbb7cfe39e4d-01',   // ESV English
} as const;

const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'api-key': API_KEY,
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// ─── Cache helpers ───────────────────────────────────────────────────────────

async function getCached<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(`bible_cache_${key}`);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw) as { data: T; timestamp: number };
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

async function setCache<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(
      `bible_cache_${key}`,
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch {
    // silently fail — cache is best-effort
  }
}

// ─── Books ───────────────────────────────────────────────────────────────────

export async function getBooks(bibleId: string): Promise<BibleBook[]> {
  const cacheKey = `books_${bibleId}`;
  const cached = await getCached<BibleBook[]>(cacheKey);
  if (cached) return cached;

  const { data } = await api.get(`/bibles/${bibleId}/books`);
  const books: BibleBook[] = data.data.map((b: any) => ({
    id: b.id,
    name: b.name,
    nameLong: b.nameLong,
    abbreviation: b.abbreviation,
    testament: b.id <= 'MAL' ? 'OT' : 'NT',
  }));

  await setCache(cacheKey, books);
  return books;
}

// ─── Chapters ────────────────────────────────────────────────────────────────

export async function getChapters(bibleId: string, bookId: string): Promise<BibleChapter[]> {
  const cacheKey = `chapters_${bibleId}_${bookId}`;
  const cached = await getCached<BibleChapter[]>(cacheKey);
  if (cached) return cached;

  const { data } = await api.get(`/bibles/${bibleId}/books/${bookId}/chapters`);
  const chapters: BibleChapter[] = data.data.map((c: any) => ({
    id: c.id,
    bookId: c.bookId,
    number: c.number,
    reference: c.reference,
  }));

  await setCache(cacheKey, chapters);
  return chapters;
}

// ─── Verses ──────────────────────────────────────────────────────────────────

export async function getVerses(bibleId: string, chapterId: string): Promise<BibleVerse[]> {
  const cacheKey = `verses_${bibleId}_${chapterId}`;
  const cached = await getCached<BibleVerse[]>(cacheKey);
  if (cached) return cached;

  const { data } = await api.get(`/bibles/${bibleId}/chapters/${chapterId}/verses`);
  const verses: BibleVerse[] = data.data.map((v: any) => ({
    id: v.id,
    bookId: v.bookId,
    chapterId: v.chapterId,
    reference: v.reference,
    text: v.text ?? '',
  }));

  await setCache(cacheKey, verses);
  return verses;
}

// ─── Single verse ─────────────────────────────────────────────────────────────

export async function getVerse(bibleId: string, verseId: string): Promise<BibleVerse> {
  const cacheKey = `verse_${bibleId}_${verseId}`;
  const cached = await getCached<BibleVerse>(cacheKey);
  if (cached) return cached;

  const { data } = await api.get(`/bibles/${bibleId}/verses/${verseId}`, {
    params: { 'content-type': 'text', 'include-notes': false, 'include-titles': false },
  });

  const verse: BibleVerse = {
    id: data.data.id,
    bookId: data.data.bookId,
    chapterId: data.data.chapterId,
    reference: data.data.reference,
    text: data.data.content.replace(/<[^>]*>/g, '').trim(),
  };

  await setCache(cacheKey, verse);
  return verse;
}

// ─── Passage ──────────────────────────────────────────────────────────────────

export async function getPassage(bibleId: string, passageId: string): Promise<BiblePassage> {
  const cacheKey = `passage_${bibleId}_${passageId}`;
  const cached = await getCached<BiblePassage>(cacheKey);
  if (cached) return cached;

  const { data } = await api.get(`/bibles/${bibleId}/passages/${passageId}`, {
    params: { 'content-type': 'text', 'include-notes': false, 'include-titles': true },
  });

  const passage: BiblePassage = {
    id: data.data.id,
    reference: data.data.reference,
    content: data.data.content.replace(/<[^>]*>/g, '').trim(),
    copyright: data.data.copyright ?? '',
  };

  await setCache(cacheKey, passage);
  return passage;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchVerses(
  bibleId: string,
  query: string,
  limit = 20,
): Promise<BibleVerse[]> {
  const { data } = await api.get(`/bibles/${bibleId}/search`, {
    params: { query, limit, sort: 'relevance' },
  });

  return (data.data.verses ?? []).map((v: any) => ({
    id: v.id,
    bookId: v.bookId,
    chapterId: v.chapterId,
    reference: v.reference,
    text: v.text,
  }));
}

// ─── Available Bibles ─────────────────────────────────────────────────────────

export async function getAvailableBibles() {
  const { data } = await api.get('/bibles');
  return data.data;
}
