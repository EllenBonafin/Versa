/**
 * bibleApi.ts — cliente para bible-api.com
 *
 * Base URL : https://bible-api.com
 * Sem autenticação, rate limit de 15 req/30s por IP.
 *
 * Traduções disponíveis:
 *   PT → almeida  (João Ferreira de Almeida)
 *   EN → web      (World English Bible)
 *   EN → kjv      (King James Version)
 *
 * Futuramente pode ser trocado pela API.Bible sem alterar os hooks —
 * basta atualizar as funções aqui mantendo as mesmas assinaturas.
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BIBLE_BOOKS, type BookMeta } from '../constants/bibleBooks';
import type { BibleBook, BibleChapter, BibleVerse, BiblePassage } from '../types/bible';
import type { Language, BibleVersion } from '../types/bible';

const BASE_URL = 'https://bible-api.com';
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days (conteúdo bíblico não muda)

// Mapeamento das versões do app → translation ID da API
export const TRANSLATION_ID: Record<BibleVersion, string> = {
  ARC: 'almeida',
  WEB: 'web',
  KJV: 'kjv',
};

export const DEFAULT_VERSION: Record<Language, BibleVersion> = {
  pt: 'ARC',
  en: 'WEB',
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ─── Cache helpers ────────────────────────────────────────────────────────────

async function getCached<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(`bcache_${key}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: T; ts: number };
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

async function setCache<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(`bcache_${key}`, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // cache é best-effort
  }
}

// ─── Books (lista estática — não precisa de chamada API) ──────────────────────

export function getBooks(language: Language): BibleBook[] {
  return BIBLE_BOOKS.map((b: BookMeta) => ({
    id: b.id,
    name: language === 'pt' ? b.namePt : b.nameEn,
    nameLong: language === 'pt' ? b.namePt : b.nameEn,
    abbreviation: b.id,
    testament: b.testament,
  }));
}

// ─── Chapters (gerado a partir dos metadados estáticos) ───────────────────────

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

// ─── Chapter content (versículos de um capítulo inteiro) ──────────────────────

export async function getChapterVerses(
  bookId: string,
  chapter: number,
  version: BibleVersion = 'ARC',
): Promise<BibleVerse[]> {
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) throw new Error(`Book not found: ${bookId}`);

  const translation = TRANSLATION_ID[version];
  const cacheKey = `chapter_${bookId}_${chapter}_${translation}`;
  const cached = await getCached<BibleVerse[]>(cacheKey);
  if (cached) return cached;

  // Usa a rota /data/{translation}/{BOOK_ID}/{chapter} — mais confiável
  const { data } = await api.get(`/data/${translation}/${bookId}/${chapter}`);

  const bookName = version === 'ARC'
    ? data.verses[0]?.book ?? book.namePt
    : data.verses[0]?.book ?? book.nameEn;

  const verses: BibleVerse[] = data.verses.map((v: any) => ({
    id: `${bookId}.${chapter}.${v.verse}`,
    bookId,
    chapterId: `${bookId}.${chapter}`,
    reference: `${bookName} ${chapter}:${v.verse}`,
    text: v.text.replace(/\u00a0/g, '').trim(),
  }));

  await setCache(cacheKey, verses);
  return verses;
}

// ─── Single verse ─────────────────────────────────────────────────────────────

export async function getVerse(
  bookId: string,
  chapter: number,
  verse: number,
  version: BibleVersion = 'ARC',
): Promise<BibleVerse> {
  // Reutiliza o capítulo cacheado para evitar chamadas extras
  const chapterVerses = await getChapterVerses(bookId, chapter, version);
  const found = chapterVerses.find((v) => v.id === `${bookId}.${chapter}.${verse}`);
  if (found) return found;

  // Fallback: busca direta pelo versículo
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) throw new Error(`Book not found: ${bookId}`);

  const translation = TRANSLATION_ID[version];
  const { data } = await api.get(`/${book.apiName}+${chapter}:${verse}`, {
    params: { translation },
  });

  return {
    id: `${bookId}.${chapter}.${verse}`,
    bookId,
    chapterId: `${bookId}.${chapter}`,
    reference: data.reference,
    text: data.text.replace(/\u00a0/g, '').trim(),
  };
}

// ─── Passage (range de versículos) ───────────────────────────────────────────

export async function getPassage(
  bookId: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  version: BibleVersion = 'ARC',
): Promise<BiblePassage> {
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) throw new Error(`Book not found: ${bookId}`);

  const translation = TRANSLATION_ID[version];
  const cacheKey = `passage_${bookId}_${chapter}_${verseStart}_${verseEnd}_${translation}`;
  const cached = await getCached<BiblePassage>(cacheKey);
  if (cached) return cached;

  const { data } = await api.get(`/${book.apiName}+${chapter}:${verseStart}-${verseEnd}`, {
    params: { translation },
  });

  const passage: BiblePassage = {
    id: `${bookId}.${chapter}.${verseStart}-${verseEnd}`,
    reference: data.reference,
    content: data.text.trim(),
    copyright: data.translation_note ?? '',
  };

  await setCache(cacheKey, passage);
  return passage;
}

// ─── Random verse ─────────────────────────────────────────────────────────────

export async function getRandomVerse(version: BibleVersion = 'ARC'): Promise<BibleVerse> {
  const translation = TRANSLATION_ID[version];
  const { data } = await api.get(`/data/${translation}/random`);

  const book = BIBLE_BOOKS.find(
    (b) => b.nameEn.toLowerCase() === (data.verses?.[0]?.book_name ?? '').toLowerCase(),
  );

  return {
    id: `random_${Date.now()}`,
    bookId: book?.id ?? '',
    chapterId: '',
    reference: data.reference,
    text: data.text.trim(),
  };
}

// ─── Search (client-side sobre o capítulo já carregado) ──────────────────────
// bible-api.com não tem endpoint de busca — a busca full-text será implementada
// via SQLite local em uma etapa futura. Por ora retorna array vazio com aviso.

export async function searchVerses(
  _query: string,
  _version: BibleVersion = 'ARC',
): Promise<BibleVerse[]> {
  // TODO: implementar busca offline via Expo SQLite
  return [];
}
