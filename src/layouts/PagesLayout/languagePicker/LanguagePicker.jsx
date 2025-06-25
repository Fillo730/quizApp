//i18n
import { languages } from '../../../i18n/ui';
import { getLangFromUrl, useTranslations } from '../../../i18n/utils';

//CSSFiles
import './LanguagePicker.css';

function LanguagePicker({ url }) {
  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);
  
  function handleChange(event) {
    const selectedLang = event.target.value;
    const newT = useTranslations(selectedLang);
    window.location.href = `/${selectedLang}/${newT('Path.Home')}`;
  }

  return (
    <select className="language-picker light-color" value={lang} onChange={handleChange}>
      {Object.entries(languages).map(([code, label]) => (
        <option value={code} key={code}>
          {label}
        </option>
      ))}
    </select>
  );
}

export default LanguagePicker;