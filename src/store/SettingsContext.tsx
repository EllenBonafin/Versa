import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  scheduleDailyVerseNotification,
  cancelDailyVerseNotification,
  requestNotificationPermissions,
} from '../services/notifications';
import type { BibleVersion, Language } from '../types/bible';

export type FontSizeKey = 'small' | 'medium' | 'large';

export const FONT_SIZE_MAP: Record<FontSizeKey, number> = {
  small: 14,
  medium: 17,
  large: 21,
};

interface Settings {
  fontSize: FontSizeKey;
  bibleVersion: BibleVersion;
  notifEnabled: boolean;
  notifHour: number;
  notifMinute: number;
}

interface SettingsContextValue extends Settings {
  isLoaded: boolean;
  setFontSize: (size: FontSizeKey) => Promise<void>;
  setBibleVersion: (v: BibleVersion) => Promise<void>;
  setNotifEnabled: (enabled: boolean) => Promise<void>;
  setNotifTime: (hour: number, minute: number) => Promise<void>;
}

const DEFAULTS: Settings = {
  fontSize: 'medium',
  bibleVersion: 'ARC',
  notifEnabled: false,
  notifHour: 8,
  notifMinute: 0,
};

const KEYS = {
  fontSize: 'versa_font_size',
  bibleVersion: 'versa_bible_version',
  notifEnabled: 'versa_notif_enabled',
  notifHour: 'versa_notif_hour',
  notifMinute: 'versa_notif_minute',
};

const SettingsContext = createContext<SettingsContextValue>({
  ...DEFAULTS,
  isLoaded: false,
  setFontSize: async () => {},
  setBibleVersion: async () => {},
  setNotifEnabled: async () => {},
  setNotifTime: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega todas as preferências do AsyncStorage na inicialização
  useEffect(() => {
    async function load() {
      const [fs, bv, ne, nh, nm] = await Promise.all([
        AsyncStorage.getItem(KEYS.fontSize),
        AsyncStorage.getItem(KEYS.bibleVersion),
        AsyncStorage.getItem(KEYS.notifEnabled),
        AsyncStorage.getItem(KEYS.notifHour),
        AsyncStorage.getItem(KEYS.notifMinute),
      ]);
      setSettings({
        fontSize: (fs as FontSizeKey) ?? DEFAULTS.fontSize,
        bibleVersion: (bv as BibleVersion) ?? DEFAULTS.bibleVersion,
        notifEnabled: ne === 'true',
        notifHour: nh ? parseInt(nh, 10) : DEFAULTS.notifHour,
        notifMinute: nm ? parseInt(nm, 10) : DEFAULTS.notifMinute,
      });
      setIsLoaded(true);
    }
    load();
  }, []);

  const setFontSize = useCallback(async (size: FontSizeKey) => {
    setSettings((s) => ({ ...s, fontSize: size }));
    await AsyncStorage.setItem(KEYS.fontSize, size);
  }, []);

  const setBibleVersion = useCallback(async (v: BibleVersion) => {
    setSettings((s) => ({ ...s, bibleVersion: v }));
    await AsyncStorage.setItem(KEYS.bibleVersion, v);
  }, []);

  const setNotifEnabled = useCallback(async (enabled: boolean) => {
    setSettings((s) => ({ ...s, notifEnabled: enabled }));
    await AsyncStorage.setItem(KEYS.notifEnabled, String(enabled));

    if (enabled) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleDailyVerseNotification(settings.notifHour, settings.notifMinute);
      } else {
        // Permissão negada — reverte o toggle
        setSettings((s) => ({ ...s, notifEnabled: false }));
        await AsyncStorage.setItem(KEYS.notifEnabled, 'false');
      }
    } else {
      await cancelDailyVerseNotification();
    }
  }, [settings.notifHour, settings.notifMinute]);

  const setNotifTime = useCallback(async (hour: number, minute: number) => {
    setSettings((s) => ({ ...s, notifHour: hour, notifMinute: minute }));
    await AsyncStorage.setItem(KEYS.notifHour, String(hour));
    await AsyncStorage.setItem(KEYS.notifMinute, String(minute));

    // Reagenda se estiver ativo
    if (settings.notifEnabled) {
      await scheduleDailyVerseNotification(hour, minute);
    }
  }, [settings.notifEnabled]);

  return (
    <SettingsContext.Provider
      value={{ ...settings, isLoaded, setFontSize, setBibleVersion, setNotifEnabled, setNotifTime }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
