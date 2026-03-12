import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../hooks/useFavorites';
import { useLanguage } from '../hooks/useLanguage';
import { VerseCard } from '../components/VerseCard';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';
import type { FavoriteVerse } from '../types/bible';

export function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();
  const { t } = useLanguage();

  const handleRemove = (item: FavoriteVerse) => {
    Alert.alert(
      t('favorites.confirmRemove'),
      t('favorites.confirmRemoveMessage'),
      [
        { text: t('favorites.cancel'), style: 'cancel' },
        { text: t('favorites.confirm'), style: 'destructive', onPress: () => removeFavorite(item.id) },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('favorites.title')}</Text>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyText}>{t('favorites.empty')}</Text>
          <Text style={styles.emptyHint}>{t('favorites.emptyHint')}</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VerseCard
              text={item.text}
              reference={item.reference}
              onFavorite={() => handleRemove(item)}
              isFavorited
              fontSize={FONT_SIZES.base}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
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
  listContent: { paddingBottom: SPACING['3xl'] },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: SPACING.lg,
    color: COLORS.gold,
  },
  emptyText: {
    fontFamily: FONTS.playfairSemiBold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.foreground,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptyHint: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.sm,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
