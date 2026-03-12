import { useState, useEffect } from 'react';
import { getDailyVerse, getDailyGospel } from '../services/dailyContent';
import type { DailyVerse } from '../types/bible';

interface DailyGospel {
  reference: string;
  referenceEn: string;
  text: string;
  textEn: string;
  reflection: string;
  reflectionEn: string;
  date: string;
}

export function useDailyVerse() {
  const [verse, setVerse] = useState<DailyVerse | null>(null);
  const [gospel, setGospel] = useState<DailyGospel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        const [v, g] = await Promise.all([getDailyVerse(), getDailyGospel()]);
        if (!cancelled) {
          setVerse(v);
          setGospel(g);
        }
      } catch (e) {
        if (!cancelled) setError(e as Error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { verse, gospel, isLoading, error };
}
