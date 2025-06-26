import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(
    key: keyof typeof ui[typeof defaultLang],
    params?: Record<string, string | number>
  ) {
    let translation = ui[lang][key] || ui[defaultLang][key];

    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        const regex = new RegExp(`{{\\s*${paramKey}\\s*}}|{\\s*${paramKey}\\s*}`, 'g');
        translation = translation.replace(regex, String(paramValue));
      }
    }
    return translation;
  };
}