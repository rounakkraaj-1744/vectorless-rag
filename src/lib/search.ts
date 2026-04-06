import type { Document } from "@/types";

let documentStore: Document[] = [];

export class VectorlessSearchDB {
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 1);
  }

  public query(queryString: string, topK: number = 3): Document[] {
    const queryTokens = this.tokenize(queryString);
    if (queryTokens.length === 0) 
      return [];

    const scored = documentStore.map((doc) => {
      const docTokens = this.tokenize(doc.title + " " + doc.content);
      let score = 0;

      queryTokens.forEach((qt) => {
        const matches = docTokens.filter((dt) => dt === qt).length;
        score += matches;
      });

      return { doc, score };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((item) => item.doc);
  }

  public add(doc: Document) {
    documentStore.push(doc);
  }

  public getAll(): Document[] {
    return documentStore;
  }
}

export const searchDB = new VectorlessSearchDB();