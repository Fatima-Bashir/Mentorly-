// @author: fatima bashir
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing OpenAI API configuration...');
    console.log('🔑 API Key configured:', !!process.env.OPENAI_API_KEY);
    console.log('🔑 API Key first 10 chars:', process.env.OPENAI_API_KEY?.substring(0, 10));
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        status: 'error',
        message: 'OpenAI API key not configured in environment variables'
      }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Simple test with minimal token usage
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use cheaper model for testing
      messages: [{ role: 'user', content: 'Say hello' }],
      max_tokens: 10,
      temperature: 0.1,
    });

    const response = completion.choices[0]?.message?.content || 'No response';

    return NextResponse.json({
      status: 'success',
      message: 'OpenAI API is working correctly',
      test_response: response,
      api_key_configured: true
    });

  } catch (error) {
    console.error('❌ OpenAI Test Error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'OpenAI API test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      api_key_configured: !!process.env.OPENAI_API_KEY
    }, { status: 500 });
  }
}

