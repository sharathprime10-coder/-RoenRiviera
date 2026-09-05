import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_core.documents import Document
from app.core.db import get_supabase_client, get_embeddings
from app.api.deps import verify_token

router = APIRouter()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: dict = Depends(verify_token)
):
    try:
        content = await file.read()
        text_content = content.decode('utf-8')
        
        # Simple paragraph-based chunking strategy
        paragraphs = [p.strip() for p in text_content.split('\n\n') if p.strip()]
        
        docs = []
        doc_id = str(uuid.uuid4())
        
        for i, para in enumerate(paragraphs):
            docs.append(
                Document(
                    page_content=para,
                    metadata={
                        "document_id": doc_id,
                        "document_name": file.filename,
                        "section": f"Chunk {i+1}"
                    }
                )
            )
            
        if not docs:
            raise HTTPException(status_code=400, detail="Empty document")

        supabase = get_supabase_client()
        embeddings = get_embeddings()
        
        SupabaseVectorStore.from_documents(
            docs,
            embeddings,
            client=supabase,
            table_name="documents",
            query_name="match_documents"
        )
        
        return {"filename": file.filename, "status": "success", "chunks": len(docs)}
        
    except Exception as e:
        print(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))
