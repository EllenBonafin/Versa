/**
 * widgetStorage.ts
 * Escreve o versículo do dia no armazenamento compartilhado
 * acessível pelos widgets nativos.
 *
 * iOS  : UserDefaults do App Group (group.com.versa.bible)
 *        via native bridge VersaWidgetBridge
 * Android : SharedPreferences "versa_widget_prefs"
 *        via native module VersaWidgetBridge
 */

import { NativeModules, Platform } from 'react-native';

const { VersaWidgetBridge } = NativeModules;

export async function updateWidgetVerse(text: string, reference: string): Promise<void> {
  // No Expo Go o módulo nativo não existe — ignora silenciosamente.
  // Em builds EAS (development/preview/production) o módulo está disponível.
  if (!VersaWidgetBridge?.setDailyVerse) return;

  try {
    await VersaWidgetBridge.setDailyVerse(text, reference);
  } catch (e) {
    // Não deve quebrar o app se o widget falhar
    console.warn('[widgetStorage] setDailyVerse falhou:', e);
  }
}
