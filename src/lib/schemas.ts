import { z } from "zod";

export const ajtbdSchema = z.object({
  coreJob: z.string().describe("Основная работа (Core Job) — что клиент нанимает продукт делать"),
  bigJob: z.string().describe("Большая работа (Big Job) — более широкая цель клиента"),
  pointA: z.object({
    problem: z.string().describe("Проблема клиента до использования продукта"),
    context: z.string().describe("Контекст, в котором возникает проблема"),
    emotions: z.string().describe("Эмоции клиента в проблемной ситуации"),
  }).describe("Точка А — текущее состояние клиента с проблемой"),
  pointB: z.object({
    result: z.string().describe("Конкретный результат после использования продукта"),
    emotions: z.string().describe("Эмоции клиента после получения результата"),
  }).describe("Точка Б — желаемое состояние после решения"),
  valueProposition: z.string().describe("Ценностное предложение — почему выбирают именно этот продукт"),
  competitors: z.string().describe("Конкуренты — кого/что клиент 'увольняет'"),
  barriers: z.string().describe("Барьеры — что мешает клиенту принять решение о покупке"),
});

export const landingPageSchema = z.object({
  settings: z.object({
    theme: z.enum(["light", "dark"]).describe("Тема оформления"),
    accentColor: z.string().describe("Акцентный цвет в формате HEX, например #007AFF"),
    mood: z.enum(["strict", "minimal", "friendly", "creative"]).describe("Настроение дизайна"),
  }),
  blocks: z.array(
    z.object({
      id: z.string().describe("Уникальный идентификатор блока"),
      type: z.enum(["hero", "features", "problem", "how_it_works", "competitors", "cta"])
        .describe("Тип блока"),
      content: z.record(z.any()).describe("Контент блока — структура зависит от типа"),
    })
  ).describe("Массив блоков лендинга в порядке отображения"),
});

export type AjtbdOutput = z.infer<typeof ajtbdSchema>;
export type LandingPageOutput = z.infer<typeof landingPageSchema>;
