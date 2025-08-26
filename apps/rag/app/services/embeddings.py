# @author: fatima bashir
from typing import List, Union
import asyncio
import openai
import structlog
from sentence_transformers import SentenceTransformer
import numpy as np

from app.core.config import settings

logger = structlog.get_logger()


class EmbeddingService:
    """Service for generating text embeddings."""
    
    def __init__(self):
        self.openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        # Initialize sentence transformer as fallback
        self.st_model = None
        
    async def embed_text(self, text: str) -> List[float]:
        """
        Generate embedding for a single text.
        """
        return await self.embed_texts([text])[0]
    
    async def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts using OpenAI API.
        """
        try:
            # Batch process texts
            embeddings = []
            batch_size = 50  # OpenAI's batch limit
            
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                batch_embeddings = await self._embed_batch_openai(batch)
                embeddings.extend(batch_embeddings)
            
            return embeddings
            
        except Exception as e:
            logger.error("OpenAI embedding failed, falling back to sentence-transformers", error=str(e))
            return await self._embed_texts_fallback(texts)
    
    async def _embed_batch_openai(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings using OpenAI API.
        """
        try:
            response = await self.openai_client.embeddings.create(
                model=settings.EMBEDDING_MODEL,
                input=texts
            )
            
            embeddings = [item.embedding for item in response.data]
            
            logger.debug(
                "Generated OpenAI embeddings",
                batch_size=len(texts),
                model=settings.EMBEDDING_MODEL
            )
            
            return embeddings
            
        except Exception as e:
            logger.error("OpenAI embedding batch failed", error=str(e))
            raise
    
    async def _embed_texts_fallback(self, texts: List[str]) -> List[List[float]]:
        """
        Fallback embedding using sentence-transformers.
        """
        try:
            # Initialize model if not already done
            if self.st_model is None:
                self.st_model = SentenceTransformer('all-MiniLM-L6-v2')
            
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            embeddings = await loop.run_in_executor(
                None, self.st_model.encode, texts
            )
            
            # Convert numpy arrays to lists
            embeddings_list = [emb.tolist() for emb in embeddings]
            
            logger.debug(
                "Generated fallback embeddings",
                batch_size=len(texts),
                model="all-MiniLM-L6-v2"
            )
            
            return embeddings_list
            
        except Exception as e:
            logger.error("Fallback embedding failed", error=str(e))
            raise
    
    def cosine_similarity(self, a: List[float], b: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings.
        """
        a_np = np.array(a)
        b_np = np.array(b)
        
        dot_product = np.dot(a_np, b_np)
        norm_a = np.linalg.norm(a_np)
        norm_b = np.linalg.norm(b_np)
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
        
        return dot_product / (norm_a * norm_b)
    
    async def find_most_similar(
        self,
        query_embedding: List[float],
        candidate_embeddings: List[List[float]],
        top_k: int = 5
    ) -> List[int]:
        """
        Find indices of most similar embeddings to query.
        """
        similarities = []
        
        for i, candidate in enumerate(candidate_embeddings):
            similarity = self.cosine_similarity(query_embedding, candidate)
            similarities.append((i, similarity))
        
        # Sort by similarity descending
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Return top-k indices
        return [idx for idx, _ in similarities[:top_k]]

