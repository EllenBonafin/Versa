/**
 * MediumWidget — versículo + referência + botão para abrir o app.
 * Preview component. Integração nativa via expo-config-plugins / bare workflow.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

interface MediumWidgetProps {
  verseText: string;
  reference: string;
  onOpen?: () => void;
  openLabel?: string;
}

export function MediumWidget({
  verseText,
  reference,
  onOpen,
  openLabel = 'Abrir Versa',
}: MediumWidgetProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>Versa</Text>
        <View style={styles.dot} />
        <Text style={styles.label}>Palavra do Dia</Text>
      </View>

      {/* Verse */}
      <Text style={styles.quote} numberOfLines={5}>
        "{verseText}"
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.reference}>{reference}</Text>
        {onOpen && (
          <TouchableOpacity style={styles.openBtn} onPress={onOpen}>
            <Text style={styles.openText}>{openLabel} →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 329,
    height: 155,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: SPACING.md,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  brand: {
    fontFamily: FONTS.playfairBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gold,
    letterSpacing: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.goldLight,
  },
  label: {
    fontFamily: FONTS.lora,
    fontSize: 10,
    color: COLORS.muted,
    letterSpacing: 0.5,
  },
  quote: {
    fontFamily: FONTS.loraItalic,
    fontSize: 12,
    color: COLORS.foreground,
    lineHeight: 18,
    flex: 1,
    marginVertical: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reference: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  openBtn: {
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: 8,
  },
  openText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: 10,
    color: COLORS.goldDark,
  },
});
