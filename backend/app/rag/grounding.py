from typing import List, Dict, Any, Tuple
import re
from app.schemas.chat import SourceItem

def check_evidence_sufficiency(query: str, retrieved_chunks: List[Dict[str, Any]]) -> bool:
    """
    Checks if the retrieved chunks likely contain enough information to answer the query.
    This prevents the LLM from hallucinating when no relevant data is found.
    """
    if not retrieved_chunks:
        return False
        
    stopwords = {"a", "an", "the", "in", "on", "at", "to", "for", "is", "are", "was", "were", "and", "or", "of", "what", "how", "when", "where", "why"}
    query_words = set(w.lower() for w in query.split() if w.lower() not in stopwords and len(w) > 2)
    
    combined_text = " ".join([c.get("content", "").lower() for c in retrieved_chunks])
    
    for word in query_words:
        if word in combined_text:
            return True
            
    return False

def validate_claim_against_evidence(claim: str, retrieved_chunks: List[Dict[str, Any]]) -> bool:
    """
    Validates that the generated response does not invent facts outside the provided evidence.
    """
    combined_text = " ".join([c.get("content", "").lower() for c in retrieved_chunks])
    sentences = [s.strip() for s in re.split(r'[.!?]+', claim) if s.strip()]
    
    if not sentences:
        return True
        
    stopwords = {"a", "an", "the", "in", "on", "at", "to", "for", "is", "are", "was", "were", "and", "or", "of"}
    supported_sentences = 0
    
    for sentence in sentences:
        words = [w.lower() for w in sentence.split() if len(w) > 3 and w.lower() not in stopwords]
        
        # If the sentence has no significant words, consider it supported (e.g., greetings, filler)
        if not words:
            supported_sentences += 1
            continue
            
        overlap = sum(1 for w in words if w in combined_text)
        if overlap > 0:
            supported_sentences += 1
            
    # Require at least half of the sentences to be supported
    return (supported_sentences / len(sentences)) >= 0.5

def map_citations(response_text: str, retrieved_chunks: List[Dict[str, Any]]) -> Tuple[bool, List[SourceItem]]:
    """
    Maps claims in the response back to the source chunks.
    If integrity fails, it returns grounded=False.
    """
    sources = []
    
    for chunk in retrieved_chunks:
        sources.append(SourceItem(
            document_id=chunk.get("document_id", "unknown"),
            document_name=chunk.get("document_name", "Unknown Document"),
            page=chunk.get("page", None),
            section=chunk.get("section", None),
            snippet=chunk.get("content", "")[:100] + "...",
            source_type="official"
        ))
        
    is_grounded = validate_claim_against_evidence(response_text, retrieved_chunks)
    return is_grounded, sources
