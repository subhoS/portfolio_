---
title: "Building a Modern Search System: From Debouncing to Ranking and Real-Time Updates"
date: "2025-10-25"
author: "Subhadeep Datta"
excerpt: "Learn how to build a high-performance search system from scratch — covering frontend debouncing, backend ranking, Elasticsearch integration, and real-time updates with Change Data Capture (CDC)."
featured_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop"
description: "A comprehensive guide to building production-grade search systems. Discover debouncing techniques, ranking algorithms, Elasticsearch fundamentals, and CDC patterns with code examples."
tags:
  ["search", "elasticsearch", "performance", "backend", "CDC", "system-design"]
keywords: "search system, debouncing, ranking algorithms, elasticsearch, change data capture, CDC, system design"
readingTime: 12
---

## 🧭 Introduction: Why Search Is Harder Than It Looks

Type a few letters into Google or Amazon, and results appear instantly — ranked, relevant, and fresh.

Behind that magic lies a chain of complex engineering ideas:

- **Debouncing** makes typing feel smooth
- **Ranking algorithms** decide what appears first
- **Elasticsearch** retrieves relevant results at scale
- **Change Data Capture (CDC)** keeps everything up-to-date in real time

In this article, we'll break each piece down, step by step — and end with a small, working example showing how to connect them all together.

---

## 💡 1. Debouncing: The First Layer of Performance

When a user types in a search box, every keystroke can trigger an API call — wasting bandwidth and hammering your backend.

Example: typing "apple" fires 5 requests:

```
a → ap → app → appl → apple
```

That's inefficient. **Debouncing** solves this by waiting until the user pauses typing before running the search.

### 🧩 How Debouncing Works

> Wait X milliseconds after the last keystroke before executing the function.

If another keystroke happens before the delay ends, the timer resets.

### 🧠 Example (JavaScript)

```javascript
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`)
    .then((res) => res.json())
    .then((data) => console.log(data));
}, 300);
```

✅ **Result:** Only **one** API call after the user stops typing — smoother UX, less load.

### Performance Impact

Without debouncing:

- 1000 users typing 5 characters = 5,000 requests
- With debouncing: same scenario = 1,000 requests

That's an **80% reduction** in unnecessary API calls!

👉 **Learn more:**

- [MDN Docs: setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- [Debounce vs Throttle Explained](https://css-tricks.com/debouncing-throttling-explained-examples/)

---

## ⚖️ 2. Ranking: Making Search Results Relevant

Once the query hits your backend, you need to decide **which results should appear first**.

Ranking is the "brain" of search — it determines what's _most relevant_.

### Common Ranking Factors

1. **Text relevance** — how well the content matches the query
2. **Popularity** — e.g., click counts, purchases
3. **Recency** — newer results may rank higher
4. **Personalization** — user preferences or history
5. **User signals** — likes, shares, time-spent

### 🔢 Simplified Ranking Formula

```
Final Score = (text_score × 0.6) + (popularity × 0.3) + (recency × 0.1)
```

This formula is weighted because:

- **60%** text relevance (user is looking for specific content)
- **30%** popularity (trusted/purchased products rank higher)
- **10%** recency (fresh products get a small boost)

---

### Example Ranking Scenario

Imagine searching for "wireless headphones" — here's how three products score:

![Ranking Comparison](/ranking-comparison.svg)

_Visual breakdown showing why Sony ranks #1: balanced excellence across all ranking factors._

**Sony WH-1000XM5**

- Text Score: 95/100 (matches "wireless" + "headphones")
- Popularity: 90/100 (50K+ purchases)
- Recency: 85/100 (released 2 years ago, still current)
- **Final Score: 90.8** ⭐ **#1 Ranked**

**Generic Headphones**

- Text Score: 85/100 (matches query but less specific)
- Popularity: 40/100 (5K purchases)
- Recency: 95/100 (just released)
- **Final Score: 73.5** (not enough popularity)

**Vintage Headphones**

- Text Score: 88/100 (matches but labeled "vintage")
- Popularity: 30/100 (old product, few recent purchases)
- Recency: 20/100 (released 10 years ago)
- **Final Score: 60.4** (low overall score)

**Result:** Sony ranks first because it excels across all factors. Users see the most relevant product first! 🎉

---

### 🧮 Real-World Algorithms

Search engines use sophisticated algorithms:

- **TF-IDF** (Term Frequency–Inverse Document Frequency) — classic approach
- **BM25** — a modern improvement on TF-IDF (used by Elasticsearch)
- **Learning to Rank (LTR)** — machine learning-based ranking

**BM25 Formula (Simplified):**

```
score(D, Q) = Σ IDF(qi) × (f(qi, D) × (k1 + 1)) / (f(qi, D) + k1 × (1 - b + b × |D| / avgdl))
```

Where:

- `D` = document
- `Q` = query
- `IDF` = inverse document frequency
- `f` = term frequency
- `k1`, `b` = tuning parameters

👉 **Learn more:**

- [Wikipedia: TF-IDF](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)
- [Understanding BM25 in Elasticsearch](https://www.elastic.co/blog/practical-bm25)

---

## ⚙️ 3. Elasticsearch: The Engine Powering Modern Search

**Elasticsearch** is a distributed search and analytics engine built on **Apache Lucene**.
It's used by companies like Netflix, Uber, and Shopify to power their search systems.

### 🧠 Why Elasticsearch?

- **Blazing fast full-text search** — searches millions of documents in milliseconds
- **Scalable** — can handle billions of documents across clusters
- **Powerful ranking & scoring** out-of-the-box (BM25)
- **Supports fuzzy search**, filtering, and aggregations
- **RESTful API** — easy to integrate with any backend

### 🗃️ Basic Architecture

| Component    | Description                                        |
| ------------ | -------------------------------------------------- |
| **Index**    | A collection of documents (like a database table)  |
| **Document** | A single data record (like a JSON object)          |
| **Shard**    | A portion of an index distributed across nodes     |
| **Replica**  | A copy of a shard for redundancy                   |
| **Query**    | The search request from the user                   |
| **Score**    | A numeric value showing how relevant the result is |

### Example: Index and Document

```json
PUT /products/_doc/1
{
  "id": 1,
  "title": "Wireless Bluetooth Headphones",
  "description": "Premium sound quality with noise cancellation",
  "price": 299.99,
  "rating": 4.8,
  "reviews_count": 1250
}
```

### Example: Simple Query

```json
GET /products/_search
{
  "query": {
    "match": {
      "title": "wireless headphones"
    }
  },
  "size": 10,
  "from": 0
}
```

### Response Example

```json
{
  "hits": {
    "total": { "value": 42 },
    "hits": [
      {
        "_id": "1",
        "_score": 8.95,
        "_source": {
          "title": "Wireless Bluetooth Headphones",
          "price": 299.99,
          "rating": 4.8
        }
      }
    ]
  }
}
```

### Advanced: Combining Multiple Queries

```json
GET /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "headphones" } }
      ],
      "filter": [
        { "range": { "price": { "lte": 500 } } },
        { "term": { "in_stock": true } }
      ]
    }
  }
}
```

This query returns products matching "headphones" that are under $500 and in stock.

👉 **Learn more:**

- [Elasticsearch Official Docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Intro to Elasticsearch Queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)

---

## 🔄 3.5 Search Engine Alternatives to Elasticsearch

Elasticsearch is powerful but **complex to set up and operate**. Here are production-ready alternatives depending on your needs:

### Comparison Table: Search Engines

| Feature            | Elasticsearch       | Typesense         | Meilisearch  | Algolia         | Whoosh         |
| ------------------ | ------------------- | ----------------- | ------------ | --------------- | -------------- |
| **Setup**          | Complex             | Easy (Docker)     | Very Easy    | Cloud Only      | Simple         |
| **Doc Limit**      | Millions+           | 100K-Millions     | Millions     | Depends         | ~1M            |
| **Typo Tolerance** | Limited             | ✅ Built-in       | ✅ Built-in  | ✅ Built-in     | ✗ No           |
| **Faceting**       | ✅ Yes              | ✅ Yes            | ✅ Yes       | ✅ Yes          | Limited        |
| **Speed**          | Fast                | Ultra-fast        | Very Fast    | Ultra-fast      | Moderate       |
| **Cost**           | Free/Self-hosted    | Free/Open-source  | Free/Cloud   | $$ (SaaS)       | Free           |
| **Best For**       | Enterprise, Complex | Developers, Speed | Startups, UX | Turnkey, Hosted | Small Projects |
| **Learning Curve** | Steep               | Gentle            | Gentle       | Easy            | Easy           |

### 🚀 Typesense: Fast, Developer-Friendly Alternative

**Typesense** is a modern search engine optimized for **speed and ease of use**.

**Pros:**

- ⚡ Instant search results (~100ms)
- 🎯 Built-in typo tolerance
- 🔍 Facets & filtering out-of-box
- 📦 Easy deployment (Docker, Heroku, etc.)
- 💰 Open-source & self-hosted
- 📱 Great for mobile apps

**Cons:**

- Document limits on free tier
- Smaller ecosystem than Elasticsearch
- Fewer advanced features

**Quick Example:**

```javascript
// Install: npm install typesense
import Typesense from "typesense";

const client = new Typesense.Client({
  nodes: [{ host: "localhost", port: 8108, protocol: "http" }],
  apiKey: "xyz789",
});

// Search
const results = await client.collections("products").documents().search({
  q: "wireless headphones",
  query_by: "title,description",
  filter_by: "price:<= 300",
  limit: 10,
});
```

**Deploy Typesense:**

- [Docker: `docker run -p 8108:8108 typesense/typesense`](https://typesense.org/docs/guide/install-typesense.html)
- [Cloud Providers: Heroku, DigitalOcean, AWS](https://typesense.org/docs/guide/configure-typesense.html)

---

### 🔎 Meilisearch: The User-Experience Champion

**Meilisearch** prioritizes **beautiful search UX** with minimal configuration.

**Pros:**

- 🎨 Amazing UX by default
- ⚡ Fast (HTTP response in ~50ms)
- 🧙 Zero-config relevance
- 📚 Excellent documentation
- 🔓 Open-source & MIT licensed
- 🌐 REST API only (simpler than Elasticsearch)

**Cons:**

- Smaller than Typesense in some benchmarks
- Less flexible for custom ranking

**Quick Example:**

```javascript
// Install: npm install meilisearch
import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: "masterKey",
});

// Add documents
await client.index("products").addDocuments([
  { id: 1, title: "Sony Headphones", price: 299 },
  { id: 2, title: "Bose Headphones", price: 279 },
]);

// Search
const results = await client.index("products").search("wireless");
```

**Deploy Meilisearch:**

- [Docker: `docker run -p 7700:7700 getmeili/meilisearch`](https://docs.meilisearch.com/learn/getting_started/quick_start.html)
- [Cloud: Heroku, Railway, Render](https://docs.meilisearch.com/learn/cookbooks/docker.html)

---

### 💼 Algolia: The Enterprise SaaS Option

**Algolia** is a fully managed **SaaS** solution for teams that need turnkey search.

**Pros:**

- ✅ Zero infrastructure management
- ✅ Global CDN (fast everywhere)
- ✅ Outstanding documentation
- ✅ Analytics & insights included
- ✅ Premium support

**Cons:**

- 💰 Can be expensive at scale ($0.008+ per query)
- Vendor lock-in (proprietary platform)
- Less control over algorithms

**Ideal for:** Startups, high-traffic sites where ops overhead is a concern.

[Algolia Pricing & Docs](https://www.algolia.com/doc/)

---

### 🐍 Whoosh: Lightweight Python Alternative

For **small to medium projects in Python**, **Whoosh** is a pure-Python search library.

**Pros:**

- 📦 Single Python package (no servers to run)
- 🚀 Great for simple use cases
- 🔧 Fully customizable

**Cons:**

- ❌ No distributed/scaling capability
- Limited to local/single-machine
- Slower than Elasticsearch/Typesense

**Quick Example:**

```python
from whoosh.fields import Schema, TEXT
from whoosh.index import create_in

# Define schema
schema = Schema(
  id=ID(stored=True),
  title=TEXT(stored=True),
  content=TEXT
)

# Create index
ix = create_in('indexdir', schema)
writer = ix.writer()

# Index documents
writer.add_document(id='1', title='Wireless Headphones', content='...')
writer.commit()

# Search
with ix.searcher() as searcher:
  results = searcher.find('title', 'wireless')
  for result in results:
    print(result['title'])
```

---

### 🎯 How to Choose?

- **Enterprise, Millions of docs, Complex queries?** → **Elasticsearch**
- **Want speed + easy setup?** → **Typesense**
- **Prioritize UX + Open Source?** → **Meilisearch**
- **Don't want to manage infrastructure?** → **Algolia**
- **Small Python project?** → **Whoosh**

---

## 🔄 4. Change Data Capture (CDC): Keeping Search Fresh

Even the best search index becomes outdated if your source data changes.

When products are added, deleted, or updated in your main database, your search index must stay **in sync**.

That's where **Change Data Capture (CDC)** comes in.

### 🧠 What Is CDC?

CDC continuously monitors your database for changes and streams them to another system — like Elasticsearch.

### The Problem CDC Solves

Imagine an e-commerce platform:

- Product gets updated in MySQL
- Price drops to $99
- But search still shows $199
- Customer buys, expecting $99 price
- **Revenue loss. Angry customer. Bad review.**

CDC prevents this by ensuring search is always up-to-date.

### Example Flow

1. **User updates product price** in MySQL (from $299 → $199)
2. **CDC tool (Debezium)** captures the change in MySQL binlog
3. **Message sent to Kafka** with the update event
4. **Kafka Consumer** reads the event
5. **Elasticsearch updated** with new price
6. **Next search query** returns updated price ✅

### CDC Architecture Diagram

```
┌─────────────────────┐
│   MySQL Database    │
│   Product updated   │
│   (price: $199)     │
└──────────┬──────────┘
           │ (binlog)
           ▼
┌─────────────────────┐
│  Debezium (CDC)     │
│  Captures changes   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Apache Kafka       │
│  Streams changes    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Elasticsearch      │
│  (Index updated)    │
└─────────────────────┘
```

### Tools for CDC

| Tool              | Database                   | Latency     | Setup        | Cost       | Best For                |
| ----------------- | -------------------------- | ----------- | ------------ | ---------- | ----------------------- |
| Debezium          | MySQL, PostgreSQL, MongoDB | < 1 second  | Complex      | Free (OSS) | Enterprise, High-volume |
| AWS DMS           | Most SQL databases         | < 1 second  | Easy (Cloud) | $$         | AWS users, managed      |
| Segment           | Cloud-based                | < 5 seconds | Very Easy    | $$         | SaaS-first stacks       |
| Airbyte           | 300+ sources               | < 1 minute  | Easy         | Free/Cloud | Flexible, many sources  |
| Kafka Connect     | Pluggable                  | < 1 second  | Moderate     | Free (OSS) | Kafka users, scalable   |
| Triggerflow       | PostgreSQL                 | < 500ms     | Easy         | Free       | Serverless (AWS Lambda) |
| Supabase Realtime | PostgreSQL                 | < 100ms     | Very Easy    | $$         | Postgres + Real-time    |

---

## 🔄 4.5 CDC Tools Deep Dive

### 🔥 Debezium: The Industry Standard

**Debezium** is the most popular open-source CDC tool for databases. Used by companies like Walmart, Booking.com, and Square.

**Pros:**

- ✅ Works with major databases (MySQL, PostgreSQL, MongoDB, Oracle)
- ✅ Battle-tested, enterprise-grade
- ✅ Free & open-source
- ✅ Sub-second latency
- ✅ Rich community & documentation

**Cons:**

- � Requires Kafka & Zookeeper setup (operational overhead)
- 📈 Learning curve

**Architecture:**

```
MySQL → Debezium Connector → Kafka → Elasticsearch Sink → Elasticsearch Index
```

**Example: Debezium + Kafka Setup**

```bash
# 1. Start Zookeeper
docker run -d --name zookeeper \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  confluentinc/cp-zookeeper

# 2. Start Kafka
docker run -d --name kafka \
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka

# 3. Create Debezium MySQL connector
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mysql-debezium",
    "config": {
      "connector.class": "io.debezium.connector.mysql.MySqlConnector",
      "database.hostname": "mysql",
      "database.port": 3306,
      "database.user": "root",
      "database.password": "password",
      "database.server.id": 1,
      "database.server.name": "dbserver1",
      "table.include.list": "ecommerce.products",
      "topic.prefix": "mysql"
    }
  }'

# 4. Listen to Kafka topic
docker exec kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic mysql.ecommerce.products \
  --from-beginning
```

---

### ⚡ Supabase Realtime: PostgreSQL + Real-time

**Supabase** combines PostgreSQL with built-in **real-time subscriptions**.

**Pros:**

- 🚀 Extremely fast (< 100ms latency)
- 🎯 Built into PostgreSQL, no extra infrastructure
- 💡 Real-time WebSocket subscriptions included
- 🔓 Open-source
- ☁️ Hosted option available

**Cons:**

- 🔒 PostgreSQL only
- Smaller ecosystem than Debezium

**Example:**

```javascript
// Real-time subscription with Supabase
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(url, key);

// Subscribe to changes on products table
supabase
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "products" },
    (payload) => {
      console.log("Product updated:", payload.new);
      // Sync to Elasticsearch
      updateElasticsearch(payload.new);
    }
  )
  .subscribe();
```

**Deploy:** [supabase.com](https://supabase.com) (managed) or self-hosted

---

### 🚀 AWS DMS (Database Migration Service): Fully Managed

**AWS DMS** handles CDC without the infrastructure burden.

**Pros:**

- ☁️ Fully managed by AWS
- ✅ Works with 10+ database types
- 🔧 Easy setup (Console/CLI)
- 📊 CloudWatch monitoring included
- ✅ Sub-second replication

**Cons:**

- 💰 Pricing per instance-hour
- Vendor lock-in (AWS)

**Example:**

```python
import boto3

dms = boto3.client('dms', region_name='us-east-1')

# Create replication task
response = dms.create_replication_task(
    ReplicationTaskIdentifier='mysql-to-es-cdc',
    SourceEndpointArn='arn:aws:dms:...mysql-endpoint...',
    TargetEndpointArn='arn:aws:dms:...es-endpoint...',
    ReplicationInstanceArn='arn:aws:dms:...instance...',
    MigrationType='cdc',  # Change Data Capture
    TableMappings=json.dumps({
        "rules": [
            {
                "rule-type": "selection",
                "rule-id": "1",
                "rule-name": "1",
                "object-locator": {
                    "schema-name": "ecommerce",
                    "table-name": "products"
                },
                "rule-action": "include"
            }
        ]
    })
)
```

**Cost:** ~$0.50-1.50/hour per instance

---

### 🎯 Custom Webhook Solution: Simplest for Small Teams

For **small projects**, a simple webhook approach might be enough.

**Concept:**

1. Application updates database
2. App triggers webhook to search API
3. Search API updates Elasticsearch

**Pros:**

- 🧠 No complex infrastructure
- 📝 Easy to understand
- 💸 Minimal cost

**Cons:**

- ⚠️ Webhook failures → stale data
- Not distributed/scalable
- Application-level coupling

**Example:**

```python
# Flask: Update product → trigger search update
from flask import Flask
import requests

app = Flask(__name__)

@app.route('/products/<id>', methods=['PUT'])
def update_product(id):
    # Update database
    product = db.products.update(id, request.json)

    # Trigger search index update
    requests.post('http://localhost:9200/products/_doc/' + id,
                  json=product)

    return product
```

---

### 🎯 How to Choose a CDC Tool?

| Scenario                         | Best Choice              |
| -------------------------------- | ------------------------ |
| **Small team, PostgreSQL**       | Supabase Realtime        |
| **Enterprise, complex setup**    | Debezium + Kafka         |
| **AWS ecosystem, fully managed** | AWS DMS                  |
| **Prototype/MVP**                | Custom webhooks          |
| **Multi-source integration**     | Airbyte                  |
| **Serverless, low-latency**      | Triggerflow (AWS Lambda) |

👉 **Learn more:**

- [Debezium: CDC for MySQL and PostgreSQL](https://debezium.io/documentation/reference/)
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [AWS DMS Documentation](https://docs.aws.amazon.com/dms/)
- [CDC Patterns with Kafka Connect](https://www.confluent.io/blog/kafka-connect-deep-dive-change-data-capture/)

---

## 🔗 5. Putting It All Together: Architecture Overview

Here's how a modern, end-to-end search system looks:

### Visual System Architecture

![Search System Architecture](/search-architecture.svg)

_A layered architecture showing how frontend, backend, search engine, and data sync work together._

### Complete System Architecture Diagram

```plaintext
┌─────────────────────────────────────────────────────┐
│                   FRONTEND LAYER                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  Search Input Component (React/Vue/Angular)  │  │
│  │  • Text input field                          │  │
│  │  • Debounce logic (300-500ms)               │  │
│  │  • Display suggestions/autocomplete          │  │
│  └──────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────────┘
               │ HTTP/Debounced API Request
               ▼
    ┌────────────────────────────────────────┐
    │      BACKEND/API LAYER                 │
    │  ┌────────────────────────────────┐   │
    │  │  REST/GraphQL API Endpoint     │   │
    │  │  • Route: /api/search?q=query │   │
    │  │  • Validation & sanitization   │   │
    │  │  • Rate limiting & caching     │   │
    │  └────────────────────────────────┘   │
    │               │                        │
    │               ▼                        │
    │  ┌────────────────────────────────┐   │
    │  │  Search Query Engine           │   │
    │  │  • Build query DSL             │   │
    │  │  • Apply filters & facets      │   │
    │  │  • Implement ranking logic     │   │
    │  └────────────────────────────────┘   │
    └────────────────┬──────────────────────┘
                     │ Query + Ranking Parameters
                     ▼
┌────────────────────────────────────────────────┐
│      SEARCH ENGINE LAYER                       │
│  ┌──────────────┐  ┌──────────────┐           │
│  │Elasticsearch │  │  Typesense   │           │
│  │  (Advanced)  │  │(Fast/Easy)   │           │
│  │              │  │              │           │
│  │ • BM25       │  │ • Typo-tol.  │           │
│  │ • Millions   │  │ • Facets     │           │
│  │   of docs    │  │ • 100K+ docs │           │
│  │ • Complex    │  │ • Easy setup │           │
│  │   queries    │  │              │           │
│  └──────────────┘  └──────────────┘           │
└────────────────────┬──────────────────────────┘
                     │ Scored/Ranked Results
                     ▼
            ┌────────────────────────┐
            │  BACKEND RESPONSE      │
            │  • Results with scores │
            │  • Cache in Redis      │
            │  • Serialize to JSON   │
            └────────────────┬───────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │   RENDER IN FRONTEND     │
              │  • Display results list  │
              │  • Highlight relevance   │
              │  • Load more/pagination  │
              └──────────────────────────┘

┌──────────────────────────────────────┐
│    DATA SYNC LAYER (CDC)             │
│  ┌────────────────────────────────┐  │
│  │  Source Database               │  │
│  │  (MySQL/PostgreSQL/MongoDB)    │  │
│  │  • Products table              │  │
│  │  • Inventory changes           │  │
│  │  • Price updates               │  │
│  └────────────┬───────────────────┘  │
│               │ Binary Logs          │
│               ▼                       │
│  ┌────────────────────────────────┐  │
│  │  CDC Tool                      │  │
│  │  (Debezium/Maxwell/Custom)     │  │
│  └────────────┬───────────────────┘  │
│               │                       │
│               ▼                       │
│  ┌────────────────────────────────┐  │
│  │  Message Broker                │  │
│  │  (Kafka/Kinesis/Pub-Sub)       │  │
│  └────────────┬───────────────────┘  │
│               │                       │
│               ▼                       │
│  ┌────────────────────────────────┐  │
│  │  Search Index Updater          │  │
│  │  (Consumer)                    │  │
│  └────────────┬───────────────────┘  │
│               │                       │
│               ▼                       │
│  ┌────────────────────────────────┐  │
│  │  Search Index                  │  │
│  │  (Elasticsearch/Typesense)     │  │
│  │  Updated in real-time ✓        │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Request Flow Example

**User searches: "wireless headphones under $300"**

1. **Frontend (Debounce)**: User types "wireless headphones", waits 300ms after last keystroke
2. **API Call**: `/api/search?q=wireless%20headphones&maxPrice=300&limit=10`
3. **Backend Processing**:
   - Validate & sanitize query
   - Check Redis cache for identical query (if configured)
   - Build search query for chosen engine
4. **Search Engine Query** (e.g., Elasticsearch):
   ```
   match("wireless headphones") AND price <= 300
   ```
   - Engine returns 42 results, ranked by BM25 score + custom factors
5. **Backend Response**:
   ```json
   {
     "results": [
       {
         "id": 1,
         "title": "Sony WH-1000XM5",
         "price": 299.99,
         "score": 8.95,
         "highlights": "<strong>Wireless</strong> <strong>Headphones</strong>"
       },
       {
         "id": 2,
         "title": "Bose QC45 Headphones",
         "price": 279.99,
         "score": 8.42,
         "highlights": "<strong>Wireless</strong> Premium <strong>Headphones</strong>"
       }
     ],
     "total": 42,
     "facets": {
       "brands": [
         { "name": "Sony", "count": 15 },
         { "name": "Bose", "count": 12 }
       ]
     }
   }
   ```
6. **Frontend Display**: Renders results with highlighting, user sees relevant products instantly 🎉
7. **Real-Time Sync**: If a product price drops, CDC captures it and updates the index within seconds

---

## 🧩 6. Step-by-Step Easy Implementation

Let's tie it all together with a working example setup 👇

### 🖥️ Frontend: Debounced Search Input (React)

```javascript
import { useState, useCallback } from "react";

function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce function
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Search handler
  const handleSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      {loading && <p>Searching...</p>}
      <ul>
        {results.map((item) => (
          <li key={item.id}>
            {item.title} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchComponent;
```

---

### ⚙️ Backend: Node.js + Elasticsearch API

```javascript
import express from "express";
import { Client } from "@elastic/elasticsearch";

const client = new Client({ node: "http://localhost:9200" });
const app = express();

app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;

    if (!query.trim()) {
      return res.json({ results: [] });
    }

    // Build Elasticsearch query
    const esQuery = {
      index: "products",
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: query,
                  fields: ["title^2", "description", "tags"],
                  fuzziness: "AUTO",
                },
              },
            ],
          },
        },
        size: 20,
        sort: [{ _score: "desc" }],
      },
    };

    // Add price filter if provided
    if (maxPrice) {
      esQuery.body.query.bool.filter = [
        { range: { price: { lte: maxPrice } } },
      ];
    }

    const result = await client.search(esQuery);

    // Transform results
    const results = result.hits.hits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
    }));

    res.json({
      results,
      total: result.hits.total.value,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(3000, () => {
  console.log("Search API running on http://localhost:3000");
});
```

---

### 🗄️ Setting Up Elasticsearch Locally (Docker)

```bash
# Start Elasticsearch with Docker
docker run -d \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.0.0

# Create products index with mapping
curl -X PUT "http://localhost:9200/products" -H "Content-Type: application/json" -d '{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "description": { "type": "text" },
      "price": { "type": "float" },
      "rating": { "type": "float" },
      "in_stock": { "type": "boolean" }
    }
  }
}'

# Index sample data
curl -X POST "http://localhost:9200/products/_doc/1" -H "Content-Type: application/json" -d '{
  "title": "Wireless Bluetooth Headphones",
  "description": "Premium sound quality with noise cancellation",
  "price": 299.99,
  "rating": 4.8,
  "in_stock": true
}'
```

---

### 🔄 Database Sync: CDC with Debezium

**Step 1: Start Kafka & Zookeeper**

```bash
docker-compose up -d
```

**Step 2: Create Debezium MySQL Connector**

```bash
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mysql-cdc-connector",
    "config": {
      "connector.class": "io.debezium.connector.mysql.MySqlConnector",
      "database.hostname": "mysql",
      "database.port": 3306,
      "database.user": "root",
      "database.password": "password",
      "database.server.id": 1,
      "database.server.name": "mysql-server",
      "database.include.list": "ecommerce",
      "table.include.list": "ecommerce.products",
      "plugin.name": "pgoutput"
    }
  }'
```

**Step 3: Create Elasticsearch Sink Connector**

```bash
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "es-sink-connector",
    "config": {
      "connector.class": "com.github.dariobalinzo.kafka.connect.ElasticsearchSinkConnector",
      "topics": "mysql-server.ecommerce.products",
      "connection.url": "http://elasticsearch:9200",
      "connection.user": "elastic",
      "connection.password": "password",
      "type.name": "_doc",
      "key.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter"
    }
  }'
```

**Step 4: Test the Flow**

```bash
# Update a product in MySQL
UPDATE products SET price = 199.99 WHERE id = 1;

# Check Elasticsearch (should be updated)
curl "http://localhost:9200/products/_doc/1"
```

✅ **Result:** Price updated in MySQL → CDC captures it → Kafka streams it → Elasticsearch updates it!

📚 **Resources:**

- [Debezium Quickstart Guide](https://debezium.io/documentation/reference/stable/quickstart.html)
- [Kafka Connect Elasticsearch Sink](https://docs.confluent.io/kafka-connect-elasticsearch/current/overview.html)
- [Elastic's Guide to Real-Time Indexing](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html)

---

## 🚀 7. Performance Tips & Optimization

### Frontend Optimization

```javascript
// 1. Adjust debounce delay based on API latency
const DEBOUNCE_DELAY = 300; // ms

// 2. Add loading state to prevent duplicate requests
const [isSearching, setIsSearching] = useState(false);

// 3. Cache results for repeated queries
const resultsCache = new Map();
```

### Elasticsearch Optimization

```javascript
// 1. Use keyword fields for exact matching
"product_id": { "type": "keyword" }

// 2. Add analyzers for better text search
"title": {
  "type": "text",
  "analyzer": "standard",
  "fields": {
    "keyword": { "type": "keyword" }
  }
}

// 3. Enable sharding for scale
"settings": {
  "number_of_shards": 5,
  "number_of_replicas": 2
}
```

### Backend Optimization

```javascript
// 1. Add query result caching
const Redis = require("redis");
const redis = Redis.createClient();

// 2. Implement pagination
const size = 20;
const from = (page - 1) * size;

// 3. Monitor query performance
console.time("elasticsearch_query");
const result = await client.search(query);
console.timeEnd("elasticsearch_query");
```

---

## 🌟 8. Final Thoughts

A great search system is not just about speed — it's about **smart engineering** across every layer.

- **Debouncing** smooths user input, reducing unnecessary API calls
- **Ranking** ensures relevance, keeping users engaged
- **Elasticsearch** delivers results at lightning speed, powering scalability
- **CDC** keeps everything up to date in real time, maintaining data integrity

When combined, they create a seamless experience where users get **relevant results — instantly and accurately**.

Whether you're building a small product search or a massive e-commerce platform, these principles apply. Start simple, measure performance, and optimize as you scale.

---

## 🔗 Summary of Resources

<table>
<thead>
<tr>
<th>Concept</th>
<th>Tool / Docs</th>
<th>Link</th>
</tr>
</thead>
<tbody>
<tr>
<td>Debouncing</td>
<td>MDN Docs</td>
<td><a href="https://developer.mozilla.org/en-US/docs/Web/API/setTimeout">setTimeout() – MDN</a></td>
</tr>
<tr>
<td>Ranking Algorithms</td>
<td>Elastic Blog</td>
<td><a href="https://www.elastic.co/blog/practical-bm25">Understanding BM25</a></td>
</tr>
<tr>
<td>Elasticsearch</td>
<td>Official Docs</td>
<td><a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html">Elasticsearch Guide</a></td>
</tr>
<tr>
<td>CDC</td>
<td>Debezium</td>
<td><a href="https://debezium.io/documentation/reference/">Debezium Documentation</a></td>
</tr>
<tr>
<td>Real-Time Data Pipelines</td>
<td>Kafka Connect</td>
<td><a href="https://www.confluent.io/blog/kafka-connect-deep-dive-change-data-capture/">Kafka Connect Overview</a></td>
</tr>
<tr>
<td>Docker Setup</td>
<td>Official Docs</td>
<td><a href="https://docs.docker.com/">Docker Documentation</a></td>
</tr>
</tbody>
</table>

---

**Ready to build the next great search system? Start with debouncing, move to Elasticsearch, and level up with CDC.** 🚀

Happy searching! 🔍
