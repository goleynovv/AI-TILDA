export type AppPhase =
  | "interview"
  | "generating"
  | "preview"
  | "editing";

export interface InterviewState {
  currentQuestion: number;
  answers: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
