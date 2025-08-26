# @author: fatima bashir
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Create FastAPI app
app = FastAPI(title="Mentorly AI")

# Configure CORS - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    resume_context: str = None

@app.get("/")
async def root():
    return {"message": "Mentorly AI Backend is running!", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "mentorly-ai"}

@app.post("/api/v1/chat")
async def chat(request: ChatRequest):
    user_message = request.message.lower()
    
    # Simple rule-based responses for now
    if "resume" in user_message or "cv" in user_message:
        response = """Great question about resumes! Here are my top recommendations:

🎯 **ATS Optimization:**
• Use keywords from the job description
• Include both acronyms and full terms (e.g., "AI" and "Artificial Intelligence")
• Use standard section headers (Experience, Education, Skills)

✨ **Content Tips:**
• Quantify achievements with numbers and percentages
• Use action verbs (Led, Developed, Improved, Achieved)
• Focus on results and impact, not just responsibilities

📋 **Format Guidelines:**
• Keep it to 1-2 pages maximum
• Use consistent formatting and fonts
• Save as PDF to preserve formatting

Would you like me to help you with any specific section of your resume?"""

    elif "interview" in user_message:
        response = """Excellent! Interview preparation is crucial. Here's my comprehensive guide:

🔍 **Research Phase:**
• Study the company's mission, values, and recent news
• Research the interviewer(s) on LinkedIn
• Understand the role requirements thoroughly

🗣️ **Practice Preparation:**
• Use the STAR method (Situation, Task, Action, Result) for behavioral questions
• Prepare 5-7 compelling stories that showcase your skills
• Practice common questions out loud

❓ **Questions to Ask:**
• "What does success look like in this role in the first 90 days?"
• "What are the biggest challenges facing the team right now?"
• "How do you support professional development here?"

What type of interview are you preparing for?"""

    elif "salary" in user_message or "negotiation" in user_message:
        response = """Smart to think about salary negotiation! Here's my strategic approach:

📊 **Research Phase:**
• Use Glassdoor, PayScale, and Levels.fyi for market data
• Consider location, experience level, and company size
• Research the full compensation package (benefits, equity, etc.)

💼 **Preparation:**
• Document your achievements and quantifiable impact
• Prepare your "value proposition" - why you deserve this salary
• Practice your negotiation conversation

🎯 **Negotiation Strategy:**
• Wait for the offer before discussing salary
• Express enthusiasm first, then negotiate
• Ask for time to consider if needed
• Be prepared to walk away if the offer doesn't meet your needs

What's your current situation? Are you negotiating a new offer or considering asking for a raise?"""

    elif "career" in user_message or "transition" in user_message:
        response = """Career transitions can be exciting! Here's how to approach it strategically:

🎯 **Self-Assessment:**
• Identify your transferable skills
• Clarify your values and what motivates you
• Define your ideal role and industry

📚 **Skill Development:**
• Research required skills for your target role
• Take relevant courses or certifications
• Build a portfolio or side projects to demonstrate capabilities

🌐 **Networking:**
• Connect with professionals in your target industry
• Attend industry events and webinars
• Consider informational interviews

📝 **Application Strategy:**
• Tailor your resume to highlight relevant experience
• Write compelling cover letters that explain your transition
• Practice explaining your career change story

What kind of career transition are you considering?"""

    else:
        response = f"""Hi! Thanks for reaching out. I'm Mentorly, your AI career mentor! 👋

I see you said: "{request.message}"

I'm here to help you with all aspects of your career journey:

💼 **Career Development:**
• Resume optimization and ATS strategies
• Interview preparation and practice
• Career transition planning
• Professional skill development

🎯 **Strategic Guidance:**
• Salary negotiation techniques
• Networking and relationship building
• Leadership development
• Work-life balance optimization

What specific area would you like to explore today? Feel free to ask me anything about your career goals!"""

    return {"response": response, "status": "success"}

if __name__ == "__main__":
    print("Starting Mentorly AI Backend...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
