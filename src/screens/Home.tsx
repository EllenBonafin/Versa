import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDailyVerse } from '../hooks/useDailyVerse';
import { useLanguage } from '../hooks/useLanguage';
import { useFavorites } from '../hooks/useFavorites';
import { DayWidget } from '../components/DayWidget';
import { VerseCard } from '../components/VerseCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

function getGreeting(t: (k: string) => string): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('home.greeting_morning');
  if (hour < 18) return t('home.greeting_afternoon');
  return t('home.greeting_evening');
}

export function HomeScreen({ navigation }: any) {
  const { language, toggleLanguage, t } = useLanguage();
  const { verse, gospel, isLoading } = useDailyVerse();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const verseId = verse ? `daily_${verse.date}` : '';
  const favorited = isFavorite(verseId);

  const handleShare = async () => {
    if (!verse) return;
    const text =
      language === 'pt'
        ? `"${verse.text}"\n— ${verse.reference}\n\nvia Versa`
        : `"${verse.textEn}"\n— ${verse.referenceEn}\n\nvia Versa`;
    await Share.share({ message: text });
  };

  const handleFavorite = () => {
    if (!verse) return;
    const fav = {
      id: verseId,
      reference: language === 'pt' ? verse.reference : (verse.referenceEn ?? verse.reference),
      text: language === 'pt' ? verse.text : (verse.textEn ?? verse.text),
      language,
    };
    if (favorited) {
      removeFavorite(verseId);
    } else {
      addFavorite(fav);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting(t)}</Text>
          <Text style={styles.appName}>Versa</Text>
        </View>
        <LanguageToggle language={language} onToggle={toggleLanguage} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Palavra do Dia ─────────────────────────────────── */}
        <Text style={styles.sectionTitle}>
          {t('home.dailyVerse')}
        </Text>

        {isLoading ? (
          <ActivityIndicator color={COLORS.gold} size="large" style={{ marginTop: SPACING.xl }} />
        ) : verse ? (
          <>
            <DayWidget
              title={t('home.dailyVerse')}
              verseText={language === 'pt' ? verse.text : (verse.textEn ?? verse.text)}
              reference={
                language === 'pt' ? verse.reference : (verse.referenceEn ?? verse.reference)
              }
              language={language}
              onPress={() => navigation?.navigate('DailyVerse')}
            />

            {/* Bilingual card */}
            {verse.textEn && (
              <VerseCard
                text={verse.text}
                reference={verse.reference}
                textEn={verse.textEn}
                referenceEn={verse.referenceEn}
                showBilingual
                onFavorite={handleFavorite}
                isFavorited={favorited}
                onShare={handleShare}
              />
            )}
          </>
        ) : null}

        {/* ── Evangelho do Dia ────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
          {t('home.gospel')}
        </Text>

        {gospel && (
          <TouchableOpacity
            style={styles.gospelCard}
            onPress={() => navigation?.navigate('Gospel')}
            activeOpacity={0.85}
          >
            <View style={styles.gospelHeader}>
              <Text style={styles.gospelLabel}>{t('gospel.subtitle')}</Text>
              <Text style={styles.gospelRef}>
                {language === 'pt' ? gospel.reference : gospel.referenceEn}
              </Text>
            </View>
            <Text style={styles.gospelText} numberOfLines={4}>
              {language === 'pt' ? gospel.text : gospel.textEn}
            </Text>
            <Text style={styles.readMore}>{t('home.readMore')} →</Text>
          </TouchableOpacity>
        )}

        {/* ── Quick actions ────────────────────────────────────── */}
        <View style={styles.actionsRow}>
          <QuickAction
            emoji="📖"
            label={t('nav.bible')}
            onPress={() => navigation?.navigate('Bible')}
          />
          <QuickAction
            emoji="♡"
            label={t('nav.favorites')}
            onPress={() => navigation?.navigate('Favorites')}
          />
          <QuickAction
            emoji="⚙"
            label={t('nav.settings')}
            onPress={() => navigation?.navigate('Settings')}
          />
        </View>

        <View style={{ height: SPACING['3xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  emoji,
  label,
  onPress,
}: {
  emoji: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.quickActionEmoji}>{emoji}</Text>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.sm,
    color: COLORS.muted,
    marginBottom: 2,
  },
  appName: {
    fontFamily: FONTS.playfairBold,
    fontSize: FONT_SIZES['3xl'],
    color: COLORS.foreground,
    letterSpacing: 1,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: SPACING.sm },
  sectionTitle: {
    fontFamily: FONTS.playfairSemiBold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.foreground,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    letterSpacing: 0.3,
  },
  gospelCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  gospelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  gospelLabel: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.xs,
    color: COLORS.muted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  gospelRef: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  gospelText: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.base,
    color: COLORS.foreground,
    lineHeight: 26,
    marginBottom: SPACING.md,
  },
  readMore: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.lg,
  },
  quickAction: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickActionEmoji: {
    fontSize: FONT_SIZES.xl,
    marginBottom: SPACING.xs,
  },
  quickActionLabel: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.xs,
    color: COLORS.muted,
  },
});
