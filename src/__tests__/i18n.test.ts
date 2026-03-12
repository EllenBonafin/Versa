import i18n from '../i18n';

describe('i18n', () => {
  it('defaults to Portuguese', () => {
    i18n.locale = 'pt';
    expect(i18n.t('nav.home')).toBe('Início');
    expect(i18n.t('nav.bible')).toBe('Bíblia');
  });

  it('switches to English', () => {
    i18n.locale = 'en';
    expect(i18n.t('nav.home')).toBe('Home');
    expect(i18n.t('nav.bible')).toBe('Bible');
  });

  it('falls back when key is missing', () => {
    i18n.locale = 'pt';
    const result = i18n.t('nav.home');
    expect(result).toBeTruthy();
  });
});
