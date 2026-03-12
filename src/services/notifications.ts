import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getDailyVerse } from './dailyContent';

const NOTIFICATION_ID_KEY = 'versa_notification_id';
const NOTIFICATION_TIME_KEY = 'versa_notification_time';

// Configure how notifications are presented when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyVerseNotification(
  hour = 8,
  minute = 0,
): Promise<string | null> {
  const granted = await requestNotificationPermissions();
  if (!granted) return null;

  // Cancel previous scheduled notification
  await cancelDailyVerseNotification();

  // Get today's verse for the notification body
  const verse = await getDailyVerse();
  const body = `"${verse.text.slice(0, 120)}…" — ${verse.reference}`;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '✦ Versa · Palavra do Dia',
      body,
      sound: false,
      data: { type: 'daily_verse' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  await AsyncStorage.setItem(NOTIFICATION_ID_KEY, id);
  await AsyncStorage.setItem(NOTIFICATION_TIME_KEY, `${hour}:${String(minute).padStart(2, '0')}`);

  return id;
}

export async function cancelDailyVerseNotification(): Promise<void> {
  const id = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
  }
}

export async function getSavedNotificationTime(): Promise<{ hour: number; minute: number }> {
  const stored = await AsyncStorage.getItem(NOTIFICATION_TIME_KEY);
  if (stored) {
    const [h, m] = stored.split(':').map(Number);
    return { hour: h, minute: m };
  }
  return { hour: 8, minute: 0 };
}

// Add listener helpers for use in the root component
export function addNotificationResponseListener(
  handler: (response: Notifications.NotificationResponse) => void,
) {
  return Notifications.addNotificationResponseReceivedListener(handler);
}
