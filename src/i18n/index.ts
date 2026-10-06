import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "../locales/en/common.json";
import idCommon from "../locales/id/common.json";

export const resources = {
  id: {
    common: idCommon,
  },
  en: {
    common: enCommon,
  },
} as const;

export const defaultNS = "common";
export const fallbackLng = "id";

const DEFAULT_LNG = "id";

const isSupported = (lng: string | null | undefined): lng is keyof typeof resources =>
  !!lng && lng in resources;

const savedLng =
  typeof window !== "undefined"
    ? localStorage.getItem("i18nextLng") || localStorage.getItem("language")
    : null;
const browserLng =
  typeof window !== "undefined"
    ? navigator.language.split("-")[0]
    : fallbackLng;
const initialLng = isSupported(savedLng)
  ? savedLng
  : isSupported(browserLng)
    ? browserLng
    : DEFAULT_LNG;

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng,
  defaultNS,
  ns: ["common"],
  interpolation: {
    escapeValue: false, // React already escapes values
    prefix: "{",
    suffix: "}",
  },
});

export default i18n;
