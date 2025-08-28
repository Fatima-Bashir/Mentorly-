// @author: fatima bashir
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface SectionTipsRequest {
  section: string;
  data: string;
  context: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  console.log('🤖 Section tips API called');
  
  try {
    const { section, data, context }: SectionTipsRequest = await request.json();
    
    console.log('📄 Request received for section:', section);
    console.log('📄 Data length:', data?.length || 0);
    
    if (!section || !data) {
      console.error('❌ Missing section or data');
      return NextResponse.json(
        { error: 'Section and data are required' },
        { status: 400 }
      );
    }

    // Create system prompt for section-specific tips
    const systemPrompt = `You are an expert resume consultant. Analyze the provided ${context} and return highly specific, personalized tips based on the ACTUAL content shown.

CRITICAL: Your response must be VALID JSON only, in this exact format:
{
  "tips": [
    "specific tip 1 referencing actual content from this resume",
    "specific tip 2 referencing actual content from this resume", 
    "specific tip 3 referencing actual content from this resume",
    "specific tip 4 referencing actual content from this resume"
  ]
}

REQUIREMENTS:
1. DO NOT give generic advice - analyze what's actually provided
2. Reference specific content from their resume (names, companies, skills, etc.)
3. Point out what's missing or could be improved in their specific case
4. Give actionable suggestions based on what they currently have
5. If content is strong, acknowledge it specifically
6. If content is missing or weak, suggest specific improvements

Examples of GOOD specific tips:
- "Your email 'john123@gmail.com' could be more professional - consider john.smith@gmail.com instead"
- "Your Software Engineer role at TechCorp lacks quantified achievements - add metrics like 'improved system performance by X%'"
- "You list JavaScript and Python but don't mention any frameworks - consider adding React, Django, or similar technologies you've used"

Examples of BAD generic tips:
- "Use a professional email address"
- "Add quantified achievements" 
- "Include relevant skills"

Analyze the actual content provided and be specific to THIS resume.`;

    const userPrompt = `Analyze this ${context} from a real resume and provide highly specific, personalized improvement tips:

SECTION: ${section}
ACTUAL CONTENT FROM THEIR RESUME:
${data}

INSTRUCTIONS:
- Look at what they ACTUALLY have (names, companies, skills, achievements, etc.)
- Identify specific strengths in their content and acknowledge them
- Point out specific weaknesses or missing elements 
- Reference their actual data in your suggestions
- Don't give generic advice - be specific to THEIR resume
- If something is missing entirely, suggest what specifically they should add
- If something exists but needs improvement, explain exactly how to improve it

Provide 3-4 specific, personalized tips that reference their actual resume content.`;

    // Call OpenAI API
    console.log('🤖 Calling OpenAI API for section tips...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    console.log('✅ OpenAI API call successful');
    
    let response = completion.choices[0]?.message?.content || '';
    
    // Clean up the response
    response = response.trim();
    if (response.startsWith('```json')) {
      response = response.replace(/```json\s*/, '').replace(/```\s*$/, '');
    }
    if (response.startsWith('```')) {
      response = response.replace(/```\s*/, '').replace(/```\s*$/, '');
    }

    try {
      const result = JSON.parse(response);
      
      if (result.tips && Array.isArray(result.tips)) {
        return NextResponse.json({
          tips: result.tips,
          status: 'success'
        });
      } else {
        throw new Error('Invalid response format');
      }

    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      
      // Fallback tips based on section and actual data
      const fallbackTips = getFallbackTipsForSection(section, data);
      
      return NextResponse.json({
        tips: fallbackTips,
        status: 'success',
        note: 'Using fallback tips due to parsing issues'
      });
    }

  } catch (error) {
    console.error('❌ Section tips API error:', error);
    
    // Return fallback tips for any error
    const fallbackTips = getFallbackTipsForSection(section || 'general', data || '');
    
    return NextResponse.json({
      tips: fallbackTips,
      status: 'success',
      note: 'Using fallback tips due to service unavailability'
    });
  }
}

function getFallbackTipsForSection(section: string, data: string): string[] {
  const hasContent = data && data.trim().length > 0;
  const hasMultipleItems = data.includes(',') || data.includes('\n');
  
  switch(section) {
    case 'personal':
      const tips = [];
      
      // Analyze what they actually have
      if (data.includes('@')) {
        const email = data.match(/[\w\.-]+@[\w\.-]+\.\w+/)?.[0];
        if (email && (email.includes('123') || email.includes('_') || email.includes('.'))) {
          tips.push(`Your email '${email}' could be more professional - consider using firstname.lastname@domain.com format`);
        }
      } else {
        tips.push('Add a professional email address to your contact information');
      }
      
      if (!data.toLowerCase().includes('linkedin')) {
        tips.push('Include your LinkedIn profile URL to increase professional networking opportunities');
      }
      
      if (!data.match(/\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4}/)) {
        tips.push('Add a phone number with consistent formatting like (555) 123-4567');
      }
      
      tips.push('Consider adding your city and state if location is important for your target roles');
      return tips.slice(0, 4);
      
    case 'experience':
      const expTips = [];
      
      if (!hasContent) {
        return [
          'Add your work experience starting with your most recent position',
          'Include job title, company name, dates, and location for each role',
          'Add 3-4 bullet points describing your key achievements in each position',
          'Use action verbs like "Led," "Developed," "Implemented" to start each bullet point'
        ];
      }
      
      // Check for specific issues in their experience
      if (!data.match(/\d+%|\d+\$|\d+\s?(million|thousand|users|customers)/i)) {
        expTips.push('Add specific metrics and numbers to quantify your achievements (e.g., "increased sales by 25%" or "managed team of 8 people")');
      }
      
      if (!data.match(/Led|Developed|Implemented|Created|Managed|Increased|Reduced|Improved/i)) {
        expTips.push('Start your bullet points with strong action verbs like "Led," "Developed," "Implemented" instead of passive language');
      }
      
      const jobTitles = data.match(/Job \d+: ([^at]+)/g);
      if (jobTitles && jobTitles.length > 0) {
        expTips.push(`Your job titles like "${jobTitles[0]?.replace('Job 1: ', '') || 'your current role'}" are good - ensure they match industry standards for your field`);
      }
      
      expTips.push('Focus on achievements and impact rather than just listing job responsibilities');
      return expTips.slice(0, 4);
      
    case 'skills':
      const skillTips = [];
      
      if (!hasContent) {
        return [
          'Add your technical skills relevant to your target role',
          'Organize skills into categories like "Programming Languages," "Frameworks," "Tools"',
          'Include both hard skills (technical) and soft skills (leadership, communication)',
          'Prioritize skills that match job descriptions you\'re targeting'
        ];
      }
      
      const skillCategories = data.match(/([^:]+):/g);
      if (skillCategories && skillCategories.length > 0) {
        skillTips.push(`Good organization with categories like "${skillCategories[0]?.replace(':', '') || 'your categories'}" - consider adding more specific subcategories if needed`);
      }
      
      // Check for specific technologies
      if (data.toLowerCase().includes('javascript') && !data.toLowerCase().includes('react')) {
        skillTips.push('You have JavaScript skills - consider adding popular frameworks like React, Angular, or Vue.js that you\'ve used');
      }
      
      if (data.toLowerCase().includes('python') && !data.toLowerCase().includes('django')) {
        skillTips.push('With Python experience, consider adding frameworks like Django, Flask, or FastAPI if you\'ve used them');
      }
      
      skillTips.push('Remove any outdated skills and prioritize those most relevant to your target roles');
      return skillTips.slice(0, 4);
      
    case 'education':
      const eduTips = [];
      
      if (!hasContent) {
        return [
          'Add your educational background starting with the most recent degree',
          'Include degree type, major, institution name, and graduation year',
          'Add your GPA if it\'s 3.5 or higher',
          'Consider including relevant coursework for entry-level positions'
        ];
      }
      
      const degree = data.match(/(Bachelor|Master|PhD|Associate)[^from]*/)?.[0];
      if (degree) {
        eduTips.push(`Your "${degree}" degree is valuable - make sure the graduation date is clearly visible`);
      }
      
      if (!data.toLowerCase().includes('gpa') && data.includes('from')) {
        eduTips.push('Consider adding your GPA if it was 3.5 or higher to strengthen your academic credentials');
      }
      
      const institution = data.match(/from ([^(]+)/)?.[1]?.trim();
      if (institution) {
        eduTips.push(`"${institution}" is clearly listed - consider adding any honors, awards, or relevant activities from your time there`);
      }
      
      eduTips.push('For recent graduates, consider adding relevant coursework that relates to your target job');
      return eduTips.slice(0, 4);
      
    case 'projects':
      const projTips = [];
      
      if (!hasContent) {
        return [
          'Add personal or professional projects to showcase your practical skills',
          'Include projects that demonstrate technologies relevant to your target role',
          'Provide brief descriptions of what each project accomplishes',
          'Include links to GitHub repositories or live demos when possible'
        ];
      }
      
      const projectCount = data.match(/ACTUAL PROJECTS \((\d+) projects\)/)?.[1];
      if (projectCount && parseInt(projectCount) > 0) {
        projTips.push(`Great! You have ${projectCount} projects listed - ensure each demonstrates different skills`);
      }
      
      if (!data.includes('[No technologies listed]')) {
        projTips.push('Good use of technology listings - make sure they align with your target job requirements');
      } else {
        projTips.push('Add specific technologies used in each project to showcase your technical skills');
      }
      
      if (data.includes('[No link provided]')) {
        projTips.push('Consider adding GitHub links or live demo URLs to make projects more credible');
      }
      
      projTips.push('Focus on projects that show progression in complexity and relevance to your career goals');
      return projTips.slice(0, 4);
      
    case 'certifications':
      const certTips = [];
      
      if (!hasContent) {
        return [
          'Consider adding industry-relevant certifications to strengthen your credentials',
          'Look into certifications from major providers like AWS, Google, Microsoft, or Adobe',
          'Include the issuing organization and date to add credibility',
          'Focus on certifications that align with your career goals and target roles'
        ];
      }
      
      const certCount = data.match(/ACTUAL CERTIFICATIONS \((\d+) certifications\)/)?.[1];
      if (certCount && parseInt(certCount) > 0) {
        certTips.push(`Excellent! You have ${certCount} certifications - ensure they're relevant to your target role`);
      }
      
      if (data.includes('AWS') || data.includes('Google') || data.includes('Microsoft')) {
        certTips.push('Great choice with major cloud provider certifications - these are highly valued');
      }
      
      if (data.includes('[Missing date]')) {
        certTips.push('Add dates to your certifications to show they are current and valid');
      }
      
      certTips.push('Keep certifications current and consider pursuing advanced certifications in your field');
      return certTips.slice(0, 4);
      
    default:
      return [
        'This section needs more specific content based on your background',
        'Ensure all information is accurate and up-to-date',
        'Use consistent formatting throughout this section',
        'Tailor content to match your target role requirements'
      ];
  }
}
