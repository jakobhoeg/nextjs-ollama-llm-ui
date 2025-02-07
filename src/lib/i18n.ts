'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend'; // 引入 http-backend 插件
import LanguageDetector from 'i18next-browser-languagedetector';

// 支持的语言列表
export const languages = ["en", "zh-CN"];
export const defaultLanguage = "en";

i18n
  .use(LanguageDetector)
  .use(Backend) // 使用 i18next-http-backend 插件
  .use(initReactI18next) // 将 i18next 与 react-i18next 绑定
  .init({
    fallbackLng: defaultLanguage, // 默认语言
    lng: navigator.language,
    interpolation: {
      escapeValue: false, // React 已经会处理 XSS，避免转义
    },
    backend: {
      // 加载路径配置：根据语言动态加载翻译文件
      loadPath: '/locales/{{lng}}/translation.json',
    },
    // 动态切换语言时自动更新页面
    react: {
      useSuspense: false,
    },
  });

export default i18n;
