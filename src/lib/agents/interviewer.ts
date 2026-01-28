import { callLLM } from "./model";
import {
  AjtbdState,
  FIELD_LABELS,
  FIELD_PRIORITY,
  isCriticalFieldsFilled,
  getFirstEmptyField,
  countFilledFields,
} from "@/types/state";

const INTERVIEWER_SYSTEM_PROMPT = `Ты — ИИ-маркетолог и интервьюер. Твоя задача — через естественный диалог собрать информацию о продукте пользователя по методологии AJTBD.

**Твоя роль:**
- Веди беседу как дружелюбный эксперт, не как анкета
- Задавай открытые вопросы, слушай внимательно
- Периодически подтверждай понимание: "Правильно ли я понял, что..."
- Извлекай AJTBD-сущности из ответов пользователя

**AJTBD-поля для заполнения:**
- productDescription: Что за продукт/услуга
- targetAudience: Для кого это (целевая аудитория)
- coreJob: Основная "работа", для которой нанимают продукт
- bigJob: Большая жизненная цель клиента
- trigger: Что триггерит поиск решения
- pointA: Текущая проблема/боль клиента
- pointB: Желаемый результат, что получает клиент
- barriers: Что мешает принять решение о покупке
- alternatives: Какие альтернативы есть сейчас
- valueProposition: Почему выбирают именно этот продукт

**Правила:**
1. Один ответ пользователя может заполнить несколько полей
2. Задавай по одному вопросу за раз
3. Вопросы должны быть естественными, без терминов AJTBD
4. После 3-4 обменов делай краткое саммари понятого
5. Когда основные поля заполнены, сообщи что готов генерировать лендинг`;

interface InterviewerOutput {
  stateUpdates: Partial<AjtbdState>;
  nextMessage: string;
  isComplete: boolean;
}

export async function runInterviewer(
  state: AjtbdState,
  userMessage: string,
  conversationHistory: string
): Promise<InterviewerOutput> {
  const filledCount = countFilledFields(state);
  const emptyField = getFirstEmptyField(state);
  const criticalFilled = isCriticalFieldsFilled(state);

  const stateJson = JSON.stringify(state, null, 2);
  const fieldLabelsJson = JSON.stringify(FIELD_LABELS, null, 2);

  const prompt = `**Текущее состояние State (заполнено ${filledCount}/10 полей):**
\`\`\`json
${stateJson}
\`\`\`

**Описание полей:**
\`\`\`json
${fieldLabelsJson}
\`\`\`

**Следующее приоритетное пустое поле:** ${emptyField ? FIELD_LABELS[emptyField] : "все заполнены"}

**Критические поля заполнены:** ${criticalFilled ? "ДА" : "НЕТ"}

**История диалога:**
${conversationHistory}

**Последнее сообщение пользователя:**
${userMessage}

**Твоя задача:**
1. Проанализируй ответ пользователя
2. Извлеки информацию для заполнения полей State
3. Сформулируй следующее сообщение (вопрос или саммари)
4. Если критические поля заполнены, можешь завершить интервью

**Ответь строго в JSON формате:**
\`\`\`json
{{
  "stateUpdates": {{
    // только поля которые нужно обновить, например:
    // "productDescription": "извлечённое значение"
  }},
  "nextMessage": "твой следующий вопрос или сообщение пользователю",
  "isComplete": false // true если готов к генерации лендинга
}}
\`\`\``;

  const response = await callLLM([
    { role: "system", content: INTERVIEWER_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);

  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    // Fallback if parsing fails
    return {
      stateUpdates: {},
      nextMessage: "Расскажите подробнее о вашем продукте или услуге.",
      isComplete: false,
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as InterviewerOutput;
    return {
      stateUpdates: parsed.stateUpdates || {},
      nextMessage: parsed.nextMessage || "Расскажите ещё...",
      isComplete: parsed.isComplete || false,
    };
  } catch {
    return {
      stateUpdates: {},
      nextMessage: "Расскажите подробнее о вашем продукте или услуге.",
      isComplete: false,
    };
  }
}

/**
 * Generate initial greeting message
 */
export function getGreetingMessage(): string {
  return `Привет! Я ваш личный ИИ-маркетолог. Моя задача — помочь вам создать продающий лендинг.

Расскажите мне о вашем продукте или услуге, как другу за чашкой кофе. Что это такое и для кого?

Можете описать своими словами — чем больше деталей, тем лучше получится результат.`;
}

/**
 * Apply state updates to current state
 */
export function applyStateUpdates(
  state: AjtbdState,
  updates: Partial<AjtbdState>
): AjtbdState {
  return { ...state, ...updates };
}
