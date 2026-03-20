import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDailyVerse } from '../hooks/useDailyVerse';
import { useLanguage } from '../hooks/useLanguage';
import { useFavorites } from '../hooks/useFavorites';
import { useShareVerse } from '../hooks/useShareVerse';
import { useSettings, FONT_SIZE_MAP } from '../store/SettingsContext';
import { VerseCard } from '../components/VerseCard';
import { ShareCard } from '../components/ShareCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';

export function DailyVerseScreen({ navigation }: any) {
  const { language, toggleLanguage, t } = useLanguage();
  const { verse, isLoading } = useDailyVerse();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { viewShotRef, shareAsImage, shareAsText } = useShareVerse();
  const { fontSize } = useSettings();
  const verseFontSize = FONT_SIZE_MAP[fontSize];

  const [showBilingual, setShowBilingual] = useState(false);
  const [shareMode, setShareMode] = useState<'image' | 'text' | null>(null);
  const [sharing, setSharing] = useState(false);

  const verseId = verse ? `daily_${verse.date}` : '';
  const favorited = isFavorite(verseId);

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

  const handleShareImage = async () => {
    setShareMode('image');
    // Aguarda o modal com o ShareCard renderizar antes de capturar
    setTimeout(async () => {
      try {
        setSharing(true);
        await shareAsImage();
      } catch {
        Alert.alert('Erro', 'Não foi possível gerar a imagem.');
      } finally {
        setSharing(false);
        setShareMode(null);
      }
    }, 400);
  };

  const handleShareText = async () => {
    if (!verse) return;
    await shareAsText(verse.text, verse.reference, verse.textEn, verse.referenceEn);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('dailyVerse.title')}</Text>
        <LanguageToggle language={language} onToggle={toggleLanguage} compact />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.gold} size="large" style={{ marginTop: SPACING.xl }} />
        ) : verse ? (
          <>
            <VerseCard
              text={verse.text}
              reference={verse.reference}
              textEn={verse.textEn}
              referenceEn={verse.referenceEn}
              showBilingual={showBilingual}
              fontSize={verseFontSize + 4}
              onFavorite={handleFavorite}
              isFavorited={favorited}
              variant="highlight"
            />

            {/* Toggle bilíngue */}
            <TouchableOpacity
              style={styles.bilingualToggle}
              onPress={() => setShowBilingual((v) => !v)}
            >
              <Text style={styles.bilingualText}>
                {showBilingual ? '− ' : '+ '}{t('dailyVerse.bilingual')}
              </Text>
            </TouchableOpacity>

            {/* Botões de compartilhamento */}
            <View style={styles.shareRow}>
              <TouchableOpacity style={styles.shareBtn} onPress={handleShareImage}>
                <Text style={styles.shareBtnIcon}>🖼</Text>
                <Text style={styles.shareBtnLabel}>Imagem</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareBtn} onPress={handleShareText}>
                <Text style={styles.shareBtnIcon}>✉</Text>
                <Text style={styles.shareBtnLabel}>Texto</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </ScrollView>

      {/* Modal oculto para captura do ShareCard como imagem */}
      <Modal visible={shareMode === 'image'} transparent animationType="none">
        <View style={styles.captureOverlay}>
          {sharing && (
            <ActivityIndicator color={COLORS.gold} size="large" style={styles.captureLoader} />
          )}
          {verse && (
            <ShareCard
              ref={viewShotRef}
              text={verse.text}
              reference={verse.reference}
              textEn={verse.textEn}
              referenceEn={verse.referenceEn}
              showBilingual={showBilingual}
            />
          )}
        </View>
      </Modal>
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
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  shareBtn: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  shareBtnIcon: { fontSize: FONT_SIZES.xl },
  shareBtnLabel: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.muted,
  },
  // Overlay de captura — posicionado fora da tela visível
  captureOverlay: {
    position: 'absolute',
    top: -2000,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureLoader: {
    position: 'absolute',
    top: 2040,  // volta à tela visível só o loader
    alignSelf: 'center',
  },
});
