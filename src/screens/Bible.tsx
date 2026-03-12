import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../hooks/useLanguage';
import { useBible } from '../hooks/useBible';
import { useFavorites } from '../hooks/useFavorites';
import { VerseCard } from '../components/VerseCard';
import { LanguageToggle } from '../components/LanguageToggle';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';
import type { BibleBook, BibleChapter, BibleVerse } from '../types/bible';

type Step = 'books' | 'chapters' | 'verses' | 'search';

export function BibleScreen({ navigation }: any) {
  const { language, toggleLanguage, t } = useLanguage();
  const bible = useBible(language);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [step, setStep] = useState<Step>('books');
  const [query, setQuery] = useState('');

  useEffect(() => {
    bible.loadBooks();
  }, [language]);

  const handleBookPress = (book: BibleBook) => {
    bible.loadChapters(book);
    setStep('chapters');
  };

  const handleChapterPress = (chapter: BibleChapter) => {
    bible.loadVerses(chapter);
    setStep('verses');
  };

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      setStep('search');
      bible.search(text);
    } else if (text.length === 0) {
      setStep('books');
    }
  };

  const goBack = () => {
    if (step === 'verses') setStep('chapters');
    else if (step === 'chapters') setStep('books');
    else if (step === 'search') { setQuery(''); setStep('books'); }
    else navigation?.goBack();
  };

  const renderBreadcrumb = () => (
    <View style={styles.breadcrumb}>
      <TouchableOpacity onPress={goBack}>
        <Text style={styles.breadcrumbBack}>←</Text>
      </TouchableOpacity>
      <Text style={styles.breadcrumbText}>
        {step === 'books' && t('bible.title')}
        {step === 'chapters' && bible.selectedBook?.name}
        {step === 'verses' && `${bible.selectedBook?.name} ${bible.selectedChapter?.number}`}
        {step === 'search' && t('bible.searchResults')}
      </Text>
    </View>
  );

  const renderVerse = ({ item }: { item: BibleVerse }) => {
    const fav = isFavorite(item.id);
    return (
      <VerseCard
        text={item.text}
        reference={item.reference}
        onFavorite={() => {
          if (fav) removeFavorite(item.id);
          else addFavorite({ id: item.id, reference: item.reference, text: item.text, language });
        }}
        isFavorited={fav}
        variant="minimal"
        fontSize={FONT_SIZES.base}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {renderBreadcrumb()}
        <LanguageToggle language={language} onToggle={toggleLanguage} compact />
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('bible.search')}
          placeholderTextColor={COLORS.mutedForeground}
          value={query}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
      </View>

      {/* Content */}
      {bible.isLoading ? (
        <ActivityIndicator color={COLORS.gold} size="large" style={{ marginTop: SPACING.xl }} />
      ) : bible.error ? (
        <View style={styles.errorView}>
          <Text style={styles.errorText}>{t('bible.error')}</Text>
          <TouchableOpacity onPress={bible.loadBooks}>
            <Text style={styles.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : step === 'books' ? (
        <FlatList
          data={bible.books}
          keyExtractor={(b) => b.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listItem} onPress={() => handleBookPress(item)}>
              <Text style={styles.listItemText}>{item.name}</Text>
              <Text style={styles.listItemChevron}>›</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      ) : step === 'chapters' ? (
        <FlatList
          data={bible.chapters}
          keyExtractor={(c) => c.id}
          numColumns={5}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chapterBtn}
              onPress={() => handleChapterPress(item)}
            >
              <Text style={styles.chapterText}>{item.number}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chaptersGrid}
        />
      ) : (step === 'verses' || step === 'search') ? (
        <FlatList
          data={step === 'verses' ? bible.verses : bible.searchResults}
          keyExtractor={(v) => v.id}
          renderItem={renderVerse}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('bible.noResults')}</Text>
          }
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  breadcrumb: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  breadcrumbBack: { fontSize: FONT_SIZES.xl, color: COLORS.foreground, paddingRight: SPACING.xs },
  breadcrumbText: {
    fontFamily: FONTS.playfairSemiBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.foreground,
  },
  searchContainer: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.base,
    color: COLORS.foreground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listContent: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  listItemText: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.base,
    color: COLORS.foreground,
  },
  listItemChevron: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.muted,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.sm,
  },
  chaptersGrid: { padding: SPACING.md },
  chapterBtn: {
    flex: 1,
    aspectRatio: 1,
    margin: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chapterText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.foreground,
  },
  errorView: { alignItems: 'center', marginTop: SPACING['2xl'] },
  errorText: { fontFamily: FONTS.lora, fontSize: FONT_SIZES.base, color: COLORS.muted },
  retryText: { fontFamily: FONTS.loraSemiBold, fontSize: FONT_SIZES.base, color: COLORS.gold, marginTop: SPACING.sm },
  emptyText: { fontFamily: FONTS.lora, color: COLORS.muted, textAlign: 'center', marginTop: SPACING.xl },
});
