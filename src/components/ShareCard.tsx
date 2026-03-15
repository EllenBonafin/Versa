import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

interface ShareCardProps {
  text: string;
  reference: string;
  textEn?: string;
  referenceEn?: string;
  showBilingual?: boolean;
}

/**
 * Card estético para captura e compartilhamento como imagem.
 * Envolto em <ViewShot> para permitir captura via ref.
 *
 * Uso:
 *   const { viewShotRef, shareAsImage } = useShareVerse();
 *   <ShareCard ref={viewShotRef} ... />
 *   await shareAsImage();
 */
export const ShareCard = forwardRef<ViewShot, ShareCardProps>(
  ({ text, reference, textEn, referenceEn, showBilingual = false }, ref) => {
    return (
      <ViewShot
        ref={ref}
        options={{ format: 'png', quality: 1 }}
        style={styles.shot}
      >
        <View style={styles.card}>
          {/* Branding */}
          <Text style={styles.brand}>Versa</Text>
          <View style={styles.goldDivider} />

          {/* Quote mark decorativo */}
          <Text style={styles.quoteChar}>"</Text>

          {/* Versículo PT */}
          <Text style={styles.verseText}>{text}</Text>
          <Text style={styles.reference}>{reference}</Text>

          {/* Versículo EN (bilíngue) */}
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
      </ViewShot>
    );
  },
);

ShareCard.displayName = 'ShareCard';

const styles = StyleSheet.create({
  shot: {
    // ViewShot precisa de dimensões definidas para capturar corretamente
    alignSelf: 'center',
  },
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
