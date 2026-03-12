import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDailyVerse } from '../hooks/useDailyVerse';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/LanguageToggle';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

export function GospelScreen({ navigation }: any) {
  const { language, toggleLanguage, t } = useLanguage();
  const { gospel, isLoading } = useDailyVerse();

  const text = language === 'pt' ? gospel?.text : gospel?.textEn;
  const reference = language === 'pt' ? gospel?.reference : gospel?.referenceEn;
  const reflection = language === 'pt' ? gospel?.reflection : gospel?.reflectionEn;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('gospel.title')}</Text>
        <LanguageToggle language={language} onToggle={toggleLanguage} compact />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {gospel && (
          <>
            {/* Reference badge */}
            <View style={styles.refBadge}>
              <Text style={styles.refText}>{reference}</Text>
            </View>

            {/* Passage */}
            <View style={styles.passageCard}>
              <Text style={styles.passageText}>{text}</Text>
            </View>

            {/* Reflection */}
            <View style={styles.reflectionCard}>
              <Text style={styles.reflectionLabel}>{t('gospel.reflection')}</Text>
              <View style={styles.goldBar} />
              <Text style={styles.reflectionText}>{reflection}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backBtn: { padding: SPACING.xs },
  backText: { fontSize: FONT_SIZES.xl, color: COLORS.foreground },
  title: {
    fontFamily: FONTS.playfairSemiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.foreground,
  },
  content: { padding: SPACING.lg, paddingBottom: SPACING['3xl'] },
  refBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.goldLight,
    borderRadius: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  refText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.goldDark,
    letterSpacing: 0.5,
  },
  passageCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passageText: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.lg,
    color: COLORS.foreground,
    lineHeight: 30,
  },
  reflectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reflectionLabel: {
    fontFamily: FONTS.playfairBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.foreground,
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  goldBar: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.gold,
    borderRadius: 1,
    marginBottom: SPACING.md,
  },
  reflectionText: {
    fontFamily: FONTS.loraItalic,
    fontSize: FONT_SIZES.base,
    color: COLORS.muted,
    lineHeight: 28,
  },
});
