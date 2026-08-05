/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/search/search-data.ts

import { getVisibleSections, type NavItem } from "@/constants/navigation";
import type { LucideIcon } from "lucide-react";

/*
  بناء قائمة بحث مسطّحة من NAV_SECTIONS — نفس مصدر بيانات الـ Sidebar.
  لا duplicate data structure، أي تحديث على navigation.ts ينعكس
  تلقائياً على نتائج البحث.

  كل SearchResult بيحمل breadcrumb (اسم الـ parent/section) عشان
  المستخدم يفهم السياق بدون ما يحتاج يفتح القائمة الفرعية.
─────────────────────────────────────────────
*/

export interface SearchResult {
  label: string;
  href: string;
  icon: LucideIcon;
  /** السياق المعروض جنب النتيجة — اسم الـ section أو الـ parent item */
  context: string;
}

export function buildSearchIndex(role: string): SearchResult[] {
  const sections = getVisibleSections(role);
  const results: SearchResult[] = [];

  for (const section of sections) {
    for (const item of section.items) {
      // عنصر مباشر بدون children
      if (item.href) {
        results.push({
          label: item.label,
          href: item.href,
          icon: item.icon,
          context: section.title,
        });
      }

      // عناصر الـ children — السياق هنا اسم الـ parent (أدق من section)
      if (item.children) {
        for (const child of item.children) {
          results.push({
            label: child.label,
            href: child.href,
            icon: item.icon,
            context: item.label,
          });
        }
      }
    }
  }

  return results;
}

/*
  فلترة بسيطة بدون مكتبة خارجية — مناسبة لعدد محدود من النتائج
  (الصفحات الثابتة فقط في هذه المرحلة).

  الترتيب: النتائج اللي تبدأ بالكلمة المدخلة تظهر أولاً،
  بعدها النتائج اللي تحتوي على الكلمة في أي مكان من النص.
*/
export function filterSearchResults(
  results: SearchResult[],
  query: string
): SearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return results;

  const startsWith: SearchResult[] = [];
  const includes: SearchResult[] = [];

  for (const result of results) {
    const label = result.label.toLowerCase();
    if (label.startsWith(trimmed)) {
      startsWith.push(result);
    } else if (label.includes(trimmed)) {
      includes.push(result);
    }
  }

  return [...startsWith, ...includes];
}