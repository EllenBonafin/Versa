import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

interface VerseCardProps {
  text: string;
  reference: string;
  textEn?: string;
  referenceEn?: string;
  showBilingual?: boolean;
  fontSize?: number;
  onFavorite?: () => void;
  isFavorited?: boolean;
  onShare?: () => void;
  variant?: 'default' | 'highlight' | 'minimal';
}

export function VerseCard({
  text,
  reference,
  textEn,
  referenceEn,
  showBilingual = false,
  fontSize = FONT_SIZES.lg,
  onFavorite,
  isFavorited = false,
  onShare,
  variant = 'default',
}: VerseCardProps) {
  const isHighlight = variant === 'highlight';
  const isMinimal = variant === 'minimal';

  return (
    <View
      style={[
        styles.card,
        isHighlight && styles.cardHighlight,
        isMinimal && styles.cardMinimal,
      ]}
    >
      {/* Gold accent bar */}
      {!isMinimal && <View style={styles.accentBar} />}

      {/* Verse text PT */}
      <Text
        style={[
          styles.verseText,
          { fontSize },
          isHighlight && styles.verseTextHighlight,
        ]}
      >
        {text}
      </Text>

      {/* Reference PT */}
      <Text
        style={[
          styles.reference,
          isHighlight && styles.referenceHighlight,
        ]}
      >
        — {reference}
      </Text>

      {/* Bilingual divider + EN text */}
      {showBilingual && textEn && (
        <>
          <View style={styles.divider} />
          <Text style={[styles.verseText, styles.verseTextEn, { fontSize: fontSize - 2 }]}>
            {textEn}
          </Text>
          {referenceEn && (
            <Text style={[styles.reference, styles.referenceEn]}>
              — {referenceEn}
            </Text>
          )}
        </>
      )}

      {/* Actions */}
      {(onFavorite || onShare) && (
        <View style={styles.actions}>
          {onShare && (
            <TouchableOpacity
              onPress={onShare}
              style={styles.actionBtn}
              accessibilityLabel="Share verse"
            >
              <Text style={styles.actionText}>↗</Text>
            </TouchableOpacity>
          )}
          {onFavorite && (
            <TouchableOpacity
              onPress={onFavorite}
              style={styles.actionBtn}
              accessibilityLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Text style={[styles.actionText, isFavorited && styles.actionTextActive]}>
                {isFavorited ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    shadowColor: COLORS.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHighlight: {
    backgroundColor: COLORS.gold,
    paddingVertical: SPACING.xl,
  },
  cardMinimal: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    paddingHorizontal: 0,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: SPACING.lg,
    bottom: SPACING.lg,
    width: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  verseText: {
    fontFamily: FONTS.loraItalic,
    color: COLORS.foreground,
    lineHeight: 30,
    marginLeft: SPACING.sm,
  },
  verseTextHighlight: {
    color: COLORS.white,
    fontFamily: FONTS.playfairItalic,
    lineHeight: 34,
    marginLeft: 0,
    textAlign: 'center',
  },
  verseTextEn: {
    color: COLORS.muted,
    fontFamily: FONTS.lora,
    marginTop: SPACING.xs,
  },
  reference: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gold,
    marginTop: SPACING.md,
    marginLeft: SPACING.sm,
    letterSpacing: 0.5,
  },
  referenceHighlight: {
    color: COLORS.goldLight,
    textAlign: 'center',
    marginLeft: 0,
  },
  referenceEn: {
    color: COLORS.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  actionBtn: {
    padding: SPACING.xs,
    borderRadius: 20,
  },
  actionText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.muted,
  },
  actionTextActive: {
    color: COLORS.gold,
  },
});
