import { callLLM } from "./model";
import type { AjtbdState } from "@/types/state";

const GENERATOR_SYSTEM_PROMPT = `Ты — UX-архитектор и копирайтер, эксперт по созданию продающих лендингов по методологии AJTBD.

Тебе на вход дан заполненный State с AJTBD-сущностями продукта. Твоя задача — создать структуру лендинга с текстами для каждого блока.

**Структура лендинга (используй ТОЧНО эти типы блоков):**

1. **hero** — Главный экран
   content: {{ "title": "главный заголовок на основе Core Job и ценности", "subtitle": "раскрывающий подзаголовок", "ctaText": "текст кнопки" }}

2. **features** — Результаты / Точка Б
   content: {{ "title": "заголовок секции", "items": [{{ "icon": "rocket|check|star|shield|clock|heart|target|smile", "title": "название", "description": "описание" }}] }}
   3-4 пункта

3. **problem** — Проблема / Точка А
   content: {{ "title": "заголовок", "description": "описание проблемы с эмпатией" }}

4. **how_it_works** — Как это работает
   content: {{ "title": "заголовок", "steps": [{{ "title": "шаг", "description": "описание" }}] }}
   Ровно 3 шага

5. **competitors** — Почему мы / vs альтернативы
   content: {{ "title": "заголовок", "items": [{{ "title": "преимущество", "description": "описание" }}] }}
   3-4 пункта

6. **cta** — Призыв к действию
   content: {{ "title": "заголовок", "description": "описание", "ctaText": "текст кнопки" }}

**Формат ответа (СТРОГО соблюдай):**
{{
  "settings": {{ "theme": "light", "accentColor": "#HEX", "mood": "friendly" }},
  "blocks": [
    {{ "id": "hero-1", "type": "hero", "content": {{ ... }} }},
    {{ "id": "features-1", "type": "features", "content": {{ ... }} }},
    {{ "id": "problem-1", "type": "problem", "content": {{ ... }} }},
    {{ "id": "how_it_works-1", "type": "how_it_works", "content": {{ ... }} }},
    {{ "id": "competitors-1", "type": "competitors", "content": {{ ... }} }},
    {{ "id": "cta-1", "type": "cta", "content": {{ ... }} }}
  ]
}}

**Правила:**
- blocks — это МАССИВ объектов, каждый с полями id, type, content
- Пиши на русском языке
- Используй конкретику из State, а не абстрактные фразы
- Заголовки должны цеплять и быть ёмкими`;

export async function runGenerator(state: AjtbdState) {
  const stateDescription = `
**Продукт/услуга:** ${state.productDescription || "не указано"}
**Целевая аудитория:** ${state.targetAudience || "не указана"}
**Core Job (основная работа):** ${state.coreJob || "не указано"}
**Big Job (большая цель):** ${state.bigJob || "не указано"}
**Триггер поиска:** ${state.trigger || "не указан"}
**Точка А (проблема):** ${state.pointA || "не указана"}
**Точка Б (результат):** ${state.pointB || "не указан"}
**Барьеры:** ${state.barriers || "не указаны"}
**Альтернативы:** ${state.alternatives || "не указаны"}
**Ценностное предложение:** ${state.valueProposition || "не указано"}
`.trim();

  const text = await callLLM([
    {
      role: "system",
      content: GENERATOR_SYSTEM_PROMPT + "\n\nОтветь строго в формате JSON без markdown-обёртки. JSON должен содержать поля settings и blocks.",
    },
    {
      role: "user",
      content: `AJTBD State продукта:\n\n${stateDescription}\n\nСоздай структуру и тексты для лендинга. Ответь JSON.`,
    },
  ]);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse generator response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}
