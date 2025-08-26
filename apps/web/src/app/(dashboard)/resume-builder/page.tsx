// @author: fatima bashir
'use client';
import { FileText, Upload, CheckCircle, AlertTriangle, Edit, Save, AlertCircle } from "lucide-react";
import { useTheme } from '@/lib/ThemeContext';
import { useState, useRef, useEffect } from 'react';

// Strict JSON schema for resume data (NO rewriting, pure extraction)
interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    location?: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    bullets: string[];
    rawText: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    skills: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location?: string;
    graduationDate: string;
    gpa?: string;
    honors?: string;
    coursework?: string[];
    rawText: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies?: string[];
    link?: string;
    rawText: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    rawText: string;
  }>;
  summary?: string;
  rawExtractedText: string;
}

// Linting system interface
interface LintIssue {
  severity: 'error' | 'warning' | 'info';
  section: string;
  message: string;
  suggestion?: string;
}

interface LintResults {
  issues: LintIssue[];
  score: number; // 0-100
  summary: string;
}

export default function ResumeBuilderPage() {
  const { theme, colors } = useTheme();
  
  // Resume builder state
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [lintResults, setLintResults] = useState<LintResults | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Linting system - identifies what's wrong with resume
  const lintResumeData = (data: ResumeData): LintResults => {
    const issues: LintIssue[] = [];
    let score = 100;

    // Personal info validation
    if (!data.personal.name) {
      issues.push({
        severity: 'error',
        section: 'personal',
        message: 'Name is missing',
        suggestion: 'Add your full name at the top of your resume'
      });
      score -= 20;
    }

    if (!data.personal.email) {
      issues.push({
        severity: 'error',
        section: 'personal',
        message: 'Email address is missing',
        suggestion: 'Add a professional email address'
      });
      score -= 15;
    }

    if (!data.personal.phone) {
      issues.push({
        severity: 'warning',
        section: 'personal',
        message: 'Phone number is missing',
        suggestion: 'Consider adding your phone number for direct contact'
      });
      score -= 5;
    }

    // Experience validation
    if (data.experience.length === 0) {
      issues.push({
        severity: 'error',
        section: 'experience',
        message: 'No work experience found',
        suggestion: 'Add your work experience with job titles, companies, and dates'
      });
      score -= 30;
    } else {
      data.experience.forEach((job, index) => {
        if (job.bullets.length === 0) {
          issues.push({
            severity: 'warning',
            section: 'experience',
            message: `Job ${index + 1}: No bullet points describing achievements`,
            suggestion: 'Add 2-4 bullet points highlighting your key achievements and responsibilities'
          });
          score -= 10;
        } else if (job.bullets.length < 2) {
          issues.push({
            severity: 'info',
            section: 'experience',
            message: `Job ${index + 1}: Only ${job.bullets.length} bullet point`,
            suggestion: 'Consider adding more bullet points to better showcase your impact'
          });
          score -= 5;
        }

        // Check for quantified achievements
        const hasNumbers = job.bullets.some(bullet => /\d+/.test(bullet));
        if (!hasNumbers) {
          issues.push({
            severity: 'info',
            section: 'experience',
            message: `Job ${index + 1}: No quantified achievements`,
            suggestion: 'Add numbers, percentages, or metrics to demonstrate your impact'
          });
          score -= 3;
        }
      });
    }

    // Skills validation
    if (data.skills.length === 0) {
      issues.push({
        severity: 'warning',
        section: 'skills',
        message: 'No skills section found',
        suggestion: 'Add a skills section with relevant technical and professional skills'
      });
      score -= 15;
    }

    // Education validation
    if (data.education.length === 0) {
      issues.push({
        severity: 'info',
        section: 'education',
        message: 'No education information found',
        suggestion: 'Consider adding your educational background if relevant to the role'
      });
      score -= 5;
    }

    // Summary validation
    if (!data.summary || data.summary.length < 50) {
      issues.push({
        severity: 'info',
        section: 'summary',
        message: 'Professional summary is missing or too short',
        suggestion: 'Add a 2-3 sentence professional summary highlighting your key strengths'
      });
      score -= 5;
    }

    const summary = `Resume scored ${Math.max(score, 0)}/100. Found ${issues.length} issues to address.`;

    return {
      issues,
      score: Math.max(score, 0),
      summary
    };
  };

  // Load demo resume data
  const loadDemoResume = () => {
    const demoData: ResumeData = {
      personal: {
        name: 'John Doe',
        email: 'john.doe@email.com', 
        phone: '(555) 123-4567',
        linkedin: 'linkedin.com/in/johndoe'
      },
      experience: [
        {
          id: 'job_1',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          startDate: '2021',
          endDate: '2024',
          bullets: [
            'Led development of microservices architecture serving 1M+ users',
            'Reduced system latency by 40% through performance optimization',
            'Mentored 5 junior developers and established code review processes'
          ],
          rawText: 'Senior Software Engineer | Tech Corp | 2021-2024'
        },
        {
          id: 'job_2', 
          title: 'Software Engineer',
          company: 'StartupCo',
          startDate: '2019',
          endDate: '2021',
          bullets: [
            'Built responsive web applications using React and Node.js',
            'Implemented automated testing pipeline reducing bugs by 60%'
          ],
          rawText: 'Software Engineer | StartupCo | 2019-2021'
        }
      ],
      skills: [
        {
          id: 'skill_1',
          category: 'Programming Languages',
          skills: ['JavaScript', 'Python', 'TypeScript', 'Java']
        },
        {
          id: 'skill_2',
          category: 'Frameworks & Tools', 
          skills: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes']
        }
      ],
      education: [
        {
          id: 'edu_1',
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          graduationDate: '2019',
          rawText: 'BS Computer Science | University of Technology | 2019'
        }
      ],
      summary: 'Experienced software engineer with 5+ years developing scalable web applications. Proven track record of leading high-impact projects and mentoring development teams.',
      rawExtractedText: 'Demo resume content...'
    };
    
    setResumeData(demoData);
    const lintResults = lintResumeData(demoData);
    setLintResults(lintResults);
    console.log('🎯 Demo data loaded:', demoData);
  };

  // Start from scratch
  const startFromScratch = () => {
    const blankResume: ResumeData = {
      personal: {
        name: '',
        email: '',
        phone: '',
        linkedin: ''
      },
      experience: [],
      skills: [],
      education: [],
      summary: '',
      rawExtractedText: 'Created from scratch'
    };
    
    setResumeData(blankResume);
    const lintResults = lintResumeData(blankResume);
    setLintResults(lintResults);
    console.log('🎯 Blank resume created');
  };

  // Start fresh
  const startFresh = () => {
    setResumeData(null);
    setLintResults(null);
    setEditingSection(null);
    setUploadedFile(null);
  };

  // File validation
  const isValidFile = (file: File) => {
    console.log('Validating file:', file.name, file.type, file.size);
    
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file.');
      return false;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB.');
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    console.log('File selection triggered:', files);
    if (files && files.length > 0) {
      const file = files[0];
      console.log('Selected file:', file);
      processFile(file);
    } else {
      console.log('No files selected');
    }
  };

  // Extract text content from uploaded file (with dynamic PDF.js import)
  const extractTextFromFile = async (file: File): Promise<string> => {
    console.log('Extracting text from:', file.name, 'Type:', file.type);
    
    try {
      if (file.type === 'application/pdf') {
        // Dynamically import pdfjs-dist only when needed (client-side only)
        const pdfjs = await import('pdfjs-dist/webpack.mjs');
        
        // Set PDF.js worker
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.js`;
        
        // Extract text from PDF using PDF.js
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument(arrayBuffer).promise;
        
        console.log('PDF loaded, pages:', pdf.numPages);
        let fullText = '';
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Group text items by Y position (lines) for better structure
          const textLines: { [key: number]: any[] } = {};
          
          textContent.items.forEach((item: any) => {
            const y = Math.round(item.transform[5] / 2) * 2;
            if (!textLines[y]) {
              textLines[y] = [];
            }
            textLines[y].push(item);
          });
          
          // Sort lines by Y position and extract text
          const sortedYPositions = Object.keys(textLines)
            .map(y => parseFloat(y))
            .sort((a, b) => b - a);
          
          let pageText = '';
          sortedYPositions.forEach(y => {
            const lineItems = textLines[y].sort((a, b) => a.transform[4] - b.transform[4]);
            let lineText = lineItems.map(item => item.str.trim()).filter(text => text).join(' ');
            if (lineText.trim()) {
              pageText += lineText.trim() + '\n';
            }
          });
          
          fullText += pageText + '\n';
        }
        
        console.log('Extracted PDF text:', fullText.substring(0, 200) + '...');
        return fullText;
      } else {
        // Handle DOC/DOCX files (basic text extraction)
        console.log('Non-PDF file detected, using basic text extraction');
        return await file.text();
      }
    } catch (error) {
      console.error('Error extracting text from file:', error);
      throw new Error(`Failed to extract text from ${file.name}: ${(error as Error).message}`);
    }
  };

  // Helper functions for data extraction
  const findSectionContent = (text: string, sectionNames: string[]): string => {
    const lines = text.split('\n');
    let sectionStart = -1;
    let sectionEnd = -1;
    
    // Find section start
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (sectionNames.some(name => line.includes(name.toLowerCase()))) {
        sectionStart = i;
        break;
      }
    }
    
    if (sectionStart === -1) return '';
    
    // Find section end (next section or end of text)
    const nextSections = ['experience', 'education', 'skills', 'projects', 'certifications', 'summary', 'objective'];
    for (let i = sectionStart + 1; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (nextSections.some(name => line.includes(name) && line.length < 50)) {
        sectionEnd = i;
        break;
      }
    }
    
    if (sectionEnd === -1) sectionEnd = lines.length;
    
    return lines.slice(sectionStart + 1, sectionEnd).join('\n').trim();
  };

  const extractDateFromText = (text: string, type: 'start' | 'end'): string => {
    const datePatterns = [
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/gi,
      /\b\d{1,2}\/\d{4}\b/g,
      /\b\d{4}\b/g
    ];
    
    let dateMatches: string[] = [];
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        dateMatches = dateMatches.concat(matches);
      }
    });
    
    if (dateMatches.length === 0) return '';
    if (type === 'end') return dateMatches[dateMatches.length - 1] || '';
    return dateMatches[0] || '';
  };

  // Parse job entries from experience text (smart dynamic parsing)
  const parseJobEntries = (experienceText: string) => {
    const entries: Experience[] = [];
    const lines = experienceText.split('\n').filter(line => line.trim());
    let currentJob: Partial<Experience> | null = null;
    let jobIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip section headers
      if (line.match(/^(experience|work|professional|employment)/i) && line.length < 30) {
        continue;
      }
      
      // Check if this line looks like a job header
      const hasDate = line.match(/\b(20\d{2}|19\d{2}|Winter|Spring|Summer|Fall)\b/);
      const hasCompanyIndicators = line.match(/\b(at|@|\-|University|School|District|Company|Corp|Inc|LLC|Ltd)\b/i);
      const isJobTitleLine = line.match(/\b(Teaching|Project|Manager|Director|Engineer|Analyst|Specialist|Coordinator|Lead|Senior|Developer|Intern|Assistant|Board)\b/i);
      
      // Detect if this is likely a job header line
      if ((hasDate || hasCompanyIndicators || isJobTitleLine) && !line.match(/^[\•\-\*]/)) {
        
        // Save previous job before starting new one
        if (currentJob && (currentJob.title || currentJob.company)) {
          entries.push({ ...currentJob, id: `job_${jobIndex++}` } as Experience);
        }
        
        let title = '';
        let company = '';
        let dates = '';
        
        // Extract dates first
        const dateMatch = line.match(/\b(Winter|Spring|Summer|Fall|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{1,2}\/\d{4}|\d{4})\s*[-–]\s*(Winter|Spring|Summer|Fall|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|Current|\d{1,2}\/\d{4}|\d{4})/i);
        if (dateMatch) {
          dates = dateMatch[0];
        }
        
        // Remove dates from line for parsing
        let workingLine = line.replace(dateMatch?.[0] || '', '').trim();
        
        // Smart parsing based on actual content patterns
        if (workingLine.includes(' at ')) {
          // "Teaching Python at Moreno Valley School District"
          const parts = workingLine.split(' at ');
          title = parts[0].trim();
          company = parts.slice(1).join(' at ').trim();
        } else if (workingLine.includes(' @ ')) {
          // "Women in Computing @ UCR"
          const parts = workingLine.split(' @ ');
          title = parts[0].trim();
          company = parts.slice(1).join(' @ ').trim();
        } else if (workingLine.match(/^[A-Z]{2,}\s*-/)) {
          // "WINC - Women in Computing @ UCR" - starts with acronym
          company = workingLine;
          // Look ahead to next lines or bullets to infer title
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1].trim();
            // Check if next line starts with a potential title
            const titleFromNext = nextLine.match(/^[\•\-\*]?\s*([A-Z][a-zA-Z\s]{2,25}?)(?:\s|$)/);
            if (titleFromNext && !nextLine.match(/^[\•\-\*]?\s*(Reached|Organized|Led|Developed|Created|Designed)/i)) {
              // Only use if it looks like a title, not an action verb
              title = titleFromNext[1].trim();
            }
          }
        } else if (workingLine.match(/Project|Club|Team/i) && !workingLine.match(/Manager/i)) {
          // "UCR Solar Car Project" - project/organization name
          company = workingLine;
          // Look ahead for role in bullets - extract any capitalized words that might be roles
          if (i + 1 < lines.length) {
            const nextFewLines = lines.slice(i + 1, i + 3);
            for (const nextLine of nextFewLines) {
              // Look for patterns like "as a [Role]" or "served as [Role]"
              const rolePattern = nextLine.match(/\b(as|served as|acted as|role of|position of)\s+([A-Z][a-zA-Z\s]{2,20})/i);
              if (rolePattern) {
                title = rolePattern[2].trim();
                break;
              }
              // Or look for lines that start with a potential role (not action verbs)
              const lineStart = nextLine.match(/^[\•\-\*]?\s*([A-Z][a-zA-Z\s]{3,20}?)(?:[\.,:]|$)/);
              if (lineStart && !nextLine.match(/^[\•\-\*]?\s*(Reached|Organized|Led|Developed|Created|Designed|Implemented|Managed)/i)) {
                title = lineStart[1].trim();
                break;
              }
            }
          }
        } else if (workingLine.match(/\b(Manager|Director|Engineer|Analyst|Lead|Senior|Developer|Coordinator|Specialist|Assistant)\b/i)) {
          // Line contains job title indicators - extract the full title dynamically
          title = workingLine;
          // If there's a clear separator, try to split title from company
          if (workingLine.includes(' - ') && workingLine.split(' - ').length === 2) {
            const parts = workingLine.split(' - ');
            title = parts[0].trim();
            company = parts[1].trim();
          } else if (workingLine.includes(' at ')) {
            const parts = workingLine.split(' at ');
            title = parts[0].trim();
            company = parts.slice(1).join(' at ').trim();
          }
        } else {
          // Fallback: if line has clear company indicators, treat as company
          if (workingLine.match(/\b(University|College|School|District|Corporation|Institute|Agency|Department)\b/i)) {
            company = workingLine;
          } else {
            title = workingLine;
          }
        }
        
        currentJob = {
          title: title,
          company: company,
          location: '',
          startDate: extractDateFromText(dates, 'start'),
          endDate: extractDateFromText(dates, 'end'),
          bullets: [],
          rawText: line
        };
        
      } else if (currentJob && (line.match(/^[\•\-\*]/) || (line.length > 15 && !line.match(/^(education|skills|projects)/i)))) {
        // Process bullet points
        const bullet = line.replace(/^[\•\-\*]\s*/, '').trim();
        if (bullet.length > 10) {
          currentJob.bullets!.push(bullet);
          currentJob.rawText += '\n' + line;
          
          // If we still don't have a title, try to extract from bullet content
          if (!currentJob.title && currentJob.bullets!.length === 1) {
            // Look for explicit role mentions in bullets
            const roleMention = bullet.match(/\b(as|role|position|served as|worked as|acted as)\s+([A-Za-z\s]{3,20})\b/i);
            if (roleMention) {
              currentJob.title = roleMention[2].trim();
            } else {
              // Look for any capitalized noun phrases that might be job titles
              const contextTitle = bullet.match(/\b([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*)\b/g);
              if (contextTitle) {
                // Find the most likely title (shortest meaningful phrase, usually 1-3 words)
                const likelyTitle = contextTitle.find(phrase => 
                  phrase.split(' ').length <= 3 && 
                  phrase.length > 3 && 
                  phrase.length < 30 &&
                  !phrase.match(/^(The|This|That|And|But|For|With|From|Into|Over|Under|After|Before)$/i)
                );
                if (likelyTitle) {
                  currentJob.title = likelyTitle;
                }
              }
            }
          }
        }
      }
    }
    
    // Add final job
    if (currentJob && (currentJob.title || currentJob.company)) {
      entries.push({ ...currentJob, id: `job_${jobIndex}` } as Experience);
    }
    
    return entries;
  };

  // Parse education entries (improved logic for better field separation)
  const parseEducationEntries = (educationText: string) => {
    const entries: Education[] = [];
    const lines = educationText.split('\n').filter(line => line.trim());
    let eduIndex = 0;
    
    // Try to process each meaningful block
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      
      // Skip section headers
      if (line.match(/^(education|academic)/i) && line.length < 20) {
        i++;
        continue;
      }
      
      let degree = '';
      let institution = '';
      let graduationDate = '';
      let location = '';
      
      // Look for degree patterns
      const degreePattern = /\b(Bachelor|Master|PhD|Doctorate|Associate|Certificate|Diploma)\b.*?(of|in)?\s*([^,;|\n]*)/i;
      const institutionPattern = /\b(University|College|Institute|School|Academy)\s+([^,;|\n]*)/i;
      
      // Check current line for degree
      const degreeMatch = line.match(degreePattern);
      if (degreeMatch) {
        degree = degreeMatch[0].trim();
      }
      
      // Check current line for institution  
      const instMatch = line.match(institutionPattern);
      if (instMatch) {
        institution = instMatch[0].trim();
      }
      
      // If line has institution but no degree, treat as institution line
      if (instMatch && !degreeMatch) {
        institution = line;
        // Look ahead for degree in next line
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          const nextDegreeMatch = nextLine.match(degreePattern);
          if (nextDegreeMatch && !nextLine.match(institutionPattern)) {
            degree = nextLine;
            i++; // Skip next line since we used it
          }
        }
      }
      
      // If line has degree but no institution, look ahead
      if (degreeMatch && !instMatch) {
        degree = line;
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          const nextInstMatch = nextLine.match(institutionPattern);
          if (nextInstMatch && !nextLine.match(degreePattern)) {
            institution = nextLine;
            i++; // Skip next line since we used it
          }
        }
      }
      
      // Extract graduation date from either line
      graduationDate = extractDateFromText(line, 'end');
      if (!graduationDate && i > 0) {
        graduationDate = extractDateFromText(lines[i-1], 'end');
      }
      
      // Extract location (city, state pattern)
      const locationMatch = line.match(/([A-Za-z\s]+,\s*[A-Z]{2})/);
      if (locationMatch) {
        location = locationMatch[1];
      }
      
      // Create entry if we have meaningful data
      if (degree || institution) {
        entries.push({
          id: `edu_${eduIndex++}`,
          degree: degree || 'Degree not specified',
          institution: institution || 'Institution not specified',
          location: location,
          graduationDate: graduationDate
        });
      }
      
      i++;
    }
    
    return entries;
  };

  // Parse skills entries (organize but don't rewrite)
  const parseSkillsEntries = (skillsText: string) => {
    const entries: Skills[] = [];
    const lines = skillsText.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.match(/^(skills|technical|core)/i)) {
        // Check if line has category format (e.g., "Languages: JavaScript, Python")
        const categoryMatch = trimmed.match(/^([^:]+):\s*(.+)$/);
        if (categoryMatch) {
          const skills = categoryMatch[2].split(',').map(s => s.trim()).filter(s => s);
          if (skills.length > 0) {
            entries.push({
              id: `skill_${entries.length}`,
              category: categoryMatch[1].trim(),
              skills: skills
            });
          }
        } else {
          // Single skill or uncategorized
          const skills = trimmed.split(',').map(s => s.trim()).filter(s => s);
          if (skills.length > 0) {
            entries.push({
              id: `skill_${entries.length}`,
              category: 'Technical Skills',
              skills: skills
            });
          }
        }
      }
    });
    
    return entries;
  };

  // COMPLETE JSON extraction (same as ATS Optimizer)
  const extractResumeDataAsJSON = (text: string): ResumeData => {
    console.log('🎯 NEW JSON EXTRACTION - Pure data extraction (no rewriting)');
    console.log('📄 Input text preview:', text.substring(0, 300) + '...');
    
    console.log('📝 Raw text length:', text.length);
    
    // Clean text but preserve structure
    const cleanText = text
      .replace(/%[a-zA-Z0-9]/g, ' ')  // Remove formatting artifacts
      .replace(/[^\x20-\x7E\n]/g, ' ') // Remove non-ASCII
      .replace(/[ \t]+/g, ' ')         // Normalize spaces
      .replace(/\n\s+/g, '\n')         // Clean line breaks
      .trim();

    const resumeData: ResumeData = {
      personal: { name: '', email: '', phone: '', linkedin: '' },
      experience: [],
      skills: [],
      education: [],
      summary: '',
      rawExtractedText: cleanText
    };

    // Extract personal information (pure extraction)
    console.log('👤 Extracting personal info...');
    const lines = cleanText.split('\n').filter(line => line.trim());
    
    // Find name (usually first meaningful line)
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i].trim();
      
      if (line.length > 3 && line.length < 80 && line.split(' ').length >= 2 && line.split(' ').length <= 4) {
        const symbolRatio = (line.match(/[^a-zA-Z\s]/g) || []).length / line.length;
        if (symbolRatio < 0.2) {
          resumeData.personal.name = line;
          console.log('✅ Name extracted:', line);
          break;
        }
      }
    }

    // Extract contact info (exact matches only)
    const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = cleanText.match(/(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/);
    const linkedinMatch = cleanText.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/i);
    
    if (emailMatch) resumeData.personal.email = emailMatch[0];
    if (phoneMatch) resumeData.personal.phone = phoneMatch[0];
    if (linkedinMatch) resumeData.personal.linkedin = linkedinMatch[0];

    // Extract sections (preserve original content)
    const expSection = findSectionContent(cleanText, ['experience', 'employment', 'work history', 'professional']);
    const eduSection = findSectionContent(cleanText, ['education', 'academic', 'degree']);
    const skillsSection = findSectionContent(cleanText, ['skills', 'technical', 'competencies']);
    const summarySection = findSectionContent(cleanText, ['summary', 'profile', 'objective', 'overview']);

    // Parse experience (structure but don't rewrite)
    if (expSection) {
      resumeData.experience = parseJobEntries(expSection);
      console.log('✅ Experience extracted:', resumeData.experience.length, 'jobs');
    }

    // Parse education (structure but don't rewrite)
    if (eduSection) {
      resumeData.education = parseEducationEntries(eduSection);
      console.log('✅ Education extracted:', resumeData.education.length, 'degrees');
    }

    // Parse skills (organize but don't rewrite)
    if (skillsSection) {
      resumeData.skills = parseSkillsEntries(skillsSection);
      console.log('✅ Skills extracted:', resumeData.skills.length, 'categories');
    }

    // Extract summary (preserve original)
    if (summarySection) {
      resumeData.summary = summarySection.trim();
      console.log('✅ Summary extracted:', summarySection.length, 'chars');
    }

    console.log('🎯 JSON extraction complete - all original content preserved');
    console.log('📊 FINAL RESUME DATA:', resumeData);
    return resumeData;
  };

  // Process file upload (now with COMPLETE extraction logic!)
  const processFile = async (file: File) => {
    console.log('Starting file processing for:', file.name);
    
    if (!isValidFile(file)) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Extract text content from the file
      const textContent = await extractTextFromFile(file);
      
      // Use the COMPLETE extraction logic (same as ATS Optimizer)
      const extractedData = extractResumeDataAsJSON(textContent);
      
      // Set structured resume data and run linting
      console.log('🚀 SETTING RESUME DATA:', extractedData);
      setResumeData(extractedData);
      
      const lintResults = lintResumeData(extractedData);
      console.log('🔍 LINTING RESULTS:', lintResults);
      setLintResults(lintResults);
      setUploadedFile(file);
      setIsProcessing(false);
      
      alert(`✅ File "${file.name}" uploaded and processed successfully! Found ${extractedData.experience.length} jobs, ${extractedData.skills.length} skill categories, and ${extractedData.education.length} education entries. You can now edit your resume section by section.`);
    } catch (error) {
      console.error('Error processing file:', error);
      alert(`Error processing file: ${(error as Error).message}. Please try again or use "Start from Scratch" option.`);
      setIsProcessing(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    console.log('Dropped files:', files);
    handleFileSelect(files);
  };

  // Click handler
  const handleClick = () => {
    console.log('Upload area clicked, file input ref:', fileInputRef.current);
    if (fileInputRef.current) {
      fileInputRef.current.click();
      console.log('File input clicked');
    } else {
      console.error('File input ref is null - this is the problem!');
    }
  };

  // File input change handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', e.target.files);
    handleFileSelect(e.target.files);
  };

  // Render structured resume editor or upload interface
  if (resumeData) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{color: colors.text}}>Resume Builder</h1>
              <p className="text-xl opacity-80" style={{color: colors.text}}>
                Edit your resume section by section with AI-powered guidance
              </p>
            </div>
            <button 
              onClick={startFresh}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
              style={{color: colors.text}}
            >
              Start Over
            </button>
          </div>
        </div>

        {/* Linting Results Summary */}
        {lintResults && (
          <div className="p-6 rounded-2xl shadow-lg mb-8" style={{
            background: colors.cardBackground, 
            border: `1px solid ${colors.cardBorder}`,
            borderLeft: `4px solid ${lintResults.score >= 80 ? '#22c55e' : lintResults.score >= 60 ? '#f59e0b' : '#ef4444'}`
          }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" style={{
                    color: lintResults.score >= 80 ? '#22c55e' : lintResults.score >= 60 ? '#f59e0b' : '#ef4444'
                  }} />
                  <h3 className="text-xl font-semibold" style={{color: colors.text}}>
                    Resume Score: {lintResults.score}/100
                  </h3>
                </div>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4" style={{color: colors.text}}>
              {lintResults.summary}
            </p>
            
            {lintResults.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm" style={{color: colors.text}}>Issues to Fix:</h4>
                {lintResults.issues.slice(0, 3).map((issue, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      issue.severity === 'error' ? 'bg-red-500' : 
                      issue.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <span className="font-medium" style={{color: colors.text}}>{issue.message}</span>
                      {issue.suggestion && (
                        <div className="text-xs opacity-70 mt-1" style={{color: colors.text}}>
                          💡 {issue.suggestion}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {lintResults.issues.length > 3 && (
                  <div className="text-xs opacity-60" style={{color: colors.text}}>
                    +{lintResults.issues.length - 3} more issues...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Section Editor */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Section Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4" style={{color: colors.text}}>Resume Sections</h3>
            
            {/* Personal Section */}
            <div 
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                editingSection === 'personal' ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                background: editingSection === 'personal' ? colors.accent + '20' : colors.cardBackground,
                border: `1px solid ${colors.cardBorder}`
              }}
              onClick={() => setEditingSection('personal')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium" style={{color: colors.text}}>Personal Info</h4>
                  <p className="text-xs opacity-60" style={{color: colors.text}}>
                    {resumeData.personal.name || 'Missing name'}
                  </p>
                </div>
                {editingSection === 'personal' ? (
                  <Edit className="h-4 w-4" style={{color: colors.accent}} />
                ) : (
                  <CheckCircle className={`h-4 w-4 ${
                    resumeData.personal.name && resumeData.personal.email ? 'text-green-500' : 'text-gray-400'
                  }`} />
                )}
              </div>
            </div>

            {/* Experience Section */}
            <div 
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                editingSection === 'experience' ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                background: editingSection === 'experience' ? colors.accent + '20' : colors.cardBackground,
                border: `1px solid ${colors.cardBorder}`
              }}
              onClick={() => setEditingSection('experience')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium" style={{color: colors.text}}>Work Experience</h4>
                  <p className="text-xs opacity-60" style={{color: colors.text}}>
                    {resumeData.experience.length} job{resumeData.experience.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {editingSection === 'experience' ? (
                  <Edit className="h-4 w-4" style={{color: colors.accent}} />
                ) : (
                  <CheckCircle className={`h-4 w-4 ${
                    resumeData.experience.length > 0 ? 'text-green-500' : 'text-gray-400'
                  }`} />
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div 
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                editingSection === 'skills' ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                background: editingSection === 'skills' ? colors.accent + '20' : colors.cardBackground,
                border: `1px solid ${colors.cardBorder}`
              }}
              onClick={() => setEditingSection('skills')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium" style={{color: colors.text}}>Skills</h4>
                  <p className="text-xs opacity-60" style={{color: colors.text}}>
                    {resumeData.skills.reduce((total, cat) => total + cat.skills.length, 0)} skills
                  </p>
                </div>
                {editingSection === 'skills' ? (
                  <Edit className="h-4 w-4" style={{color: colors.accent}} />
                ) : (
                  <CheckCircle className={`h-4 w-4 ${
                    resumeData.skills.length > 0 ? 'text-green-500' : 'text-gray-400'
                  }`} />
                )}
              </div>
            </div>

            {/* Education Section */}
            <div 
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                editingSection === 'education' ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                background: editingSection === 'education' ? colors.accent + '20' : colors.cardBackground,
                border: `1px solid ${colors.cardBorder}`
              }}
              onClick={() => setEditingSection('education')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium" style={{color: colors.text}}>Education</h4>
                  <p className="text-xs opacity-60" style={{color: colors.text}}>
                    {resumeData.education.length} degree{resumeData.education.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {editingSection === 'education' ? (
                  <Edit className="h-4 w-4" style={{color: colors.accent}} />
                ) : (
                  <CheckCircle className={`h-4 w-4 ${
                    resumeData.education.length > 0 ? 'text-green-500' : 'text-gray-400'
                  }`} />
                )}
              </div>
            </div>
          </div>

          {/* Section Editor Content */}
          <div className="md:col-span-2">
            {editingSection === 'personal' && (
              <div className="p-6 rounded-2xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
                <h3 className="text-xl font-semibold mb-6" style={{color: colors.text}}>Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personal.name}
                      onChange={(e) => setResumeData(prev => prev ? ({
                        ...prev,
                        personal: { ...prev.personal, name: e.target.value }
                      }) : null)}
                      className="w-full p-3 rounded-lg border"
                      style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>Email</label>
                    <input
                      type="email"
                      value={resumeData.personal.email}
                      onChange={(e) => setResumeData(prev => prev ? ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value }
                      }) : null)}
                      className="w-full p-3 rounded-lg border"
                      style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>Phone</label>
                    <input
                      type="tel"
                      value={resumeData.personal.phone}
                      onChange={(e) => setResumeData(prev => prev ? ({
                        ...prev,
                        personal: { ...prev.personal, phone: e.target.value }
                      }) : null)}
                      className="w-full p-3 rounded-lg border"
                      style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>LinkedIn (optional)</label>
                    <input
                      type="url"
                      value={resumeData.personal.linkedin || ''}
                      onChange={(e) => setResumeData(prev => prev ? ({
                        ...prev,
                        personal: { ...prev.personal, linkedin: e.target.value }
                      }) : null)}
                      className="w-full p-3 rounded-lg border"
                      style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                </div>
              </div>
            )}

            {editingSection === 'experience' && (
              <div className="p-6 rounded-2xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
                <h3 className="text-xl font-semibold mb-6" style={{color: colors.text}}>Work Experience</h3>
                <div className="space-y-6">
                  {resumeData.experience.map((job, index) => (
                    <div key={job.id} className="p-4 rounded-xl border" style={{border: `1px solid ${colors.cardBorder}`}}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium" style={{color: colors.text}}>Job #{index + 1}</h4>
                        <button className="text-xs text-red-500 hover:text-red-700">Remove</button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{color: colors.text}}>Job Title</label>
                          <input
                            type="text"
                            value={job.title}
                            onChange={(e) => {
                              const updatedJobs = [...resumeData.experience];
                              updatedJobs[index] = { ...job, title: e.target.value };
                              setResumeData(prev => prev ? ({ ...prev, experience: updatedJobs }) : null);
                            }}
                            className="w-full p-2 rounded border text-sm"
                            style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{color: colors.text}}>Company</label>
                          <input
                            type="text"
                            value={job.company}
                            onChange={(e) => {
                              const updatedJobs = [...resumeData.experience];
                              updatedJobs[index] = { ...job, company: e.target.value };
                              setResumeData(prev => prev ? ({ ...prev, experience: updatedJobs }) : null);
                            }}
                            className="w-full p-2 rounded border text-sm"
                            style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>Key Achievements</label>
                        {job.bullets.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="flex gap-2 mb-2">
                            <span className="text-xs text-gray-500 mt-1">•</span>
                            <textarea
                              value={bullet}
                              onChange={(e) => {
                                const updatedJobs = [...resumeData.experience];
                                const updatedBullets = [...job.bullets];
                                updatedBullets[bulletIndex] = e.target.value;
                                updatedJobs[index] = { ...job, bullets: updatedBullets };
                                setResumeData(prev => prev ? ({ ...prev, experience: updatedJobs }) : null);
                              }}
                              className="flex-1 p-2 rounded border text-sm resize-none"
                              style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                              rows={2}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {editingSection === 'skills' && (
              <div className="p-6 rounded-2xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
                <h3 className="text-xl font-semibold mb-6" style={{color: colors.text}}>Skills</h3>
                <div className="space-y-4">
                  {resumeData.skills.map((category, index) => (
                    <div key={index} className="p-4 rounded-xl border" style={{border: `1px solid ${colors.cardBorder}`}}>
                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>Category</label>
                        <input
                          type="text"
                          value={category.category}
                          onChange={(e) => {
                            const updatedSkills = [...resumeData.skills];
                            updatedSkills[index] = { ...category, category: e.target.value };
                            setResumeData(prev => prev ? ({ ...prev, skills: updatedSkills }) : null);
                          }}
                          className="w-full p-2 rounded border text-sm"
                          style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>Skills (comma separated)</label>
                        <input
                          type="text"
                          value={category.skills.join(', ')}
                          onChange={(e) => {
                            const updatedSkills = [...resumeData.skills];
                            updatedSkills[index] = { ...category, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) };
                            setResumeData(prev => prev ? ({ ...prev, skills: updatedSkills }) : null);
                          }}
                          className="w-full p-2 rounded border text-sm"
                          style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {editingSection === 'education' && (
              <div className="p-6 rounded-2xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
                <h3 className="text-xl font-semibold mb-6" style={{color: colors.text}}>Education</h3>
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 rounded-xl border" style={{border: `1px solid ${colors.cardBorder}`}}>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updatedEdu = [...resumeData.education];
                              updatedEdu[index] = { ...edu, degree: e.target.value };
                              setResumeData(prev => prev ? ({ ...prev, education: updatedEdu }) : null);
                            }}
                            className="w-full p-2 rounded border text-sm"
                            style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updatedEdu = [...resumeData.education];
                              updatedEdu[index] = { ...edu, institution: e.target.value };
                              setResumeData(prev => prev ? ({ ...prev, education: updatedEdu }) : null);
                            }}
                            className="w-full p-2 rounded border text-sm"
                            style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!editingSection && (
              <div className="p-8 rounded-2xl text-center" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4" style={{background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)'}}>
                  <Edit className="h-8 w-8 mt-4 mx-auto" style={{color: '#3b82f6'}} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{color: colors.text}}>Select a Section to Edit</h3>
                <p className="opacity-70" style={{color: colors.text}}>
                  Choose a section from the left panel to start editing your resume
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3" style={{color: colors.text}}>Resume Builder</h1>
        <p className="text-xl opacity-80" style={{color: colors.text}}>
          Create and edit your resume with structured, section-by-section editing
        </p>
      </div>

      {/* Getting Started Options */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Upload Resume */}
        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInputChange}
          />
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
              <Upload className="h-8 w-8" style={{color: '#22c55e'}} />
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{color: colors.text}}>Upload Your Resume</h2>
            <p className="mb-6 opacity-80" style={{color: colors.text}}>
              Upload your existing resume to get started - you'll then manually enter your information into our structured editor
            </p>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 transition-all ${
                isDragOver ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300'
              }`}
              style={{borderColor: isDragOver ? '#3b82f6' : colors.cardBorder}}
            >
              {isProcessing ? (
                <div className="space-y-2">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm" style={{color: colors.text}}>Processing...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <FileText className="h-12 w-12 mx-auto opacity-50" style={{color: colors.text}} />
                  <p className="font-medium" style={{color: colors.text}}>
                    Drag & drop your resume here
                  </p>
                  <p className="text-sm opacity-60" style={{color: colors.text}}>
                    PDF, DOC, or DOCX (Max 10MB)
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Upload button clicked, triggering file input...');
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                          console.log('File input clicked successfully');
                        } else {
                          console.error('File input ref is null!');
                        }
                      }}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo Resume */}
        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
              <Edit className="h-8 w-8" style={{color: '#8b5cf6'}} />
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{color: colors.text}}>Try Demo Resume</h2>
            <p className="mb-6 opacity-80" style={{color: colors.text}}>
              Load a sample resume to experience the structured editing interface
            </p>
            
            <button
              onClick={loadDemoResume}
              className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-105"
              style={{
                background: colors.accent,
                color: 'white'
              }}
            >
              Load Demo Resume
            </button>
            
            <div className="mt-6 p-4 rounded-xl" style={{background: colors.accent + '10', border: `1px solid ${colors.accent}30`}}>
              <p className="text-sm" style={{color: colors.text}}>
                <strong>Sample includes:</strong> Software Engineer with 5 years experience, technical skills, education, and quantified achievements
              </p>
            </div>
          </div>
        </div>

        {/* Start from Scratch */}
        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)'}}>
              <FileText className="h-8 w-8" style={{color: '#3b82f6'}} />
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{color: colors.text}}>Start from Scratch</h2>
            <p className="mb-6 opacity-80" style={{color: colors.text}}>
              Create a brand new resume from a blank template with guided section editing
            </p>
            
            <button
              onClick={startFromScratch}
              className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-105"
              style={{
                background: '#3b82f6',
                color: 'white'
              }}
            >
              Start Fresh Resume
            </button>
            
            <div className="mt-6 p-4 rounded-xl" style={{background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)'}}>
              <p className="text-sm" style={{color: colors.text}}>
                <strong>Perfect for:</strong> First-time resume writers, career changers, or anyone wanting a fresh start
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{color: colors.text}}>
          What You'll Get
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4" style={{background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
              <CheckCircle className="h-6 w-6 mt-3 mx-auto" style={{color: '#22c55e'}} />
            </div>
            <h3 className="font-semibold mb-2" style={{color: colors.text}}>Structured Editing</h3>
            <p className="text-sm opacity-70" style={{color: colors.text}}>
              Edit each section individually with full control over your content
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4" style={{background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)'}}>
              <AlertTriangle className="h-6 w-6 mt-3 mx-auto" style={{color: '#3b82f6'}} />
            </div>
            <h3 className="font-semibold mb-2" style={{color: colors.text}}>Smart Feedback</h3>
            <p className="text-sm opacity-70" style={{color: colors.text}}>
              Get specific suggestions on how to improve each section
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4" style={{background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)'}}>
              <FileText className="h-6 w-6 mt-3 mx-auto" style={{color: '#f59e0b'}} />
            </div>
            <h3 className="font-semibold mb-2" style={{color: colors.text}}>Export Ready</h3>
            <p className="text-sm opacity-70" style={{color: colors.text}}>
              Export to professional formats when you're ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
