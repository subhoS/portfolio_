---
title: "RAG Pipelines Explained: Building AI That Actually Knows Your Data"
date: "2026-02-18"
excerpt: "RAG (Retrieval-Augmented Generation) is how you make LLMs useful with your own data. Here's a practical breakdown of how it works, when to use it, and how to build one that doesn't hallucinate."
description: "A practical guide to RAG pipelines: embeddings, vector databases, chunking, retrieval quality and prompt design for AI grounded in your own data."
keywords: "RAG pipeline, retrieval augmented generation, vector database, embeddings, LLM with custom data, AI knowledge base, Pinecone, ChromaDB, OpenAI embeddings"
tags: ["AI Engineering", "LLM", "RAG", "System Design", "Tutorial"]
author: "Subhadeep Datta"
category: "AI Engineering"
updated: "2026-10-02"
faq:
  - q: "What is a RAG pipeline?"
    a: "Retrieval-augmented generation (RAG) is a pattern where relevant documents are retrieved from your own data, usually with embeddings and a vector database, and added to the prompt so the LLM answers from those sources instead of from memory."
  - q: "When should I use RAG instead of fine-tuning?"
    a: "Use RAG when answers depend on specific, changing or private information, such as documentation, policies or records. Use fine-tuning to change a model's style, format or behavior. Many production systems use RAG first because the data can be updated without retraining."
  - q: "What chunk size should I use for RAG?"
    a: "A common starting point is a few hundred tokens per chunk with some overlap, split along natural boundaries like headings and paragraphs. Tune it with an evaluation set, because the best size depends on your documents and questions."
  - q: "How do I reduce hallucinations in RAG?"
    a: "Improve retrieval quality first, instruct the model to answer only from the provided context and to say when it doesn't know, require citations to source chunks, and evaluate answers against a test set of real questions."
---

## Introduction: The Problem With Vanilla LLMs

Large language models like GPT-4, Claude, and Gemini are impressive. They can write code, explain concepts, and reason about problems. But ask them about your company's internal docs, your product database, or yesterday's meeting notes, and they'll confidently make things up.

That's not because the models are bad. It's because they don't have your data. They were trained on public internet text, not your specific knowledge base.

**RAG fixes this.** It's a pattern that retrieves relevant information from your own documents and feeds it to the LLM as context, so the model answers based on actual facts instead of guessing.

I've been building RAG systems for internal tools at Noisiv Consulting, and this article walks through how it works in practice — not the research paper version, the "I need to ship this" version.

---

## How RAG Works (The Simple Version)

The core idea is straightforward:

```
User asks a question
     ↓
Search your documents for relevant chunks
     ↓
Combine the question + relevant chunks into a prompt
     ↓
Send to LLM
     ↓
LLM answers based on your actual data
```

That's it. The magic is in how well you do each step.

### The Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User Query  │ →   │   Embedder   │ →   │ Vector DB    │
│  "How do I   │     │  (OpenAI /   │     │ (Pinecone /  │
│   deploy?"   │     │   Cohere)    │     │  ChromaDB)   │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                              Top K relevant chunks
                                                  │
┌──────────────┐     ┌──────────────┐     ┌──────┴───────┐
│   Response   │ ←   │     LLM      │ ←   │   Prompt     │
│  "To deploy, │     │  (GPT-4 /    │     │  Builder     │
│   run..."    │     │   Claude)    │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## Step 1: Prepare Your Documents

Before anything, you need to get your data into a format the system can work with. This means:

1. **Collect** your documents (PDFs, Markdown, HTML, database records)
2. **Clean** them (remove headers, footers, navigation elements)
3. **Chunk** them into smaller pieces

### Chunking Strategy

Chunking is where most people get it wrong. Too small and you lose context. Too large and you waste token budget with irrelevant information.

```javascript
// Simple but effective chunking
function chunkDocument(text, options = {}) {
  const {
    chunkSize = 500,     // characters per chunk
    overlap = 50,        // overlap between chunks
  } = options;

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    // Don't cut in the middle of a sentence
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf(".", end);
      if (lastPeriod > start + chunkSize * 0.5) {
        end = lastPeriod + 1;
      }
    }

    chunks.push({
      content: text.slice(start, end).trim(),
      startIndex: start,
      endIndex: end,
    });

    start = end - overlap;
  }

  return chunks;
}
```

### Chunking Rules of Thumb

| Document Type | Chunk Size | Overlap | Why |
|---------------|-----------|---------|-----|
| Technical docs | 500-800 chars | 50-100 | Need enough context for code examples |
| FAQ / Q&A | 1 question-answer pair | None | Natural boundaries |
| Meeting notes | 300-500 chars | 50 | Shorter, more specific chunks |
| Legal documents | 800-1200 chars | 100 | Complex sentences need full context |

---

## Step 2: Generate Embeddings

Embeddings convert text into numerical vectors that capture meaning. Similar texts produce similar vectors, which is how we find relevant chunks later.

```javascript
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",  // Fast, cheap, good enough
    input: text,
  });
  return response.data[0].embedding;  // Array of 1536 floats
}

// Embed all chunks
async function embedChunks(chunks) {
  const embedded = [];

  for (const chunk of chunks) {
    const vector = await getEmbedding(chunk.content);
    embedded.push({
      ...chunk,
      vector,
    });
  }

  return embedded;
}
```

### Which Embedding Model?

| Model | Dimensions | Speed | Quality | Cost |
|-------|-----------|-------|---------|------|
| `text-embedding-3-small` | 1536 | Fast | Good | $0.02/1M tokens |
| `text-embedding-3-large` | 3072 | Medium | Better | $0.13/1M tokens |
| Cohere `embed-english-v3` | 1024 | Fast | Good | $0.10/1M tokens |
| Open source (e5-large) | 1024 | Self-hosted | Good | Free (compute cost) |

For most use cases, `text-embedding-3-small` is the best starting point. It's fast, cheap, and good enough.

---

## Step 3: Store in a Vector Database

Vector databases are optimized for similarity search — finding the vectors closest to a query vector.

### Using ChromaDB (Simple, Local)

```javascript
import { ChromaClient } from "chromadb";

const chroma = new ChromaClient();
const collection = await chroma.createCollection({ name: "docs" });

// Store chunks with embeddings
await collection.add({
  ids: chunks.map((_, i) => `chunk-${i}`),
  documents: chunks.map((c) => c.content),
  embeddings: chunks.map((c) => c.vector),
  metadatas: chunks.map((c) => ({
    source: c.source,
    section: c.section,
  })),
});

// Query: find relevant chunks
const results = await collection.query({
  queryEmbeddings: [queryVector],
  nResults: 5,
});
```

### Using Pinecone (Production-Scale)

```javascript
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index("docs");

// Upsert chunks
await index.upsert(
  chunks.map((chunk, i) => ({
    id: `chunk-${i}`,
    values: chunk.vector,
    metadata: {
      content: chunk.content,
      source: chunk.source,
    },
  }))
);

// Query
const results = await index.query({
  vector: queryVector,
  topK: 5,
  includeMetadata: true,
});
```

### Which Vector DB?

| Database | Self-hosted | Managed | Best For |
|----------|-----------|---------|----------|
| ChromaDB | ✅ | ❌ | Prototyping, small datasets |
| Pinecone | ❌ | ✅ | Production, managed service |
| Weaviate | ✅ | ✅ | Multi-modal (text + images) |
| pgvector | ✅ | ✅ | Already using PostgreSQL |
| Qdrant | ✅ | ✅ | High performance, open source |

If you're already using PostgreSQL, **pgvector** is the easiest path. No new infrastructure to manage.

---

## Step 4: Build the Prompt

This is where you combine the user's question with the retrieved context and send it to the LLM.

```javascript
function buildRAGPrompt(question, relevantChunks) {
  const context = relevantChunks
    .map((chunk, i) => `[Source ${i + 1}]: ${chunk.content}`)
    .join("\n\n");

  return `You are a helpful assistant that answers questions based on the provided context.
If the context doesn't contain enough information to answer the question,
say "I don't have enough information to answer that."

Do NOT make up information. Only use what's in the context below.

---

Context:
${context}

---

Question: ${question}

Answer:`;
}
```

### The Complete RAG Function

```javascript
async function askRAG(question) {
  // 1. Embed the question
  const queryVector = await getEmbedding(question);

  // 2. Find relevant chunks
  const results = await collection.query({
    queryEmbeddings: [queryVector],
    nResults: 5,
  });

  const relevantChunks = results.documents[0].map((doc, i) => ({
    content: doc,
    score: results.distances[0][i],
  }));

  // 3. Build prompt with context
  const prompt = buildRAGPrompt(question, relevantChunks);

  // 4. Get LLM response
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,  // Lower = more factual, less creative
    max_tokens: 1000,
  });

  return {
    answer: response.choices[0].message.content,
    sources: relevantChunks.map((c) => c.content.slice(0, 100) + "..."),
  };
}
```

---

## Step 5: Reduce Hallucinations

RAG doesn't eliminate hallucinations, but you can minimize them:

### Practical Techniques

1. **Lower temperature** (0.1–0.3) for factual Q&A
2. **Explicit instructions** in the system prompt: "Only answer based on the provided context"
3. **Return sources** alongside answers so users can verify
4. **Set confidence thresholds**: if retrieved chunks have low similarity scores, say "I'm not sure"
5. **Chunk quality matters more than quantity**: 3 highly relevant chunks beat 10 vaguely related ones

```javascript
// Confidence check before answering
const MIN_SIMILARITY = 0.75;

const relevantChunks = results.filter(
  (r) => r.score >= MIN_SIMILARITY
);

if (relevantChunks.length === 0) {
  return {
    answer: "I don't have enough relevant information to answer this question confidently.",
    sources: [],
  };
}
```

---

## Production Considerations

### Keep Your Index Fresh

Documents change. Your RAG pipeline needs to handle updates:

```javascript
// Watch for document changes and re-index
async function reindexDocument(docId) {
  // Delete old chunks
  await collection.delete({ where: { docId } });

  // Re-chunk and re-embed
  const doc = await fetchDocument(docId);
  const chunks = chunkDocument(doc.content);
  const embedded = await embedChunks(chunks);

  // Insert updated chunks
  await collection.add({
    ids: embedded.map((_, i) => `${docId}-${i}`),
    documents: embedded.map((c) => c.content),
    embeddings: embedded.map((c) => c.vector),
  });
}
```

### Cost Estimation

For a knowledge base with 10,000 documents (~5M tokens total):

| Component | Cost |
|-----------|------|
| Initial embedding | ~$0.10 (one-time) |
| Per query (embedding + retrieval) | ~$0.0001 |
| Per query (GPT-4 response) | ~$0.03-0.10 |
| Vector DB (managed) | $25-70/month |

**Total for 1,000 queries/day: ~$100-200/month.** Very affordable for the value it provides.

---

## Conclusion

RAG isn't complicated. It's four steps: chunk your docs, embed them, store them, retrieve and prompt. The hard part is doing each step well — good chunking, the right similarity threshold, and a prompt that keeps the model honest.

If you're building any kind of AI assistant, internal search, or knowledge system, RAG is the pattern you want. It turns a generic LLM into something that actually knows your stuff.

Start with ChromaDB and `text-embedding-3-small`. You can have a working prototype in an afternoon.

---

## Key Takeaways

- **RAG = Retrieve + Augment + Generate** — ground LLM answers in your actual data
- **Chunking quality** determines retrieval quality — respect sentence boundaries
- **pgvector** is the easiest option if you already use PostgreSQL
- **Lower temperature** and explicit prompts reduce hallucinations significantly
- **Return sources** alongside answers so users can verify the response
- Start simple, measure retrieval quality, then optimize
