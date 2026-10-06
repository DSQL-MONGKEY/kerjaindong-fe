import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { defaultLocale, getLanguage, languages, type Locale } from "@/i18n/languages";

export type LanguageCode = Locale;

type LanguageContextType = {
  language: Locale;
  currentLanguage: ReturnType<typeof getLanguage>;
  dir: "ltr" | "rtl";
  setLanguage: (code: Locale) => void;
  availableLanguages: typeof languages;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Locale>(() => {
    const current = (i18n.resolvedLanguage ||
      i18n.language ||
      defaultLocale) as Locale;
    return languages.some((lang) => lang.id === current)
      ? current
      : defaultLocale;
  });

  const currentLanguage = getLanguage(language);
  const dir = currentLanguage.dir;

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const matched = languages.find((l) => l.id === lng);
      if (matched && matched.id !== language) {
        setLanguageState(matched.id);
      }
    };

    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n, language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem("i18nextLng", language);
    localStorage.setItem("language", language);
  }, [language, dir]);

  const setLanguage = (code: Locale) => {
    void i18n.changeLanguage(code);
    setLanguageState(code);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLanguage,
        dir,
        setLanguage,
        availableLanguages: languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
