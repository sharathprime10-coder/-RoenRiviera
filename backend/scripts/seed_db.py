import os
import sys

# Add the backend directory to python path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.db import get_supabase_client, get_embeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_core.documents import Document

def seed_database():
    """Seed the Supabase database with mock data."""
    print("Initializing Supabase client and Embeddings...")
    try:
        supabase = get_supabase_client()
        embeddings = get_embeddings()
    except Exception as e:
        print(f"Error initializing: {e}")
        print("Make sure you have set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and GEMINI_API_KEY in your .env")
        return

    docs = [
        Document(
            page_content="CS101 covers Data Structures, Algorithms, and OOP. The midterm exam is on October 15th. The final exam covers all modules including Graph Theory and Dynamic Programming.",
            metadata={"document_id": "doc_cs101", "document_name": "CS101 Syllabus", "page": 1, "section": "Course Overview"}
        ),
        Document(
            page_content="Module 1: Arrays & Linked Lists. Module 2: Stacks & Queues. Module 3: Trees & Graphs. Module 4: Sorting & Searching. Module 5: Dynamic Programming.",
            metadata={"document_id": "doc_cs101", "document_name": "CS101 Syllabus", "page": 2, "section": "Module Breakdown"}
        ),
        Document(
            page_content="Library hours are 8 AM to 10 PM daily. The student services office is open from 9 AM to 5 PM on weekdays. The campus gym is open from 6 AM to 9 PM.",
            metadata={"document_id": "faq_001", "document_name": "Campus Policies", "section": "Facilities"}
        ),
        Document(
            page_content="RoenRiviera University offers over 50 undergraduate programs. The campus is located in a 200-acre green zone with modern facilities.",
            metadata={"document_id": "faq_general", "document_name": "General Campus Info", "section": "About"}
        )
    ]

    print(f"Uploading {len(docs)} documents to Supabase...")
    try:
        SupabaseVectorStore.from_documents(
            docs,
            embeddings,
            client=supabase,
            table_name="documents",
            query_name="match_documents"
        )
        print("Successfully seeded the database!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        print("Did you remember to run the backend/supabase_setup.sql in your Supabase SQL Editor?")

if __name__ == "__main__":
    seed_database()
