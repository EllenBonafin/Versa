import { I18n } from 'i18n-js';
import pt from './pt';
import en from './en';

const i18n = new I18n({
  pt,
  en,
});

i18n.defaultLocale = 'pt';
i18n.locale = 'pt';
i18n.enableFallback = true;

export default i18n;
