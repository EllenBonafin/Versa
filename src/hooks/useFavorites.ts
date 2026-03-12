import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FavoriteVerse } from '../types/bible';

const STORAGE_KEY = 'versa_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setFavorites(JSON.parse(raw));
    });
  }, []);

  const persist = useCallback(async (list: FavoriteVerse[]) => {
    setFavorites(list);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, []);

  const addFavorite = useCallback(
    async (verse: Omit<FavoriteVerse, 'savedAt'>) => {
      const exists = favorites.some((f) => f.id === verse.id);
      if (exists) return;
      const newList = [
        { ...verse, savedAt: new Date().toISOString() },
        ...favorites,
      ];
      await persist(newList);
    },
    [favorites, persist],
  );

  const removeFavorite = useCallback(
    async (id: string) => {
      const newList = favorites.filter((f) => f.id !== id);
      await persist(newList);
    },
    [favorites, persist],
  );

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites],
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
