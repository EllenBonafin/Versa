import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';
import type { Language } from '../types/bible';

interface DayWidgetProps {
  title: string;
  verseText: string;
  reference: string;
  language: Language;
  onPress?: () => void;
}

export function DayWidget({ title, verseText, reference, language, onPress }: DayWidgetProps) {
  const today = format(new Date(), 'EEEE, d MMMM', {
    locale: language === 'pt' ? ptBR : undefined,
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{today}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{title}</Text>
        </View>
      </View>

      {/* Decorative quote mark */}
      <Text style={styles.quoteChar}>"</Text>

      {/* Verse */}
      <Text style={styles.verseText} numberOfLines={6}>
        {verseText}
      </Text>

      {/* Reference */}
      <Text style={styles.referenceText}>— {reference}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    shadowColor: COLORS.foreground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dateText: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.sm,
    color: COLORS.muted,
    textTransform: 'capitalize',
  },
  badge: {
    backgroundColor: COLORS.goldLight,
    borderRadius: 10,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: 10,
    color: COLORS.goldDark,
    letterSpacing: 0.5,
  },
  quoteChar: {
    fontFamily: FONTS.playfairBold,
    fontSize: 72,
    color: COLORS.goldLight,
    lineHeight: 60,
    marginBottom: -SPACING.sm,
  },
  verseText: {
    fontFamily: FONTS.loraItalic,
    fontSize: FONT_SIZES.lg,
    color: COLORS.foreground,
    lineHeight: 30,
    marginBottom: SPACING.md,
  },
  referenceText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
});
