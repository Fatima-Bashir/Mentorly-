# @author: fatima bashir
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from typing import Optional
import httpx
import os

# Create FastAPI app
app = FastAPI(title="Mentorly AI Backend", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class ChatMessage(BaseModel):
    message: str
    resume_context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    status: str

# OpenAI API configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"

@app.get("/")
async def root():
    return {"message": "Mentorly AI Backend Running!", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "mentorly-ai"}

@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    try:
        # Prepare the system prompt
        system_prompt = """You are Mentorly, a personalized AI career mentor. You provide helpful, professional, and encouraging career advice. 

Key guidelines:
- Be warm, supportive, and professional
- Provide actionable, specific advice
- Ask follow-up questions to better understand the user's situation
- Reference common career challenges and solutions
- Keep responses concise but comprehensive
- Use encouraging language

Areas you help with:
- Resume optimization and ATS tips
- Interview preparation and practice
- Career transitions and skill development
- Salary negotiation strategies
- Professional networking advice
- Leadership development
- Work-life balance
- Industry insights"""

        # Add resume context if provided
        if chat_message.resume_context:
            system_prompt += f"\n\nUser's Resume Context: {chat_message.resume_context}"

        # Prepare OpenAI request
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-4o",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": chat_message.message}
            ],
            "max_tokens": 1000,
            "temperature": 0.7
        }

        # Make request to OpenAI
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(OPENAI_URL, headers=headers, json=payload)
            
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {response.status_code}")
            
        result = response.json()
        ai_response = result["choices"][0]["message"]["content"]
        
        return ChatResponse(response=ai_response, status="success")
        
    except httpx.TimeoutException:
        raise HTTPException(status_code=408, detail="Request timeout - please try again")
    except Exception as e:
        # Fallback response if OpenAI fails
        fallback_responses = {
            "resume tips": "Here are some key resume tips: 1) Use keywords from the job description 2) Quantify your achievements with numbers 3) Use action verbs 4) Keep it to 1-2 pages 5) Ensure ATS compatibility. Would you like me to elaborate on any of these points?",
            "interview": "For interview prep: 1) Research the company thoroughly 2) Practice STAR method answers 3) Prepare thoughtful questions 4) Practice common behavioral questions 5) Plan your outfit and route. What specific aspect of interview prep would you like to focus on?",
            "career": "Career transitions require planning: 1) Assess your transferable skills 2) Research target industries 3) Build relevant experience through projects 4) Network with professionals in your target field 5) Consider additional certifications. What career change are you considering?",
            "salary": "For salary negotiation: 1) Research market rates 2) Document your achievements 3) Practice your pitch 4) Consider the full package, not just salary 5) Be prepared to walk away if needed. What's your current situation?"
        }
        
        user_msg_lower = chat_message.message.lower()
        response_text = "I'm here to help with your career questions! I can assist with resume tips, interview preparation, career transitions, salary negotiation, and more. What specific area would you like guidance on?"
        
        for keyword, response in fallback_responses.items():
            if keyword in user_msg_lower:
                response_text = response
                break
                
        return ChatResponse(response=response_text, status="success")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
