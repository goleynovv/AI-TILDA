/**
 * AJTBD State - internal PRD for landing page generation
 * Based on Zamyosin's master prompt structure
 * All fields are initially null and filled by the Interviewer Agent
 */
export interface AjtbdState {
  // What the product/service is
  productDescription: string | null;

  // Target audience
  targetAudience: string | null;

  // Core Job - what the customer "hires" the product to do
  coreJob: string | null;

  // Big Job / Life Job - larger life goal the customer is pursuing
  bigJob: string | null;

  // Trigger - what triggers the search for a solution
  trigger: string | null;

  // Point A - current problem state (pain, context, emotions)
  pointA: string | null;

  // Point B - desired outcome (result, emotions)
  pointB: string | null;

  // Barriers - what prevents purchase decision
  barriers: string | null;

  // Alternatives - current solutions they're "firing"
  alternatives: string | null;

  // Value Proposition - why choose this product over alternatives
  valueProposition: string | null;
}

/**
 * Create empty AJTBD state with all fields null
 */
export function createEmptyState(): AjtbdState {
  return {
    productDescription: null,
    targetAudience: null,
    coreJob: null,
    bigJob: null,
    trigger: null,
    pointA: null,
    pointB: null,
    barriers: null,
    alternatives: null,
    valueProposition: null,
  };
}

/**
 * Priority order for filling state fields
 * Interviewer asks about these in order of importance
 */
export const FIELD_PRIORITY: (keyof AjtbdState)[] = [
  "productDescription",
  "targetAudience",
  "pointA",
  "pointB",
  "coreJob",
  "valueProposition",
  "trigger",
  "alternatives",
  "barriers",
  "bigJob",
];

/**
 * Critical fields that must be filled before generation
 */
export const CRITICAL_FIELDS: (keyof AjtbdState)[] = [
  "productDescription",
  "targetAudience",
  "pointA",
  "pointB",
  "valueProposition",
];

/**
 * Human-readable labels for state fields (for prompts)
 */
export const FIELD_LABELS: Record<keyof AjtbdState, string> = {
  productDescription: "Описание продукта/услуги",
  targetAudience: "Целевая аудитория",
  coreJob: "Core Job (основная работа продукта)",
  bigJob: "Big Job (большая жизненная цель клиента)",
  trigger: "Триггер (что запускает поиск решения)",
  pointA: "Точка А (текущая проблема клиента)",
  pointB: "Точка Б (желаемый результат)",
  barriers: "Барьеры (что мешает купить)",
  alternatives: "Альтернативы (текущие решения)",
  valueProposition: "Ценностное предложение (почему вы)",
};

/**
 * Check if all critical fields are filled
 */
export function isCriticalFieldsFilled(state: AjtbdState): boolean {
  return CRITICAL_FIELDS.every((field) => state[field] !== null);
}

/**
 * Get first empty field by priority
 */
export function getFirstEmptyField(state: AjtbdState): keyof AjtbdState | null {
  for (const field of FIELD_PRIORITY) {
    if (state[field] === null) {
      return field;
    }
  }
  return null;
}

/**
 * Count filled fields
 */
export function countFilledFields(state: AjtbdState): number {
  return Object.values(state).filter((v) => v !== null).length;
}
