import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLanguage } from '../hooks/useLanguage';
import { useSettings, type FontSizeKey, FONT_SIZE_MAP } from '../store/SettingsContext';
import { useOfflineDownload } from '../hooks/useOfflineDownload';
import { LanguageToggle } from '../components/LanguageToggle';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../constants/theme';
import type { BibleVersion } from '../types/bible';

const PT_VERSIONS: BibleVersion[] = ['ARC'];
const EN_VERSIONS: BibleVersion[] = ['WEB', 'KJV'];

export function SettingsScreen() {
  const { language, toggleLanguage, t } = useLanguage();
  const {
    fontSize,
    bibleVersion,
    notifEnabled,
    notifHour,
    notifMinute,
    setFontSize,
    setBibleVersion,
    setNotifEnabled,
    setNotifTime,
  } = useSettings();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const offline = useOfflineDownload(bibleVersion);

  const versions = language === 'pt' ? PT_VERSIONS : EN_VERSIONS;

  // Cria um objeto Date com o horário salvo para o DateTimePicker
  const notifDate = new Date();
  notifDate.setHours(notifHour, notifMinute, 0, 0);

  const handleTimeChange = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (date) setNotifTime(date.getHours(), date.getMinutes());
  };

  const timeLabel = `${String(notifHour).padStart(2, '0')}:${String(notifMinute).padStart(2, '0')}`;

  // Exemplo de texto com a fonte atual
  const sampleFontSize = FONT_SIZE_MAP[fontSize];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('settings.title')}</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Idioma ───────────────────────────────────────────── */}
        <SettingSection label={t('settings.language')} desc={t('settings.languageDesc')}>
          <LanguageToggle language={language} onToggle={toggleLanguage} />
        </SettingSection>

        {/* ── Versão da Bíblia ─────────────────────────────────── */}
        <SettingSection label={t('settings.bibleVersion')} desc={t('settings.bibleVersionDesc')}>
          <View style={styles.chipRow}>
            {versions.map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.chip, bibleVersion === v && styles.chipActive]}
                onPress={() => setBibleVersion(v)}
              >
                <Text style={[styles.chipText, bibleVersion === v && styles.chipTextActive]}>
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SettingSection>

        {/* ── Tamanho da fonte ──────────────────────────────────── */}
        <View style={styles.fontSection}>
          <View style={styles.fontSectionHeader}>
            <View>
              <Text style={styles.sectionLabel}>{t('settings.fontSize')}</Text>
              <Text style={styles.sectionDesc}>{t('settings.fontSizeDesc')}</Text>
            </View>
            <View style={styles.chipRow}>
              {(['small', 'medium', 'large'] as FontSizeKey[]).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[styles.chip, fontSize === size && styles.chipActive]}
                  onPress={() => setFontSize(size)}
                >
                  <Text style={[styles.chipText, fontSize === size && styles.chipTextActive]}>
                    {t(`settings.${size}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Preview com a fonte selecionada */}
          <View style={styles.fontPreview}>
            <Text style={[styles.fontPreviewText, { fontSize: sampleFontSize }]}>
              "O Senhor é o meu pastor; nada me faltará."
            </Text>
            <Text style={styles.fontPreviewRef}>— Salmos 23:1</Text>
          </View>
        </View>

        {/* ── Notificações ─────────────────────────────────────── */}
        <View style={styles.notifSection}>
          <SettingSection
            label={t('settings.notificationEnabled')}
            desc={t('settings.notificationsDesc')}
          >
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.gold }}
              thumbColor={COLORS.white}
            />
          </SettingSection>

          {/* Horário — só aparece se notif ativa */}
          {notifEnabled && (
            <TouchableOpacity
              style={styles.timeRow}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.sectionLabel}>{t('settings.notificationTime')}</Text>
                <Text style={styles.sectionDesc}>
                  {language === 'pt' ? 'Toque para alterar' : 'Tap to change'}
                </Text>
              </View>
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>{timeLabel}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Offline / Download ───────────────────────────────── */}
        <View style={styles.offlineSection}>
          <View style={styles.offlineHeader}>
            <View>
              <Text style={styles.sectionLabel}>
                {language === 'pt' ? 'Leitura offline' : 'Offline reading'}
              </Text>
              <Text style={styles.sectionDesc}>
                {offline.totalStats
                  ? `${offline.totalStats.cachedChapters} / ${offline.totalStats.totalChapters} capítulos`
                  : language === 'pt' ? 'Baixe para ler sem internet' : 'Download to read without internet'}
              </Text>
            </View>
            {offline.totalStats && (
              <Text style={styles.offlinePct}>{offline.totalStats.percentComplete}%</Text>
            )}
          </View>

          {/* Barra de progresso geral */}
          {offline.totalStats && (
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${offline.totalStats.percentComplete}%` },
                ]}
              />
            </View>
          )}

          {/* Download em andamento */}
          {offline.isDownloading && offline.currentBook && (
            <View style={{ marginTop: SPACING.sm }}>
              <Text style={styles.downloadingText}>
                ↓ {offline.currentBook} — {offline.bookProgress}%
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${offline.bookProgress}%` }]} />
              </View>
            </View>
          )}

          {offline.error && (
            <Text style={styles.errorText}>{offline.error}</Text>
          )}

          {/* Ações */}
          {!offline.isDownloading && (
            <View style={styles.offlineActions}>
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => { offline.refreshStats(); offline.downloadNewTestament(); }}
              >
                <Text style={styles.downloadBtnText}>
                  {language === 'pt' ? '↓ Novo Testamento' : '↓ New Testament'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.downloadBtn, styles.downloadBtnOutline]}
                onPress={offline.refreshStats}
              >
                <Text style={styles.downloadBtnOutlineText}>↺</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── About ────────────────────────────────────────────── */}
        <View style={styles.about}>
          <Text style={styles.aboutTitle}>Versa</Text>
          <Text style={styles.aboutVersion}>{t('settings.version')} 1.0.0</Text>
          <Text style={styles.aboutCredit}>Powered by bible-api.com · Built with Expo</Text>
        </View>
      </ScrollView>

      {/* ── Time picker iOS (modal) ───────────────────────────── */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showTimePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerSheet}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>{t('settings.notificationTime')}</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={styles.pickerDone}>
                    {language === 'pt' ? 'Feito' : 'Done'}
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={notifDate}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                locale={language === 'pt' ? 'pt-BR' : 'en-US'}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* ── Time picker Android (inline) ─────────────────────── */}
      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          value={notifDate}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
}

function SettingSection({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionLabels}>
        <Text style={styles.sectionLabel}>{label}</Text>
        <Text style={styles.sectionDesc}>{desc}</Text>
      </View>
      <View style={styles.sectionControl}>{children}</View>
    </View>
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
  content: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING['3xl'] },

  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  sectionLabels: { flex: 1 },
  sectionLabel: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.foreground,
    marginBottom: 2,
  },
  sectionDesc: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.xs,
    color: COLORS.muted,
  },
  sectionControl: { alignItems: 'flex-end' },

  chipRow: { flexDirection: 'row', gap: SPACING.xs },
  chip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  chipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.muted,
  },
  chipTextActive: { color: COLORS.white },

  // Font section com preview
  fontSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  fontSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  fontPreview: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
  },
  fontPreviewText: {
    fontFamily: FONTS.loraItalic,
    color: COLORS.foreground,
    lineHeight: 28,
    marginBottom: SPACING.xs,
  },
  fontPreviewRef: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },

  // Notif section
  notifSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  timeBadge: {
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 10,
  },
  timeBadgeText: {
    fontFamily: FONTS.playfairBold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.goldDark,
    letterSpacing: 1,
  },

  // iOS time picker modal
  pickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  pickerSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: SPACING['2xl'],
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pickerTitle: {
    fontFamily: FONTS.playfairSemiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.foreground,
  },
  pickerDone: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.gold,
  },

  // Offline
  offlineSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  offlineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offlinePct: {
    fontFamily: FONTS.playfairBold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.gold,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  downloadingText: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.xs,
    color: COLORS.muted,
    marginBottom: SPACING.xs,
  },
  errorText: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.xs,
    color: '#EF4444',
  },
  offlineActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  downloadBtn: {
    flex: 1,
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  downloadBtnText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
  },
  downloadBtnOutline: {
    flex: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  downloadBtnOutlineText: {
    fontFamily: FONTS.loraSemiBold,
    fontSize: FONT_SIZES.base,
    color: COLORS.muted,
  },

  // About
  about: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  aboutTitle: {
    fontFamily: FONTS.playfairBold,
    fontSize: FONT_SIZES['2xl'],
    color: COLORS.gold,
    letterSpacing: 4,
    marginBottom: SPACING.xs,
  },
  aboutVersion: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.sm,
    color: COLORS.muted,
    marginBottom: SPACING.xs,
  },
  aboutCredit: {
    fontFamily: FONTS.lora,
    fontSize: FONT_SIZES.xs,
    color: COLORS.mutedForeground,
  },
});
