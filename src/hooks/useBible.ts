import { useState, useCallback } from 'react';
import {
  getBooks,
  getChapters,
  getChapterVerses,
  searchVerses,
  DEFAULT_VERSION,
} from '../services/bibleApi';
import type { BibleBook, BibleChapter, BibleVerse } from '../types/bible';
import type { Language, BibleVersion } from '../types/bible';

export function useBible(language: Language = 'pt') {
  const [books] = useState<BibleBook[]>(() => getBooks(language));
  const [chapters, setChapters] = useState<BibleChapter[]>([]);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<BibleChapter | null>(null);
  const [version, setVersion] = useState<BibleVersion>(DEFAULT_VERSION[language]);

  const loadChapters = useCallback((book: BibleBook) => {
    setSelectedBook(book);
    setChapters(getChapters(book.id)); // síncrono, sem loading
  }, []);

  const loadVerses = useCallback(
    async (chapter: BibleChapter) => {
      setIsLoading(true);
      setError(null);
      setSelectedChapter(chapter);
      try {
        const chapterNumber = parseInt(chapter.number, 10);
        const data = await getChapterVerses(chapter.bookId, chapterNumber, version);
        setVerses(data);
      } catch {
        setError('Erro ao carregar versículos.');
      } finally {
        setIsLoading(false);
      }
    },
    [version],
  );

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchVerses(query, version);
        setSearchResults(data);
      } catch {
        setError('Busca falhou.');
      } finally {
        setIsLoading(false);
      }
    },
    [version],
  );

  return {
    books,
    chapters,
    verses,
    searchResults,
    isLoading,
    error,
    selectedBook,
    selectedChapter,
    version,
    setVersion,
    loadBooks: () => {}, // livros são estáticos, mantido para compatibilidade de interface
    loadChapters,
    loadVerses,
    search,
  };
}
