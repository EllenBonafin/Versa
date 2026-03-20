import './global.css';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  useFonts as useLoraFonts,
  Lora_400Regular,
  Lora_400Regular_Italic,
  Lora_500Medium,
  Lora_600SemiBold,
} from '@expo-google-fonts/lora';

import { HomeScreen } from './src/screens/Home';
import { BibleScreen } from './src/screens/Bible';
import { DailyVerseScreen } from './src/screens/DailyVerse';
import { GospelScreen } from './src/screens/Gospel';
import { FavoritesScreen } from './src/screens/Favorites';
import { SettingsScreen } from './src/screens/Settings';
import { addNotificationResponseListener } from './src/services/notifications';
import { SettingsProvider } from './src/store/SettingsContext';
import { initDatabase } from './src/services/database';
import { COLORS, FONTS, FONT_SIZES } from './src/constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '✦',
    Bible: '📖',
    Favorites: '♡',
    Settings: '⚙',
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: focused ? COLORS.gold : 'transparent',
          marginBottom: 2,
        }}
      />
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.lora,
          fontSize: FONT_SIZES.xs,
          letterSpacing: 0.3,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.muted,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Bible" component={BibleScreen} options={{ title: 'Bíblia' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Config.' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [playfairLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  const [loraLoaded] = useLoraFonts({
    Lora_400Regular,
    Lora_400Regular_Italic,
    Lora_500Medium,
    Lora_600SemiBold,
  });

  useEffect(() => {
    initDatabase().catch(console.warn);
  }, []);

  useEffect(() => {
    const sub = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      // Navigate to daily verse when tapping notification
      // (navigation ref would be needed for deep linking)
    });
    return () => sub.remove();
  }, []);

  if (!playfairLoaded || !loraLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="DailyVerse"
            component={DailyVerseScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="Gospel"
            component={GospelScreen}
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
