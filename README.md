# Riviera

An intelligent, centralized campus platform designed to connect students with their educational materials, schedules, and peers seamlessly. Riviera combines an intuitive glassmorphic interface with a robust AI-powered backend to deliver real-time insights, natural voice interactions, and deep document understanding.

## Core Features

*   **Intelligent Knowledge Base**: Upload syllabi, notes, and official documents. Our Retrieval-Augmented Generation (RAG) pipeline indexes your materials for instantaneous query resolution.
*   **Conversational Voice Interface**: Speak directly to "River", your personalized campus assistant. Choose from multiple voices, adjust speech rate, and enjoy low-latency streaming responses via Edge-TTS and OpenRouter.
*   **Timetable Syncing & Conflict Detection**: Maintain your class schedule and automatically detect overlaps or conflicts in real-time.
*   **Discussion Forum**: Connect with peers, share resources, and discuss campus topics in an organized, threaded environment.

## Architecture

Riviera follows a modern decoupled architecture:

*   **Frontend**: Built with React and Vite. Employs a stunning dark-mode glassmorphism aesthetic with TailwindCSS and Lucide icons.
*   **Backend**: Powered by FastAPI (Python) for high-performance async endpoints.
*   **AI Orchestration**: Uses LangGraph and Groq for complex RAG pipelines, and OpenRouter for fast conversational routing.
*   **Database & Authentication**: Managed by Supabase (PostgreSQL), ensuring secure user sessions and reliable data persistence.
*   **Voice Engine**: Integrates `edge-tts` for dynamic, localized voice synthesis.

```mermaid
graph TD
    %% Aesthetic styling
    classDef frontend fill:#1E293B,stroke:#38BDF8,stroke-width:2px,color:#F8FAFC,rx:10,ry:10
    classDef gateway fill:#1E293B,stroke:#A78BFA,stroke-width:2px,color:#F8FAFC,rx:10,ry:10
    classDef security fill:#1E293B,stroke:#F43F5E,stroke-width:2px,color:#F8FAFC,rx:10,ry:10
    classDef llm fill:#1E293B,stroke:#34D399,stroke-width:2px,color:#F8FAFC,rx:10,ry:10
    classDef db fill:#1E293B,stroke:#FBBF24,stroke-width:2px,color:#F8FAFC,rx:10,ry:10
    classDef memory fill:#1E293B,stroke:#F472B6,stroke-width:2px,color:#F8FAFC,rx:10,ry:10
    classDef auth fill:#1E293B,stroke:#FB923C,stroke-width:2px,color:#F8FAFC,rx:10,ry:10
    classDef voice fill:#1E293B,stroke:#60A5FA,stroke-width:2px,color:#F8FAFC,rx:10,ry:10

    User([👤 User / React UI]):::frontend
    
    subgraph Core System [FastAPI Backend]
        Auth[🛡️ JWT Verification]:::security
        Guards[🚧 Input Guardrails]:::security
        RateLimit[⏱️ Rate Limiter]:::security
        Router{⚙️ Workflow Router}:::gateway
        Stream[🌊 Streaming SSE Response]:::gateway
        VoiceAPI[🎙️ Voice Synthesizer]:::voice
    end

    subgraph LangGraph Orchestration [Intelligent Agents]
        RAG[📚 Syllabus RAG Agent]:::gateway
        Timetable[📅 Schedule Analyzer]:::gateway
        FAQ[❓ Campus FAQ Engine]:::gateway
    end

    subgraph External LLM Providers
        OpenRouter[🧠 OpenRouter / Gemini]:::llm
        Groq[⚡ Groq / Qwen]:::llm
    end

    subgraph Data Layer [Supabase]
        VectorDB[(📂 pgvector Documents)]:::db
        ChatMem[(💬 Short-term Chat)]:::memory
        UserMem[(🧩 Long-term Memory)]:::memory
        AuthDB[(🔑 Auth / Users)]:::auth
    end

    MemExtract[🔍 Memory Extractor Task]:::memory
    Grounding[✅ Evidence Grounding]:::security

    %% Data Flow
    User -->|HTTP Requests| Auth
    Auth --> Guards
    Guards --> RateLimit
    RateLimit --> Router
    RateLimit --> Stream
    RateLimit --> VoiceAPI

    Router -->|Chitchat| OpenRouter
    Router -->|RAG Query| RAG
    Router -->|Timetable Query| Timetable
    Router -->|General FAQ| FAQ
    
    Stream -.->|Asynchronous Events| RAG

    RAG <-->|Similarity Search| VectorDB
    RAG --> Groq
    Timetable --> Groq
    FAQ --> OpenRouter

    Groq --> Grounding
    Grounding -->|Validated Answer| Router

    Router -->|Save History| ChatMem
    Router -->|Fetch Context| UserMem
    Router -.->|Every 5 messages| MemExtract
    MemExtract -->|Upsert Facts| UserMem

    VoiceAPI -->|edge-tts TTS| User
    OpenRouter -->|Fast Text| User
    Router -->|JSON Data| User
    Stream -->|SSE Chunks| User
```

## Quick Start

### Prerequisites
- Node.js v18+
- Python 3.10+
- Supabase account & credentials
- Groq / OpenRouter API keys

### Environment Setup

1. **Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env # Configure your API keys here
   uvicorn app.main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   cp .env.example .env # Configure your Vite API URLs here
   npm run dev
   ```

## Design Philosophy

Riviera was built with ethics and user experience at its core. It leverages AI not to replace learning, but to organize disparate campus information into a single, cohesive, and easily navigable dashboard. The interface is deliberately designed to be distraction-free, aesthetically pleasing, and highly responsive.
