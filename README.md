# Vectorless RAG

A Next.js-based Retrieval-Augmented Generation (RAG) application that implements document retrieval without vector embeddings. Instead of using complex vector databases, this project uses simple keyword-based matching for efficient, lightweight document search and AI-powered responses.

## What is Vectorless RAG?

Retrieval-Augmented Generation (RAG) is a technique that enhances large language models by retrieving relevant information from a knowledge base before generating responses. Traditional RAG systems use vector embeddings to perform semantic similarity searches, which require significant computational resources and specialized databases.

**Vectorless RAG** simplifies this approach by using basic keyword matching algorithms instead of vector embeddings. This method:

- **Tokenizes text** into words and removes punctuation
- **Scores documents** based on exact keyword matches between the query and document content
- **Ranks results** by match frequency
- **Provides context** to an AI model for generating responses

While less sophisticated than vector-based RAG, vectorless RAG offers:
- **Faster setup** - no need for embedding models or vector databases
- **Lower resource requirements** - runs on standard hardware
- **Simpler implementation** - easier to understand and modify
- **Effective for keyword-heavy queries** - works well when users search with specific terms

## Features

- **Document Ingestion**: Upload PDF files or add text documents directly
- **Keyword-Based Search**: Fast retrieval using token matching
- **AI-Powered Responses**: Generate answers using Groq's Llama 3.3 model
- **Chat Interface**: Interactive web UI for querying documents
- **Source Attribution**: See which documents were used for each response
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
vectorless-rag/
├── src/
│   ├── app/
│   │   ├── actions.ts          # Server actions for document ingestion and querying
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx            # Main dashboard page
│   ├── components/
│   │   ├── ChatInput.tsx       # Input component for sending messages
│   │   ├── ChatLog.tsx         # Displays chat history and responses
│   │   ├── Header.tsx          # App header with title
│   │   └── Sidebar.tsx         # Document list and upload interface
│   ├── lib/
│   │   ├── ai.ts               # AI response generation using Groq SDK
│   │   ├── search.ts           # Vectorless search implementation
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration
├── eslint.config.mjs           # ESLint configuration
└── tsconfig.json               # TypeScript configuration
```

### Key Files Explained

- **`src/lib/search.ts`**: Implements the `VectorlessSearchDB` class with tokenization and scoring logic
- **`src/lib/ai.ts`**: Handles AI response generation using Groq's API
- **`src/app/actions.ts`**: Server-side functions for document processing and RAG queries
- **`src/app/page.tsx`**: Main React component orchestrating the chat interface
- **`src/types/index.ts`**: Type definitions for Documents and Messages

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Groq API key (get one at [console.groq.com](https://console.groq.com))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vectorless-rag
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory and add your Groq API key:
```env
GROQ_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Ingesting Documents

1. Use the sidebar to upload PDF files or add text documents
2. Documents are processed and stored in memory for querying

### Querying Documents

1. Type your question in the chat input
2. The system will:
   - Search for relevant documents using keyword matching
   - Send the query + relevant document content to the AI
   - Display the AI's response with source attribution

### Example Queries

- "What are the main benefits of vectorless RAG?"
- "Explain how document tokenization works"
- "Compare vector-based vs keyword-based search"

## Technologies Used

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Groq SDK**: AI model integration (Llama 3.3 70B)
- **unpdf**: PDF text extraction
- **Lucide React**: Icon library

## How It Works

1. **Document Ingestion**:
   - PDFs are parsed using `unpdf` to extract text
   - Text documents are stored directly
   - All content is added to an in-memory document store

2. **Query Processing**:
   - User query is tokenized (lowercased, punctuation removed)
   - Each document is scored based on keyword matches
   - Top-scoring documents are selected as context

3. **Response Generation**:
   - Context + query are sent to Groq's Llama model
   - AI generates a response based only on provided context
   - Response includes source document titles

## Limitations

- **In-memory storage**: Documents are lost on server restart
- **Simple matching**: May miss semantic similarities
- **No persistence**: Add a database for production use
- **Basic tokenization**: Could be enhanced with stemming/lemmatization

## Future Enhancements

- Add vector-based search option
- Implement document persistence (SQLite, PostgreSQL)
- Add document chunking for better retrieval
- Support for more file types (DOCX, HTML)
- User authentication and multi-user support
- Advanced tokenization (stemming, stop words)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Groq API Documentation](https://console.groq.com/docs)
- [Retrieval-Augmented Generation Paper](https://arxiv.org/abs/2005.11401)
