# @author: fatima bashir
from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import structlog

from app.services.embeddings import EmbeddingService

logger = structlog.get_logger()
router = APIRouter()


class EmbeddingRequest(BaseModel):
    """Embedding request model."""
    texts: List[str]


class EmbeddingResponse(BaseModel):
    """Embedding response model."""
    embeddings: List[List[float]]
    model: str
    dimension: int


@router.post("/generate", response_model=EmbeddingResponse)
async def generate_embeddings(request: EmbeddingRequest):
    """
    Generate embeddings for given texts.
    """
    try:
        logger.info("Generating embeddings", text_count=len(request.texts))
        
        embedding_service = EmbeddingService()
        embeddings = await embedding_service.embed_texts(request.texts)
        
        return EmbeddingResponse(
            embeddings=embeddings,
            model="text-embedding-3-small",
            dimension=len(embeddings[0]) if embeddings else 0,
        )
        
    except Exception as e:
        logger.error("Embedding generation failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

