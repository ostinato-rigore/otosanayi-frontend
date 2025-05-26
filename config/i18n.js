/* eslint-disable import/no-named-as-default-member */
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import tr from "../locales/tr.json";

// i18next zaten başlatılmışsa tekrar başlatma
if (!i18n.isInitialized) {
  const resources = {
    en: { translation: en },
    tr: { translation: tr },
  };

  // Cihaz dilini al, undefined ise varsayılan olarak 'en' kullan
  const deviceLocale = Localization.locale || "en";
  console.log("📱 Detected locale:", deviceLocale);

  // Dili yalnızca dil koduna indirge (örneğin, 'tr-TR' -> 'tr')
  const languageCode = deviceLocale.split(/[-_]/)[0];

  i18n.use(initReactI18next).init({
    resources,
    lng: languageCode,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: "v3",
    debug: true,
  });
}

export default i18n;
