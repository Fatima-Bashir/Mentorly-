# @author: fatima bashir
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI application
app = FastAPI(
    title="Mentorly RAG Service",
    description="AI-powered retrieval-augmented generation service for career mentorship",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Mentorly RAG Service", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "rag"}

@app.post("/api/v1/chat")
async def chat_endpoint(message: dict):
    """Simple chat endpoint for testing."""
    user_message = message.get("message", "")
    
    # Simple echo response for now - you can integrate with OpenAI later
    response = {
        "response": f"Thanks for your message: '{user_message}'. The AI backend is running! You can now integrate this with OpenAI or your preferred AI service.",
        "status": "success",
        "timestamp": "2024-01-01T00:00:00Z"
    }
    
    return response

@app.get("/api/v1/status")
async def status():
    """API status endpoint."""
    return {
        "api": "v1",
        "status": "operational",
        "features": ["chat", "health_check"],
        "message": "Backend is running successfully!"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
