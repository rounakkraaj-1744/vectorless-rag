export interface Document {
  id: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}