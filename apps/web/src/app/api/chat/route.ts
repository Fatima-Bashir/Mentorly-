// @author: fatima bashir
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface ChatRequest {
  message: string;
  resume_context?: string;
  conversation_history?: Array<{role: 'user' | 'assistant', content: string}>;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { message, resume_context, conversation_history = [] }: ChatRequest = await request.json();
    
    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create system prompt for Mentorly AI career mentor
    const systemPrompt = `You are Mentorly, an expert AI career mentor. You provide specific, actionable career advice tailored to each person's interests, skills, and situation.

Your personality:
- Conversational and friendly, like talking to a knowledgeable friend
- Give specific job titles with salary ranges when relevant (use realistic US market rates)
- Provide concrete next steps and actionable advice
- Ask targeted follow-up questions to understand their interests better
- Avoid generic responses - be specific to their situation
- Be concise but thorough - aim for helpful, not overwhelming

CRITICAL FORMATTING REQUIREMENTS:
- NEVER use ANY markdown formatting - no asterisks, underscores, or symbols
- NO bold formatting, NO italic formatting, NO underlines, NO code blocks
- Write in plain text only - job titles without any special formatting
- Use natural language emphasis instead of symbols
- Structure with bullet points and line breaks, but NO formatting symbols

When someone mentions an interest (math, science, art, writing, etc.), provide:
- 8-12 specific career paths with salary ranges
- Concrete next steps (courses, certifications, companies to research)
- Targeted follow-up questions about what specifically interests them

When someone asks about career struggles or uncertainty:
- Acknowledge their feelings with empathy
- Give specific, actionable steps they can take
- Focus on practical solutions rather than just exploration

${resume_context ? `User's Resume Context: ${resume_context}

Use this context to give personalized advice based on their background and experience.` : ''}

Be helpful, specific, and action-oriented in every response. Remember: NO MARKDOWN FORMATTING.`;

    // Build messages array for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation_history.map(msg => ({ 
        role: msg.role, 
        content: msg.content 
      })),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      max_tokens: 1200,
      temperature: 0.7,
    });

    let response = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try asking your question again.';

    // Strip out ALL markdown formatting
    response = response
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
      .replace(/\*(.*?)\*/g, '$1')     // Remove *italic*
      .replace(/__(.*?)__/g, '$1')     // Remove __bold__
      .replace(/_(.*?)_/g, '$1')       // Remove _italic_
      .replace(/`(.*?)`/g, '$1')       // Remove `code`
      .replace(/~~(.*?)~~/g, '$1')     // Remove ~~strikethrough~~
      .replace(/### (.*?)(\n|$)/g, '$1$2')  // Remove ### headers
      .replace(/## (.*?)(\n|$)/g, '$1$2')   // Remove ## headers
      .replace(/# (.*?)(\n|$)/g, '$1$2');   // Remove # headers

    return NextResponse.json({
      response: response,
      status: 'success'
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback response if OpenAI fails
    const fallbackResponse = `I'm here to help with your career! I can assist with resume tips, interview prep, career transitions, salary negotiation, and exploring career paths based on your specific interests and situation. What would you like guidance on?`;
    
    return NextResponse.json({
      response: fallbackResponse,
      status: 'success'
    });
  }
}