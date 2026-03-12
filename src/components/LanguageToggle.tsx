import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';
import type { Language } from '../types/bible';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
  compact?: boolean;
}

export function LanguageToggle({ language, onToggle, compact = false }: LanguageToggleProps) {
  if (compact) {
    return (
      <TouchableOpacity onPress={onToggle} style={styles.compactBtn} accessibilityLabel="Toggle language">
        <Text style={styles.compactText}>{language.toUpperCase()}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => language !== 'pt' && onToggle()}
        style={[styles.option, language === 'pt' && styles.optionActive]}
      >
        <Text style={[styles.optionText, language === 'pt' && styles.optionTextActive]}>PT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => language !== 'en' && onToggle()}
        style={[styles.option, language === 'en' && styles.optionActive]}
      >
        <Text style={[styles.optionText, language === 'en' && styles.optionTextActive]}>EN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  option: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 17,
  },
  optionActive: {
    backgroundColor: COLORS.gold,
  },
  optionText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.muted,
    letterSpacing: 1,
  },
  optionTextActive: {
    color: COLORS.white,
  },
  compactBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  compactText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
});
