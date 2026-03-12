/**
 * SmallWidget — exibe apenas o versículo do dia.
 *
 * Para iOS usa WidgetKit via Expo Widgets (configuração nativa necessária).
 * Para Android usa Glance Widget.
 *
 * Este arquivo é um template de referência. A integração nativa real
 * requer ejecting do Expo Managed Workflow ou uso de expo-config-plugins.
 *
 * Referência: https://docs.expo.dev/versions/latest/sdk/task-manager/
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

interface SmallWidgetProps {
  verseText: string;
  reference: string;
}

// This renders a preview of how the widget will look.
// The actual widget is registered via native code / Expo Widgets.
export function SmallWidget({ verseText, reference }: SmallWidgetProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Versa</Text>
      <Text style={styles.quote} numberOfLines={4}>
        {verseText}
      </Text>
      <Text style={styles.reference}>{reference}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 155,
    height: 155,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: SPACING.md,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  brand: {
    fontFamily: FONTS.playfairBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gold,
    letterSpacing: 2,
  },
  quote: {
    fontFamily: FONTS.loraItalic,
    fontSize: 11,
    color: COLORS.foreground,
    lineHeight: 16,
    flex: 1,
    marginVertical: SPACING.xs,
  },
  reference: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
});
