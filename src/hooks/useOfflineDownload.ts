import { useState, useCallback } from 'react';
import { downloadBook } from '../services/bibleApi';
import { getDownloadStats, type DownloadStats } from '../services/database';
import type { BibleVersion } from '../types/bible';
import { BIBLE_BOOKS } from '../constants/bibleBooks';

interface DownloadState {
  isDownloading: boolean;
  currentBook: string | null;
  bookProgress: number;   // 0-100 do livro atual
  totalStats: DownloadStats | null;
  error: string | null;
}

export function useOfflineDownload(version: BibleVersion) {
  const [state, setState] = useState<DownloadState>({
    isDownloading: false,
    currentBook: null,
    bookProgress: 0,
    totalStats: null,
    error: null,
  });

  const translationId = version === 'ARC' ? 'almeida' : version === 'WEB' ? 'web' : 'kjv';

  const refreshStats = useCallback(async () => {
    const stats = await getDownloadStats(translationId);
    setState((s) => ({ ...s, totalStats: stats }));
  }, [translationId]);

  // Baixa um livro específico
  const downloadSingleBook = useCallback(
    async (bookId: string) => {
      const book = BIBLE_BOOKS.find((b) => b.id === bookId);
      if (!book) return;

      setState((s) => ({ ...s, isDownloading: true, currentBook: book.namePt, error: null }));
      try {
        await downloadBook(bookId, version, (done, total) => {
          setState((s) => ({
            ...s,
            bookProgress: Math.round((done / total) * 100),
          }));
        });
        await refreshStats();
      } catch {
        setState((s) => ({ ...s, error: 'Erro ao baixar. Verifique sua conexão.' }));
      } finally {
        setState((s) => ({ ...s, isDownloading: false, currentBook: null, bookProgress: 0 }));
      }
    },
    [version, refreshStats],
  );

  // Baixa o Novo Testamento completo (27 livros)
  const downloadNewTestament = useCallback(async () => {
    const ntBooks = BIBLE_BOOKS.filter((b) => b.testament === 'NT');
    setState((s) => ({ ...s, isDownloading: true, error: null }));
    try {
      for (const book of ntBooks) {
        setState((s) => ({ ...s, currentBook: book.namePt, bookProgress: 0 }));
        await downloadBook(book.id, version, (done, total) => {
          setState((s) => ({ ...s, bookProgress: Math.round((done / total) * 100) }));
        });
      }
      await refreshStats();
    } catch {
      setState((s) => ({ ...s, error: 'Erro durante o download.' }));
    } finally {
      setState((s) => ({ ...s, isDownloading: false, currentBook: null, bookProgress: 0 }));
    }
  }, [version, refreshStats]);

  return {
    ...state,
    refreshStats,
    downloadSingleBook,
    downloadNewTestament,
  };
}
