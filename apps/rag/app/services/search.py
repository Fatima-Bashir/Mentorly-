# @author: fatima bashir
from typing import List, Dict, Optional, Any
import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
import structlog
import openai

from app.core.config import settings
from app.services.embeddings import EmbeddingService

logger = structlog.get_logger()


class SearchService:
    """Service for hybrid search combining BM25 and semantic search."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.embedding_service = EmbeddingService()
        self.openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
    async def hybrid_search(
        self,
        query: str,
        user_id: Optional[str] = None,
        top_k: int = 10,
        filters: Optional[Dict] = None,
    ) -> List[Dict[str, Any]]:
        """
        Perform hybrid search combining BM25 and semantic search.
        """
        try:
            # Run both searches in parallel
            semantic_task = asyncio.create_task(
                self.semantic_search(query, user_id, top_k * 2, filters)
            )
            keyword_task = asyncio.create_task(
                self.keyword_search(query, user_id, top_k * 2, filters)
            )
            
            semantic_results, keyword_results = await asyncio.gather(
                semantic_task, keyword_task
            )
            
            # Combine and rerank results
            combined_results = self._combine_search_results(
                semantic_results, keyword_results, query
            )
            
            # Return top-k results
            return combined_results[:top_k]
            
        except Exception as e:
            logger.error("Hybrid search failed", error=str(e), query=query)
            raise
    
    async def semantic_search(
        self,
        query: str,
        user_id: Optional[str] = None,
        top_k: int = 10,
        filters: Optional[Dict] = None,
    ) -> List[Dict[str, Any]]:
        """
        Perform semantic search using vector similarity.
        """
        try:
            # Generate query embedding
            query_embedding = await self.embedding_service.embed_text(query)
            
            # Build SQL query
            sql_query = """
                SELECT 
                    dc.id,
                    dc.content,
                    dc.metadata,
                    a.title as source,
                    (1 - (dc.embedding <=> %s::vector)) as similarity_score
                FROM doc_chunks dc
                LEFT JOIN artifacts a ON dc.artifact_id = a.id
                WHERE dc.embedding IS NOT NULL
            """
            
            params = [str(query_embedding)]
            
            # Add user filter if provided
            if user_id:
                sql_query += " AND a.user_id = %s"
                params.append(user_id)
            
            # Add additional filters
            if filters:
                for key, value in filters.items():
                    if key == "artifact_type":
                        sql_query += " AND a.type = %s"
                        params.append(value)
            
            # Add similarity threshold and ordering
            sql_query += f"""
                AND (1 - (dc.embedding <=> %s::vector)) > {settings.SIMILARITY_THRESHOLD}
                ORDER BY dc.embedding <=> %s::vector
                LIMIT %s
            """
            params.extend([str(query_embedding), str(query_embedding), top_k])
            
            # Execute query
            result = await self.db.execute(text(sql_query), params)
            rows = result.fetchall()
            
            # Format results
            results = []
            for row in rows:
                results.append({
                    "id": row.id,
                    "content": row.content,
                    "score": float(row.similarity_score),
                    "metadata": row.metadata,
                    "source": row.source,
                    "search_type": "semantic"
                })
            
            logger.info(
                "Semantic search completed",
                query=query,
                results_count=len(results)
            )
            
            return results
            
        except Exception as e:
            logger.error("Semantic search failed", error=str(e), query=query)
            raise
    
    async def keyword_search(
        self,
        query: str,
        user_id: Optional[str] = None,
        top_k: int = 10,
        filters: Optional[Dict] = None,
    ) -> List[Dict[str, Any]]:
        """
        Perform keyword search using PostgreSQL full-text search.
        """
        try:
            # Build SQL query with trigram similarity
            sql_query = """
                SELECT 
                    dc.id,
                    dc.content,
                    dc.metadata,
                    a.title as source,
                    SIMILARITY(dc.content, %s) as bm25_score
                FROM doc_chunks dc
                LEFT JOIN artifacts a ON dc.artifact_id = a.id
                WHERE SIMILARITY(dc.content, %s) > 0.1
            """
            
            params = [query, query]
            
            # Add user filter if provided
            if user_id:
                sql_query += " AND a.user_id = %s"
                params.append(user_id)
            
            # Add additional filters
            if filters:
                for key, value in filters.items():
                    if key == "artifact_type":
                        sql_query += " AND a.type = %s"
                        params.append(value)
            
            # Order by similarity and limit
            sql_query += """
                ORDER BY SIMILARITY(dc.content, %s) DESC
                LIMIT %s
            """
            params.extend([query, top_k])
            
            # Execute query
            result = await self.db.execute(text(sql_query), params)
            rows = result.fetchall()
            
            # Format results
            results = []
            for row in rows:
                results.append({
                    "id": row.id,
                    "content": row.content,
                    "score": float(row.bm25_score),
                    "metadata": row.metadata,
                    "source": row.source,
                    "search_type": "keyword"
                })
            
            logger.info(
                "Keyword search completed",
                query=query,
                results_count=len(results)
            )
            
            return results
            
        except Exception as e:
            logger.error("Keyword search failed", error=str(e), query=query)
            raise
    
    def _combine_search_results(
        self,
        semantic_results: List[Dict],
        keyword_results: List[Dict],
        query: str,
    ) -> List[Dict[str, Any]]:
        """
        Combine and rerank results from semantic and keyword search.
        """
        # Create a dictionary to track unique results
        combined = {}
        
        # Add semantic results
        for result in semantic_results:
            doc_id = result["id"]
            combined[doc_id] = result
            combined[doc_id]["semantic_score"] = result["score"]
            combined[doc_id]["keyword_score"] = 0.0
        
        # Add keyword results
        for result in keyword_results:
            doc_id = result["id"]
            if doc_id in combined:
                # Update existing result with keyword score
                combined[doc_id]["keyword_score"] = result["score"]
            else:
                # Add new result
                combined[doc_id] = result
                combined[doc_id]["semantic_score"] = 0.0
                combined[doc_id]["keyword_score"] = result["score"]
        
        # Calculate hybrid scores
        for doc_id, result in combined.items():
            semantic_score = result.get("semantic_score", 0.0)
            keyword_score = result.get("keyword_score", 0.0)
            
            # Weighted combination
            hybrid_score = (
                settings.SEMANTIC_SEARCH_WEIGHT * semantic_score +
                settings.BM25_SEARCH_WEIGHT * keyword_score
            )
            
            result["score"] = hybrid_score
            result["search_type"] = "hybrid"
        
        # Sort by hybrid score
        sorted_results = sorted(
            combined.values(),
            key=lambda x: x["score"],
            reverse=True
        )
        
        return sorted_results

