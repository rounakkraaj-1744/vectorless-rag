export interface Document {
  id: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

// In-memory document store
export const documents: Document[] = [];
