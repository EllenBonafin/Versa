import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

// This component renders the card that gets captured and shared as an image.
// Use ViewShot (react-native-view-shot) to capture it.

interface ShareCardProps {
  text: string;
  reference: string;
  textEn?: string;
  referenceEn?: string;
  showBilingual?: boolean;
}

export function ShareCard({
  text,
  reference,
  textEn,
  referenceEn,
  showBilingual = false,
}: ShareCardProps) {
  return (
    <View style={styles.card}>
      {/* App branding */}
      <Text style={styles.brand}>Versa</Text>

      {/* Decorative divider */}
      <View style={styles.goldDivider} />

      {/* Quote mark */}
      <Text style={styles.quoteChar}>"</Text>

      {/* PT Verse */}
      <Text style={styles.verseText}>{text}</Text>
      <Text style={styles.reference}>{reference}</Text>

      {/* EN Verse (bilingual) */}
      {showBilingual && textEn && (
        <>
          <View style={styles.divider} />
          <Text style={styles.verseTextEn}>{textEn}</Text>
          {referenceEn && <Text style={styles.referenceEn}>{referenceEn}</Text>}
        </>
      )}

      {/* Footer */}
      <View style={styles.goldDivider} />
      <Text style={styles.footer}>versa.app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 360,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  brand: {
    fontFamily: FONTS.playfairBold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.gold,
    letterSpacing: 4,
    marginBottom: SPACING.md,
  },
  goldDivider: {
    width: 48,
    height: 2,
    backgroundColor: COLORS.gold,
    borderRadius: 1,
    marginVertical: SPACING.md,
  },
  quoteChar: {
    fontFamily: FONTS.playfairBold,
    fontSize: 80,
    color: COLORS.goldLight,
    lineHeight: 70,
    marginBottom: SPACING.sm,
  },
  verseText: {
    fontFamily: FONTS.playfairItalic,
    fontSize: FONT_SIZES.xl,
    color: COLORS.foreground,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: SPACING.md,
  },
  reference: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gold,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  verseTextEn: {
    fontFamily: FONTS.loraItalic,
    fontSize: FONT_SIZES.base,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING.sm,
  },
  referenceEn: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.xs,
    color: COLORS.mutedForeground,
    letterSpacing: 0.5,
  },
  footer: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.xs,
    color: COLORS.mutedForeground,
    letterSpacing: 2,
    marginTop: SPACING.sm,
  },
});
