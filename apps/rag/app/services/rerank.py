# @author: fatima bashir
from typing import List, Dict, Any
import asyncio
import structlog
from sentence_transformers import CrossEncoder

from app.core.config import settings

logger = structlog.get_logger()


class RerankService:
    """Service for reranking search results."""
    
    def __init__(self):
        self.cross_encoder = None
        
    async def rerank(
        self,
        query: str,
        results: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Rerank search results using a cross-encoder model.
        """
        try:
            if len(results) <= 1:
                return results
            
            # Initialize model if needed
            if self.cross_encoder is None:
                await self._initialize_model()
            
            # Prepare query-document pairs
            query_doc_pairs = [
                (query, result["content"]) for result in results
            ]
            
            # Run reranking in thread pool
            loop = asyncio.get_event_loop()
            scores = await loop.run_in_executor(
                None, self.cross_encoder.predict, query_doc_pairs
            )
            
            # Update results with rerank scores
            for i, result in enumerate(results):
                result["rerank_score"] = float(scores[i])
                # Combine with original score
                result["final_score"] = (
                    0.7 * float(scores[i]) + 0.3 * result.get("score", 0.0)
                )
            
            # Sort by final score
            reranked_results = sorted(
                results,
                key=lambda x: x["final_score"],
                reverse=True
            )
            
            logger.info(
                "Reranking completed",
                original_count=len(results),
                reranked_count=min(len(reranked_results), top_k)
            )
            
            return reranked_results[:top_k]
            
        except Exception as e:
            logger.error("Reranking failed, returning original results", error=str(e))
            # Fallback to original results
            return results[:top_k]
    
    async def _initialize_model(self):
        """
        Initialize the cross-encoder model.
        """
        try:
            loop = asyncio.get_event_loop()
            self.cross_encoder = await loop.run_in_executor(
                None,
                CrossEncoder,
                'cross-encoder/ms-marco-MiniLM-L-2-v2'
            )
            logger.info("Cross-encoder model initialized successfully")
            
        except Exception as e:
            logger.error("Failed to initialize cross-encoder model", error=str(e))
            raise
    
    def score_relevance(self, query: str, document: str) -> float:
        """
        Score relevance between query and document.
        """
        try:
            if self.cross_encoder is None:
                return 0.0
            
            score = self.cross_encoder.predict([(query, document)])
            return float(score[0]) if isinstance(score, (list, tuple)) else float(score)
            
        except Exception as e:
            logger.error("Relevance scoring failed", error=str(e))
            return 0.0

