/**
 * Stub para web — SQLite não está disponível no browser.
 * O app web usa AsyncStorage como fallback via bibleApi.ts.
 */

export async function initDatabase() {}

export async function isChapterCached() { return false; }

export async function getChapterFromDB() { return null; }

export async function saveChapterToDB() {}

export async function searchInDB() { return []; }

export interface DownloadStats {
  cachedChapters: number;
  totalChapters: number;
  percentComplete: number;
}

export async function getDownloadStats(): Promise<DownloadStats> {
  return { cachedChapters: 0, totalChapters: 1189, percentComplete: 0 };
}

export async function isBookFullyCached() { return false; }

export async function clearCache() {}
