import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/LanguageToggle';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';
import type { BibleVersion } from '../types/bible';

const FONT_SIZE_KEY = 'versa_font_size';
const NOTIFICATION_KEY = 'versa_notification_enabled';
const NOTIFICATION_TIME_KEY = 'versa_notification_time';

const PT_VERSIONS: BibleVersion[] = ['NVI', 'ARC'];
const EN_VERSIONS: BibleVersion[] = ['NIV', 'ESV'];

export function SettingsScreen() {
  const { language, toggleLanguage, t } = useLanguage();
  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>('medium');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifTime, setNotifTime] = useState('08:00');
  const [bibleVersion, setBibleVersion] = useState<BibleVersion>(language === 'pt' ? 'NVI' : 'NIV');

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(FONT_SIZE_KEY),
      AsyncStorage.getItem(NOTIFICATION_KEY),
      AsyncStorage.getItem(NOTIFICATION_TIME_KEY),
    ]).then(([fs, notif, time]) => {
      if (fs) setFontSizeState(fs as any);
      if (notif) setNotifEnabled(notif === 'true');
      if (time) setNotifTime(time);
    });
  }, []);

  const handleFontSize = async (size: 'small' | 'medium' | 'large') => {
    setFontSizeState(size);
    await AsyncStorage.setItem(FONT_SIZE_KEY, size);
  };

  const handleNotifToggle = async (val: boolean) => {
    setNotifEnabled(val);
    await AsyncStorage.setItem(NOTIFICATION_KEY, String(val));
  };

  const versions = language === 'pt' ? PT_VERSIONS : EN_VERSIONS;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('settings.title')}</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language */}
        <SettingSection label={t('settings.language')} desc={t('settings.languageDesc')}>
          <LanguageToggle language={language} onToggle={toggleLanguage} />
        </SettingSection>

        {/* Bible version */}
        <SettingSection label={t('settings.bibleVersion')} desc={t('settings.bibleVersionDesc')}>
          <View style={styles.chipRow}>
            {versions.map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.chip, bibleVersion === v && styles.chipActive]}
                onPress={() => setBibleVersion(v)}
              >
                <Text style={[styles.chipText, bibleVersion === v && styles.chipTextActive]}>
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SettingSection>

        {/* Font size */}
        <SettingSection label={t('settings.fontSize')} desc={t('settings.fontSizeDesc')}>
          <View style={styles.chipRow}>
            {(['small', 'medium', 'large'] as const).map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.chip, fontSize === size && styles.chipActive]}
                onPress={() => handleFontSize(size)}
              >
                <Text style={[styles.chipText, fontSize === size && styles.chipTextActive]}>
                  {t(`settings.${size}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SettingSection>

        {/* Notifications */}
        <SettingSection label={t('settings.notificationEnabled')} desc={t('settings.notificationsDesc')}>
          <Switch
            value={notifEnabled}
            onValueChange={handleNotifToggle}
            trackColor={{ false: COLORS.border, true: COLORS.gold }}
            thumbColor={COLORS.white}
          />
        </SettingSection>

        {/* About */}
        <View style={styles.about}>
          <Text style={styles.aboutTitle}>Versa</Text>
          <Text style={styles.aboutVersion}>{t('settings.version')} 1.0.0</Text>
          <Text style={styles.aboutCredit}>
            Powered by API.Bible · Built with Expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingSection({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionLabels}>
        <Text style={styles.sectionLabel}>{label}</Text>
        <Text style={styles.sectionDesc}>{desc}</Text>
      </View>
      <View style={styles.sectionControl}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: {
    fontFamily: FONTS.playfairBold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.foreground,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
  },
  content: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING['3xl'] },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  sectionLabels: { flex: 1 },
  sectionLabel: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.foreground,
    marginBottom: 2,
  },
  sectionDesc: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.xs,
    color: COLORS.muted,
  },
  sectionControl: { alignItems: 'flex-end' },
  chipRow: { flexDirection: 'row', gap: SPACING.xs },
  chip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  chipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.muted,
  },
  chipTextActive: { color: COLORS.white },
  about: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  aboutTitle: {
    fontFamily: FONTS.playfairBold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.gold,
    letterSpacing: 4,
    marginBottom: SPACING.xs,
  },
  aboutVersion: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.sm,
    color: COLORS.muted,
    marginBottom: SPACING.xs,
  },
  aboutCredit: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.xs,
    color: COLORS.mutedForeground,
  },
});
