# @author: fatima bashir
from fastapi import APIRouter
from app.api.v1.endpoints import search, embeddings, documents

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(embeddings.router, prefix="/embeddings", tags=["embeddings"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])

