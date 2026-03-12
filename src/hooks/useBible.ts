import { useState, useCallback } from 'react';
import { getBooks, getChapters, getVerses, getVerse, searchVerses, BIBLE_VERSIONS } from '../services/bibleApi';
import type { BibleBook, BibleChapter, BibleVerse } from '../types/bible';
import type { Language, BibleVersion } from '../types/bible';

const VERSION_BY_LANG: Record<Language, BibleVersion> = {
  pt: 'NVI',
  en: 'NIV',
};

export function useBible(language: Language = 'pt') {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<BibleChapter[]>([]);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<BibleChapter | null>(null);
  const [version, setVersion] = useState<BibleVersion>(VERSION_BY_LANG[language]);

  const getBibleId = useCallback(() => BIBLE_VERSIONS[version], [version]);

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBooks(getBibleId());
      setBooks(data);
    } catch {
      setError('Failed to load books.');
    } finally {
      setIsLoading(false);
    }
  }, [getBibleId]);

  const loadChapters = useCallback(
    async (book: BibleBook) => {
      setIsLoading(true);
      setError(null);
      setSelectedBook(book);
      try {
        const data = await getChapters(getBibleId(), book.id);
        setChapters(data);
      } catch {
        setError('Failed to load chapters.');
      } finally {
        setIsLoading(false);
      }
    },
    [getBibleId],
  );

  const loadVerses = useCallback(
    async (chapter: BibleChapter) => {
      setIsLoading(true);
      setError(null);
      setSelectedChapter(chapter);
      try {
        const data = await getVerses(getBibleId(), chapter.id);
        setVerses(data);
      } catch {
        setError('Failed to load verses.');
      } finally {
        setIsLoading(false);
      }
    },
    [getBibleId],
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
        const data = await searchVerses(getBibleId(), query);
        setSearchResults(data);
      } catch {
        setError('Search failed.');
      } finally {
        setIsLoading(false);
      }
    },
    [getBibleId],
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
    loadBooks,
    loadChapters,
    loadVerses,
    search,
  };
}
