import { Document, documents } from "../data/store";

export class SearchService {
  /**
   * Tokenizes text into a set of lower-case words.
   * Simple implementation.
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2); // filter out small words like "a", "is", "the"...
  }

  /**
   * Performs vectorless (keyword-based) search.
   * Returns documents ranked by relevance score.
   */
  public search(query: string, topK: number = 3): Document[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const scoredDocs = documents.map((doc) => {
      const docTokens = this.tokenize(doc.content + " " + doc.title);
      let score = 0;

      queryTokens.forEach((queryToken) => {
        // Count frequency of this token in the document
        const matches = docTokens.filter((docToken) => docToken === queryToken).length;
        score += matches;
      });

      return { doc, score };
    });

    // Sort by score descending and take topK
    return scoredDocs
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((item) => item.doc);
  }

  public addDocument(doc: Document): void {
    documents.push(doc);
  }
}

export const searchService = new SearchService();
