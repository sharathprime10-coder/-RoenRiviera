# RoenRiviera: Campus Friend AI 🎓🤖

An intelligent, dual-LLM AI assistant designed to enhance the campus experience at RoenRiviera University. Built for our hackathon submission, this project features both a responsive React frontend and a powerful FastAPI backend, orchestrating workflows with LangGraph.

## Features ✨

- **Dual-LLM Architecture**: Intelligently routes simple queries (chitchat) to a fast LLM and complex campus queries (syllabus, timetables) to a heavy reasoning model via Groq.
- **Campus FAQ & Syllabus RAG**: Retrieve specific answers from campus documentation.
- **Timetable Conflict Checking**: Avoid scheduling issues with intelligent timetable parsing.
- **Voice Capabilities**: Integrated Edge-TTS for a fully conversational voice assistant experience.

## Tech Stack 🛠️

- **Frontend**: React (TypeScript), Vite, TailwindCSS
- **Backend**: Python, FastAPI, Uvicorn
- **AI Ecosystem**: LangChain, LangGraph, Groq, OpenRouter, Google GenAI

## System Architecture 🏗️

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:white;
    classDef router fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:white;
    classDef llmFast fill:#10b981,stroke:#059669,stroke-width:2px,color:white;
    classDef llmHeavy fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:white;
    classDef db fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:white;

    %% Nodes
    User([User Client / React UI]):::frontend
    API[FastAPI Backend Gateway]:::router
    
    %% Routing Logic
    QueryRouter{Query Classifier}:::router
    
    %% Simple Path
    Gemini[Gemini API / OpenRouter]:::llmFast
    
    %% Complex Path
    subgraph LangGraph Orchestration
        Groq[Groq API]:::llmHeavy
        Retriever[(Document Vector DB)]:::db
        GraphCore((StateGraph Core)):::router
    end
    
    %% TTS Path
    EdgeTTS[Edge-TTS Engine]:::llmFast

    %% Connections
    User -->|Chat / Voice Query| API
    API -->|Process| QueryRouter
    
    %% Paths
    QueryRouter -->|Simple / Chitchat| Gemini
    QueryRouter -->|Complex / Campus FAQ| GraphCore
    QueryRouter -->|Voice Stream| EdgeTTS
    
    %% Graph Internals
    GraphCore <--> Retriever
    GraphCore <--> Groq
    
    %% Returns
    Gemini -->|Fast Text Answer| API
    GraphCore -->|Grounded RAG Answer| API
    EdgeTTS -->|Audio Stream| API
    
    API -->|Response| User
```

## Getting Started 🚀

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory with your API keys:
```env
GEMINI_API_KEY="your_gemini_key"
GROQ_API_KEY="your_groq_key"
OPENROUTER_API_KEY="your_openrouter_key"
VOICE_OPENROUTER_API_KEY="your_voice_openrouter_key"
```

Start the backend server:
```bash
uvicorn app.main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to interact with Campus Friend!
