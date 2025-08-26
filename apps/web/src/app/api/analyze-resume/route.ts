// @author: fatima bashir
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface AnalyzeResumeRequest {
  resumeText: string;
  parsedContent: {
    name: string;
    contact: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
    rawText: string;
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  console.log('🤖 Resume analysis API called');
  
  try {
    const { resumeText, parsedContent }: AnalyzeResumeRequest = await request.json();
    
    console.log('📄 Request received - Resume text length:', resumeText?.length || 0);
    console.log('📄 Parsed content keys:', Object.keys(parsedContent || {}));
    
    if (!resumeText || resumeText.trim() === '') {
      console.error('❌ No resume text provided');
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    // Create system prompt for resume analysis
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer and career consultant. Analyze the provided resume and return a JSON response with specific, actionable feedback.

CRITICAL: Your response must be VALID JSON only, no additional text or formatting.

Analyze the resume for:
1. ATS compatibility and keyword optimization
2. Content strength and quantified achievements  
3. Structure and formatting
4. Missing elements that could improve hiring chances
5. Specific skills gaps for modern job market

Return JSON in this EXACT format:
{
  "atsScore": [number between 60-95],
  "keywordMatches": [number between 8-25],
  "missingSkills": [array of 3-6 relevant technical/industry skills that would improve this resume],
  "strengths": [array of 2-4 actual strengths found in this specific resume],
  "improvements": [array of 3-5 specific actionable improvements for this exact resume],
  "personalizedTips": {
    "contentKeywords": [array of 2-4 specific tips about content/keywords for this resume],
    "formatStructure": [array of 1-3 specific formatting/structure tips for this resume],
    "skillsCertifications": [array of 2-3 skills/certification recommendations for this resume],
    "commonMistakes": [array of 1-3 specific mistakes found in this resume to fix]
  }
}

Be specific and actionable - reference actual content from the resume when possible.`;

    const userPrompt = `Please analyze this resume and provide detailed feedback:

RESUME CONTENT:
${resumeText}

PARSED SECTIONS:
Name: ${parsedContent.name || 'Not clearly identified'}
Contact: ${parsedContent.contact || 'Not clearly identified'}
Summary: ${parsedContent.summary || 'No professional summary found'}
Experience: ${parsedContent.experience ? 'Present' : 'Not clearly identified'}
Education: ${parsedContent.education || 'Not clearly identified'}
Skills: ${parsedContent.skills || 'Not clearly identified'}

Provide specific analysis based on the actual content above.`;

    // Call OpenAI API
    console.log('🤖 Calling OpenAI API...');
    console.log('🔑 API Key available:', !!process.env.OPENAI_API_KEY);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.3, // Lower temperature for more consistent analysis
    });

    console.log('✅ OpenAI API call successful');
    console.log('📝 Response length:', completion.choices[0]?.message?.content?.length || 0);

    let response = completion.choices[0]?.message?.content || '';
    
    // Clean up the response to ensure it's valid JSON
    response = response.trim();
    
    // Remove any markdown code block formatting if present
    if (response.startsWith('```json')) {
      response = response.replace(/```json\s*/, '').replace(/```\s*$/, '');
    }
    if (response.startsWith('```')) {
      response = response.replace(/```\s*/, '').replace(/```\s*$/, '');
    }

    try {
      // Parse the JSON to validate it
      const analysisResults = JSON.parse(response);
      
      // Validate the structure and add defaults if needed
      const validatedResults = {
        atsScore: analysisResults.atsScore || 75,
        keywordMatches: analysisResults.keywordMatches || 12,
        missingSkills: Array.isArray(analysisResults.missingSkills) ? analysisResults.missingSkills : ['Communication', 'Project Management', 'Data Analysis'],
        strengths: Array.isArray(analysisResults.strengths) ? analysisResults.strengths : ['Technical background', 'Work experience'],
        improvements: Array.isArray(analysisResults.improvements) ? analysisResults.improvements : ['Add more keywords', 'Quantify achievements'],
        personalizedTips: {
          contentKeywords: Array.isArray(analysisResults.personalizedTips?.contentKeywords) ? analysisResults.personalizedTips.contentKeywords : ['Add industry-specific keywords'],
          formatStructure: Array.isArray(analysisResults.personalizedTips?.formatStructure) ? analysisResults.personalizedTips.formatStructure : ['Use consistent formatting'],
          skillsCertifications: Array.isArray(analysisResults.personalizedTips?.skillsCertifications) ? analysisResults.personalizedTips.skillsCertifications : ['Consider relevant certifications'],
          commonMistakes: Array.isArray(analysisResults.personalizedTips?.commonMistakes) ? analysisResults.personalizedTips.commonMistakes : ['Review for typos and formatting']
        },
        analyzedAt: new Date().toISOString()
      };

      return NextResponse.json({
        analysis: validatedResults,
        status: 'success'
      });

    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      console.error('Raw response:', response);
      
      // Fallback analysis if JSON parsing fails
      const fallbackAnalysis = {
        atsScore: 72,
        keywordMatches: 10,
        missingSkills: ['Project Management', 'Data Analysis', 'Communication Skills'],
        strengths: ['Professional experience', 'Educational background'],
        improvements: ['Add quantified achievements', 'Include more industry keywords', 'Optimize for ATS'],
        personalizedTips: {
          contentKeywords: ['Add specific technical skills from job postings', 'Include quantified results with numbers and percentages'],
          formatStructure: ['Use standard section headings', 'Ensure consistent date formatting'],
          skillsCertifications: ['Consider adding relevant certifications', 'Highlight technical skills'],
          commonMistakes: ['Review resume for ATS-friendly formatting', 'Avoid using tables or graphics']
        },
        analyzedAt: new Date().toISOString()
      };

      return NextResponse.json({
        analysis: fallbackAnalysis,
        status: 'success',
        note: 'Analysis completed with fallback due to formatting issues'
      });
    }

  } catch (error) {
    console.error('❌ Resume analysis API error:', error);
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Fallback analysis for any API errors
    const fallbackAnalysis = {
      atsScore: 75,
      keywordMatches: 12,
      missingSkills: ['Communication', 'Project Management', 'Problem Solving'],
      strengths: ['Relevant experience', 'Educational qualifications'],
      improvements: ['Optimize for ATS systems', 'Add quantified achievements', 'Include relevant keywords'],
      personalizedTips: {
        contentKeywords: ['Research job postings for relevant keywords to include'],
        formatStructure: ['Use a clean, ATS-friendly format'],
        skillsCertifications: ['Consider industry-relevant certifications'],
        commonMistakes: ['Ensure consistent formatting throughout']
      },
      analyzedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      analysis: fallbackAnalysis,
      status: 'success',
      note: 'Analysis completed with fallback due to service unavailability'
    });
  }
}
