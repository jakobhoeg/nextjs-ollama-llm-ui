"use client";

import { useTranslation } from "react-i18next";
import { languages } from "../lib/i18n"; // 引入语言列表
import clsx from "clsx";
import { useState } from "react";

export default function I18nSwitch() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false); // 控制菜单是否展开

  const toggleMenu = () => {
    setIsOpen(!isOpen); // 切换菜单显示状态
  };

  return (
    <div className="fixed top-4 right-10 z-50">
      <button
        onClick={toggleMenu} // 点击按钮切换菜单
        className="cursor-pointer p-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
      >
        {i18n.language} {/* 显示当前语言 */}
      </button>
      {isOpen && (
        <ul className="mt-2 bg-white shadow-lg rounded-md p-2 space-y-2 w-32">
          {languages.map((lang) => (
            <li
              key={lang}
              onClick={() => {
                i18n.changeLanguage(lang); // 切换语言
                setIsOpen(false); // 选择语言后关闭菜单
              }}
              className={clsx(
                "cursor-pointer p-2 rounded-md hover:bg-gray-200", // 样式
                i18n.language === lang ? "bg-gray-300" : "" // 当前语言高亮
              )}
            >
              {lang} {/* 显示语言代码 */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
