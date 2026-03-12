import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDailyVerse } from '../hooks/useDailyVerse';
import { useLanguage } from '../hooks/useLanguage';
import { useFavorites } from '../hooks/useFavorites';
import { VerseCard } from '../components/VerseCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

export function DailyVerseScreen({ navigation }: any) {
  const { language, toggleLanguage, t } = useLanguage();
  const { verse, isLoading } = useDailyVerse();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [showBilingual, setShowBilingual] = useState(false);

  const verseId = verse ? `daily_${verse.date}` : '';
  const favorited = isFavorite(verseId);

  const handleShare = async () => {
    if (!verse) return;
    const shareText =
      language === 'pt'
        ? `"${verse.text}"\n— ${verse.reference}\n\nvia Versa`
        : `"${verse.textEn}"\n— ${verse.referenceEn}\n\nvia Versa`;
    await Share.share({ message: shareText });
  };

  const handleFavorite = () => {
    if (!verse) return;
    if (favorited) {
      removeFavorite(verseId);
    } else {
      addFavorite({
        id: verseId,
        reference: language === 'pt' ? verse.reference : (verse.referenceEn ?? verse.reference),
        text: language === 'pt' ? verse.text : (verse.textEn ?? verse.text),
        language,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('dailyVerse.title')}</Text>
        <LanguageToggle language={language} onToggle={toggleLanguage} compact />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {verse && (
          <VerseCard
            text={verse.text}
            reference={verse.reference}
            textEn={verse.textEn}
            referenceEn={verse.referenceEn}
            showBilingual={showBilingual}
            fontSize={FONT_SIZES.xl}
            onFavorite={handleFavorite}
            isFavorited={favorited}
            onShare={handleShare}
            variant="highlight"
          />
        )}

        <TouchableOpacity
          style={styles.bilingualToggle}
          onPress={() => setShowBilingual((v) => !v)}
        >
          <Text style={styles.bilingualText}>
            {showBilingual ? '− ' : '+ '}{t('dailyVerse.bilingual')}
          </Text>
        </TouchableOpacity>
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
  content: { paddingTop: SPACING.lg, paddingBottom: SPACING['3xl'] },
  bilingualToggle: {
    alignSelf: 'center',
    marginTop: SPACING.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  bilingualText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
});
