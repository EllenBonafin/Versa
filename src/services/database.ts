/**
 * database.ts — camada SQLite para cache offline da Bíblia
 *
 * Schema:
 *   verses  — versículos cacheados por versão
 *   meta    — controle de download por capítulo
 *
 * Estratégia:
 *   1. Leitura: SQLite primeiro → rede como fallback
 *   2. Escrita: toda resposta da rede vai para o SQLite
 *   3. Busca:   full-text via LIKE (simples e sem dependência extra)
 */

import * as SQLite from 'expo-sqlite';

const DB_NAME = 'versa.db';
const DB_VERSION = 1;

let _db: SQLite.SQLiteDatabase | null = null;

// ─── Init ────────────────────────────────────────────────────────────────────

export async function initDatabase(): Promise<void> {
  if (_db) return;

  _db = await SQLite.openDatabaseAsync(DB_NAME);

  await _db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;

    CREATE TABLE IF NOT EXISTS verses (
      id           TEXT    NOT NULL,
      book_id      TEXT    NOT NULL,
      chapter      INTEGER NOT NULL,
      verse_number INTEGER NOT NULL,
      reference    TEXT    NOT NULL,
      text         TEXT    NOT NULL,
      version      TEXT    NOT NULL,
      cached_at    INTEGER NOT NULL DEFAULT (unixepoch()),
      PRIMARY KEY (id, version)
    );

    CREATE INDEX IF NOT EXISTS idx_v_book_ch_ver
      ON verses (book_id, chapter, version);

    CREATE INDEX IF NOT EXISTS idx_v_text
      ON verses (text);

    CREATE TABLE IF NOT EXISTS chapter_meta (
      book_id   TEXT    NOT NULL,
      chapter   INTEGER NOT NULL,
      version   TEXT    NOT NULL,
      cached_at INTEGER NOT NULL DEFAULT (unixepoch()),
      PRIMARY KEY (book_id, chapter, version)
    );
  `);
}

function db(): SQLite.SQLiteDatabase {
  if (!_db) throw new Error('Database not initialized. Call initDatabase() first.');
  return _db;
}

// ─── Chapter cache ────────────────────────────────────────────────────────────

export async function isChapterCached(
  bookId: string,
  chapter: number,
  version: string,
): Promise<boolean> {
  const row = await db().getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM chapter_meta WHERE book_id=? AND chapter=? AND version=?',
    [bookId, chapter, version],
  );
  return (row?.count ?? 0) > 0;
}

export async function getChapterFromDB(
  bookId: string,
  chapter: number,
  version: string,
) {
  const rows = await db().getAllAsync<{
    id: string;
    book_id: string;
    chapter: number;
    verse_number: number;
    reference: string;
    text: string;
  }>(
    `SELECT id, book_id, chapter, verse_number, reference, text
     FROM verses
     WHERE book_id=? AND chapter=? AND version=?
     ORDER BY verse_number ASC`,
    [bookId, chapter, version],
  );

  if (rows.length === 0) return null;

  return rows.map((r) => ({
    id: r.id,
    bookId: r.book_id,
    chapterId: `${r.book_id}.${r.chapter}`,
    reference: r.reference,
    text: r.text,
  }));
}

export async function saveChapterToDB(
  verses: Array<{
    id: string;
    bookId: string;
    chapterId: string;
    reference: string;
    text: string;
  }>,
  chapter: number,
  version: string,
): Promise<void> {
  if (verses.length === 0) return;

  await db().withTransactionAsync(async () => {
    for (const v of verses) {
      const verseNumber = parseInt(v.id.split('.')[2], 10);
      await db().runAsync(
        `INSERT OR REPLACE INTO verses
           (id, book_id, chapter, verse_number, reference, text, version)
         VALUES (?,?,?,?,?,?,?)`,
        [v.id, v.bookId, chapter, verseNumber, v.reference, v.text, version],
      );
    }

    await db().runAsync(
      `INSERT OR REPLACE INTO chapter_meta (book_id, chapter, version)
       VALUES (?,?,?)`,
      [verses[0].bookId, chapter, version],
    );
  });
}

// ─── Full-text search ─────────────────────────────────────────────────────────

export async function searchInDB(
  query: string,
  version: string,
  limit = 30,
) {
  if (!query.trim()) return [];

  // Quebra a query em termos e cria cláusulas LIKE para cada um
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (terms.length === 0) return [];

  const conditions = terms.map(() => 'LOWER(text) LIKE ?').join(' AND ');
  const params: string[] = [
    ...terms.map((t) => `%${t}%`),
    version,
    String(limit),
  ];

  const rows = await db().getAllAsync<{
    id: string;
    book_id: string;
    chapter: number;
    verse_number: number;
    reference: string;
    text: string;
  }>(
    `SELECT id, book_id, chapter, verse_number, reference, text
     FROM verses
     WHERE ${conditions} AND version=?
     ORDER BY book_id, chapter, verse_number
     LIMIT ?`,
    params,
  );

  return rows.map((r) => ({
    id: r.id,
    bookId: r.book_id,
    chapterId: `${r.book_id}.${r.chapter}`,
    reference: r.reference,
    text: r.text,
  }));
}

// ─── Download stats ───────────────────────────────────────────────────────────

export interface DownloadStats {
  cachedChapters: number;
  totalChapters: number;
  percentComplete: number;
}

export async function getDownloadStats(version: string): Promise<DownloadStats> {
  // Total canônico: 1189 capítulos (66 livros)
  const TOTAL = 1189;

  const row = await db().getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM chapter_meta WHERE version=?',
    [version],
  );
  const cached = row?.count ?? 0;

  return {
    cachedChapters: cached,
    totalChapters: TOTAL,
    percentComplete: Math.round((cached / TOTAL) * 100),
  };
}

// ─── Background download de um livro inteiro ─────────────────────────────────

export async function isBookFullyCached(bookId: string, totalChapters: number, version: string): Promise<boolean> {
  const row = await db().getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM chapter_meta WHERE book_id=? AND version=?',
    [bookId, version],
  );
  return (row?.count ?? 0) >= totalChapters;
}

// ─── Clear cache ──────────────────────────────────────────────────────────────

export async function clearCache(version?: string): Promise<void> {
  if (version) {
    await db().runAsync('DELETE FROM verses WHERE version=?', [version]);
    await db().runAsync('DELETE FROM chapter_meta WHERE version=?', [version]);
  } else {
    await db().runAsync('DELETE FROM verses', []);
    await db().runAsync('DELETE FROM chapter_meta', []);
  }
}
