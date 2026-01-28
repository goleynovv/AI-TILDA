export type AppPhase =
  | "interview"
  | "generating"
  | "preview"
  | "editing";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface InterviewResponse {
  assistantMessage: string;
  isComplete: boolean;
  updatedFields: string[];
}
