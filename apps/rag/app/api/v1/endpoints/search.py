# @author: fatima bashir
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import structlog

from app.core.database import get_db
from app.services.search import SearchService
from app.services.rerank import RerankService

logger = structlog.get_logger()
router = APIRouter()


class SearchQuery(BaseModel):
    """Search query model."""
    query: str
    user_id: Optional[str] = None
    top_k: int = 10
    include_metadata: bool = True
    filters: Optional[dict] = None


class SearchResult(BaseModel):
    """Search result model."""
    content: str
    score: float
    metadata: Optional[dict] = None
    source: Optional[str] = None


class SearchResponse(BaseModel):
    """Search response model."""
    results: List[SearchResult]
    query: str
    total_results: int
    search_time_ms: float


@router.post("/hybrid", response_model=SearchResponse)
async def hybrid_search(
    query: SearchQuery,
    db = Depends(get_db),
):
    """
    Perform hybrid search using BM25 + semantic similarity + reranking.
    """
    try:
        logger.info("Hybrid search request", query=query.query, user_id=query.user_id)
        
        # Initialize services
        search_service = SearchService(db)
        rerank_service = RerankService()
        
        # Perform search
        results = await search_service.hybrid_search(
            query=query.query,
            user_id=query.user_id,
            top_k=query.top_k,
            filters=query.filters,
        )
        
        # Rerank results
        reranked_results = await rerank_service.rerank(
            query=query.query,
            results=results,
            top_k=min(query.top_k, 10)  # Limit reranking
        )
        
        # Format response
        search_results = [
            SearchResult(
                content=result["content"],
                score=result["score"],
                metadata=result.get("metadata") if query.include_metadata else None,
                source=result.get("source"),
            )
            for result in reranked_results
        ]
        
        return SearchResponse(
            results=search_results,
            query=query.query,
            total_results=len(search_results),
            search_time_ms=0.0,  # TODO: Add timing
        )
        
    except Exception as e:
        logger.error("Hybrid search failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/semantic", response_model=SearchResponse)
async def semantic_search(
    query: SearchQuery,
    db = Depends(get_db),
):
    """
    Perform semantic search using vector similarity.
    """
    try:
        logger.info("Semantic search request", query=query.query, user_id=query.user_id)
        
        search_service = SearchService(db)
        results = await search_service.semantic_search(
            query=query.query,
            user_id=query.user_id,
            top_k=query.top_k,
            filters=query.filters,
        )
        
        search_results = [
            SearchResult(
                content=result["content"],
                score=result["score"],
                metadata=result.get("metadata") if query.include_metadata else None,
                source=result.get("source"),
            )
            for result in results
        ]
        
        return SearchResponse(
            results=search_results,
            query=query.query,
            total_results=len(search_results),
            search_time_ms=0.0,
        )
        
    except Exception as e:
        logger.error("Semantic search failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/keyword", response_model=SearchResponse)
async def keyword_search(
    query: SearchQuery,
    db = Depends(get_db),
):
    """
    Perform keyword search using BM25.
    """
    try:
        logger.info("Keyword search request", query=query.query, user_id=query.user_id)
        
        search_service = SearchService(db)
        results = await search_service.keyword_search(
            query=query.query,
            user_id=query.user_id,
            top_k=query.top_k,
            filters=query.filters,
        )
        
        search_results = [
            SearchResult(
                content=result["content"],
                score=result["score"],
                metadata=result.get("metadata") if query.include_metadata else None,
                source=result.get("source"),
            )
            for result in results
        ]
        
        return SearchResponse(
            results=search_results,
            query=query.query,
            total_results=len(search_results),
            search_time_ms=0.0,
        )
        
    except Exception as e:
        logger.error("Keyword search failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

