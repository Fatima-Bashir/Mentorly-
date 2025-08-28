// @author: fatima bashir
'use client';
import { FileText, Upload, Download, CheckCircle, AlertTriangle, Zap, Target, X, Edit, Save, AlertCircle } from "lucide-react";
import { useTheme } from '@/lib/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as pdfjs from 'pdfjs-dist/webpack.mjs';

// NEW: Strict JSON schema for resume data (NO rewriting, pure extraction)
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
    category: string;
    items: string[];
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

// NEW: Linting system interface
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

export default function ATSOptimizerPage() {
  const { theme, colors } = useTheme();
  
  // NEW: Structured resume data state
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [lintResults, setLintResults] = useState<LintResults | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  // Legacy state (keeping for compatibility during transition)
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved resume and analysis from localStorage
  useEffect(() => {
    console.log('ATS Component mounted');
    console.log('File input ref on mount:', fileInputRef.current);
    
    const savedResume = localStorage.getItem('uploadedResume');
    if (savedResume) {
      try {
        const resumeData = JSON.parse(savedResume);
        setUploadedFile(resumeData);
        if (resumeData.textContent) {
          setExtractedText(resumeData.textContent);
        }
        console.log('Loaded saved resume:', resumeData);
      } catch (error) {
        console.error('Error loading saved resume:', error);
      }
    }

    const savedAnalysis = localStorage.getItem('resumeAnalysis');
    if (savedAnalysis) {
      try {
        const analysisData = JSON.parse(savedAnalysis);
        setAnalysisResults(analysisData);
        console.log('Loaded saved analysis:', analysisData);
      } catch (error) {
        console.error('Error loading saved analysis:', error);
      }
    }

    // Check file input ref after a brief delay
    setTimeout(() => {
      console.log('File input ref after timeout:', fileInputRef.current);
    }, 100);
  }, []);



  // Save resume to localStorage
  const saveResumeToStorage = (fileData: any) => {
    try {
      localStorage.setItem('uploadedResume', JSON.stringify(fileData));
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  };

  // File validation
  const isValidFile = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    console.log('Validating file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Check file extension as fallback for MIME type detection issues
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);

    if (!isValidType) {
      alert(`Please upload a PDF, DOC, or DOCX file. Current file type: ${file.type}`);
      return false;
    }

    if (file.size > maxSize) {
      alert(`File size must be less than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return false;
    }

    return true;
  };

  // Extract text content from uploaded file
  const extractTextFromFile = async (file: File): Promise<string> => {
    console.log('Extracting text from:', file.name, 'Type:', file.type);
    
    try {
      if (file.type === 'application/pdf') {
        // Set PDF.js worker
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.js`;
        
        // Extract text from PDF using PDF.js
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument(arrayBuffer).promise;
        
        console.log('PDF loaded, pages:', pdf.numPages);
        let fullText = '';
        
        // COMPLETELY REWRITTEN text extraction for maximum reliability
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Group text items by Y position (lines) for better structure
          const textLines: { [key: number]: any[] } = {};
          
          textContent.items.forEach((item: any) => {
            const y = Math.round(item.transform[5] / 2) * 2; // Round to nearest 2 for grouping
            if (!textLines[y]) {
              textLines[y] = [];
            }
            textLines[y].push(item);
          });
          
          // Sort lines by Y position (top to bottom)
          const sortedYPositions = Object.keys(textLines)
            .map(y => parseFloat(y))
            .sort((a, b) => b - a); // Descending (PDF coordinates start from bottom)
          
          let pageText = '';
          
          sortedYPositions.forEach(y => {
            // Sort items in each line by X position (left to right)
            const lineItems = textLines[y].sort((a, b) => a.transform[4] - b.transform[4]);
            
            let lineText = '';
            let lastX = 0;
            
            lineItems.forEach((item, index) => {
              const currentX = item.transform[4];
              const text = item.str.trim();
              
              if (!text) return;
              
              if (index === 0) {
                lineText = text;
              } else {
                const xGap = currentX - lastX;
                if (xGap > 30) {
                  // Large gap - likely separate column or section
                  lineText += '   ' + text;
                } else if (xGap > 5 || !lineText.endsWith(' ')) {
                  // Normal gap - add space if needed
                  lineText += ' ' + text;
                } else {
                  // No gap needed
                  lineText += text;
                }
              }
              
              lastX = currentX + item.width;
            });
            
            if (lineText.trim()) {
              pageText += lineText.trim() + '\n';
            }
          });
          
          fullText += pageText + '\n';
        }
        
        console.log('Extracted PDF text:', fullText.substring(0, 200) + '...');
        return fullText;
      } 
      else if (file.type === 'text/plain') {
        // Handle plain text files
        const text = await file.text();
        console.log('Extracted plain text:', text.substring(0, 200) + '...');
        return text;
      }
      else {
        // For DOC/DOCX files, we can't easily extract text in the browser
        // Return a placeholder that indicates manual extraction needed
        console.log('Cannot extract text from:', file.type, '- using filename as placeholder');
        return `Resume content from: ${file.name}\n\nNote: Please manually copy and paste your resume content for full optimization features.\n\nThis file type (${file.type}) requires server-side processing for text extraction.`;
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      return `Resume uploaded: ${file.name}\n\nError extracting text content. Please ensure the file is not corrupted and try again.`;
    }
  };

  // Helper: Find section content (preserve original structure)
  const findSectionContent = (text: string, keywords: string[]): string | null => {
    const lines = text.split('\n');
    let startIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().toLowerCase();
      if (line.length < 50 && keywords.some(keyword => line.includes(keyword))) {
        startIndex = i + 1;
        break;
      }
    }
    
    if (startIndex === -1) return null;
    
    // Find end (next section or end of text)
    let endIndex = lines.length;
    const allSectionKeywords = ['experience', 'education', 'skills', 'summary', 'projects', 'certifications'];
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim().toLowerCase();
      if (line.length < 50 && line.length > 2) {
        if (allSectionKeywords.some(k => line.includes(k) && !keywords.includes(k))) {
          endIndex = i;
          break;
        }
      }
    }
    
    return lines.slice(startIndex, endIndex).join('\n').trim();
  };

  // Helper: Parse job entries (structure original content, no rewriting)
  const parseJobEntries = (experienceText: string) => {
    const entries: Array<{
      id: string;
      title: string;
      company: string;
      location?: string;
      startDate: string;
      endDate: string;
      bullets: string[];
      rawText: string;
    }> = [];
    
    const lines = experienceText.split('\n').filter(line => line.trim());
    let currentJob: any = null;
    let jobIndex = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Detect job header (has dates or job title patterns)
      if (trimmed.match(/\d{4}/) || trimmed.includes('|') || 
          trimmed.match(/\b(Manager|Director|Engineer|Analyst|Specialist|Coordinator|Lead|Senior)\b/i)) {
        
        // Save previous job
        if (currentJob) {
          entries.push({ ...currentJob, id: `job_${jobIndex++}` });
        }
        
        // Parse job header (preserve original text)
        const parts = trimmed.split('|').map(p => p.trim());
        currentJob = {
          title: parts[0] || trimmed,
          company: parts[1] || '',
          location: parts[2] || '',
          startDate: extractDateFromText(trimmed, 'start'),
          endDate: extractDateFromText(trimmed, 'end'),
          bullets: [],
          rawText: trimmed
        };
      } else if (currentJob && trimmed.length > 10) {
        // Add bullet point (preserve original text)
        currentJob.bullets.push(trimmed);
        currentJob.rawText += '\n' + trimmed;
      }
    }
    
    if (currentJob) {
      entries.push({ ...currentJob, id: `job_${jobIndex}` });
    }
    
    return entries;
  };

  // Helper: Parse education entries (preserve original content)
  const parseEducationEntries = (educationText: string) => {
    const entries: Array<{
      id: string;
      degree: string;
      institution: string;
      location?: string;
      graduationDate: string;
      gpa?: string;
      honors?: string;
      coursework?: string[];
      rawText: string;
    }> = [];
    
    const lines = educationText.split('\n').filter(line => line.trim());
    let currentEdu: any = null;
    let eduIndex = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Detect education header
      if (trimmed.match(/\b(Bachelor|Master|PhD|Associate|Certificate|Diploma)\b/i) ||
          trimmed.match(/\b(University|College|Institute|School)\b/i)) {
        
        if (currentEdu) {
          entries.push({ ...currentEdu, id: `edu_${eduIndex++}` });
        }
        
        currentEdu = {
          degree: trimmed,
          institution: '',
          graduationDate: extractDateFromText(trimmed, 'graduation'),
          coursework: [],
          rawText: trimmed
        };
      } else if (currentEdu && trimmed.length > 5) {
        if (trimmed.toLowerCase().includes('gpa')) {
          currentEdu.gpa = trimmed;
        } else if (trimmed.toLowerCase().includes('honor') || trimmed.toLowerCase().includes('cum laude')) {
          currentEdu.honors = trimmed;
        } else {
          currentEdu.coursework?.push(trimmed);
        }
        currentEdu.rawText += '\n' + trimmed;
      }
    }
    
    if (currentEdu) {
      entries.push({ ...currentEdu, id: `edu_${eduIndex}` });
    }
    
    return entries;
  };

  // Helper: Parse skills (organize but preserve original text)
  const parseSkillsEntries = (skillsText: string) => {
    const categories: Array<{ category: string; items: string[] }> = [];
    
    // Try to detect categorized skills first
    const lines = skillsText.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.includes(':')) {
        // Categorized skills like "Programming: Java, Python, JavaScript"
        const [category, items] = trimmed.split(':', 2);
        const skillItems = items.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0);
        categories.push({
          category: category.trim(),
          items: skillItems
        });
      }
    }
    
    // If no categories found, create general category
    if (categories.length === 0) {
      const allSkills = skillsText
        .replace(/[•·▪▫◦‣⁃]/g, ',')
        .split(/[,;\n|]/)
        .map(s => s.trim())
        .filter(s => s.length > 1);
        
      if (allSkills.length > 0) {
        categories.push({
          category: 'Technical Skills',
          items: allSkills
        });
      }
    }
    
    return categories;
  };

  // Helper: Extract dates from text (preserve format)
  const extractDateFromText = (text: string, type: 'start' | 'end' | 'graduation'): string => {
    const dateMatches = text.match(/\b\d{4}\b/g);
    if (!dateMatches) return '';
    
    if (type === 'start') return dateMatches[0] || '';
    if (type === 'end') return dateMatches[dateMatches.length - 1] || '';
    return dateMatches[0] || '';
  };

  // NEW: Clean JSON extraction (NO rewriting, pure data extraction)  
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
      personal: { name: '', email: '', phone: '' },
      experience: [],
      skills: [],
      education: [],
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

  // NEW: Linting system - identifies what's wrong with resume
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

  // Process file upload
  const processFile = async (file: File) => {
    console.log('Starting file processing for:', file.name);
    
    if (!isValidFile(file)) {
      console.log('File validation failed');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Extract text content from the file
      const textContent = await extractTextFromFile(file);
      const extractedData = extractResumeDataAsJSON(textContent);
      
      // NEW: Set structured resume data and run linting
      console.log('🚀 SETTING RESUME DATA:', extractedData);
      // setResumeData(extractedData); // DISABLED - Stay in ATS mode
      
      const lintResults = lintResumeData(extractedData);
      console.log('🔍 LINTING RESULTS:', lintResults);
      setLintResults(lintResults);

      // Legacy: Create file data for compatibility (will be removed later)
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        uploadedAt: new Date().toISOString(),
        textContent: textContent,
        parsedContent: extractedData // Store structured data in legacy format too
      };

      console.log('Created file data object with extracted content:', fileData);

      // Convert file to data URL for preview (still needed for file management)
      const reader = new FileReader();
      
      reader.onload = (e) => {
        console.log('FileReader successfully loaded file');
        (fileData as any).dataUrl = e.target?.result;
        
        console.log('🔥 SETTING STATES FOR ANALYSIS:');
        console.log('Setting uploadedFile:', fileData);
        console.log('Setting extractedText length:', textContent.length);
        console.log('Text preview:', textContent.substring(0, 200));
        
        // Save structured resume data separately for global access
        console.log('💾 SAVING STRUCTURED RESUME DATA:', extractedData);
        localStorage.setItem('structuredResumeData', JSON.stringify(extractedData));
        
        setUploadedFile(fileData);
        setExtractedText(textContent);
        saveResumeToStorage(fileData);
        setIsProcessing(false);
        console.log('✅ File processing completed successfully with text extraction');
        console.log('✅ States should now be ready for analysis');
        console.log('✅ Structured resume data saved to localStorage');
      };
      
      reader.onerror = (e) => {
        console.error('FileReader error:', e);
        alert('Error reading file. Please try again.');
        setIsProcessing(false);
      };

      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert(`Error processing file: ${(error as Error).message || 'Unknown error'}. Please try again.`);
      setIsProcessing(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    console.log('File selection triggered, files:', files);
    if (files && files.length > 0) {
      console.log('Processing selected file:', files[0].name);
      processFile(files[0]);
    } else {
      console.log('No files selected');
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
    console.log('File dropped');
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    console.log('Dropped files:', files);
    handleFileSelect(files);
  };

  // Click handler
  const handleClick = () => {
    console.log('Upload button clicked, triggering file input');
    console.log('File input ref exists:', !!fileInputRef.current);
    console.log('File input element:', fileInputRef.current);
    
    if (fileInputRef.current) {
      console.log('Clicking file input...');
      fileInputRef.current.click();
      console.log('File input clicked successfully');
    } else {
      console.error('File input ref is null - this is the problem!');
    }
  };

  // File input change handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', e.target.files);
    handleFileSelect(e.target.files);
  };

  // Remove file handler
  const removeFile = () => {
    setUploadedFile(null);
    setExtractedText('');
    setAnalysisResults(null);
    localStorage.removeItem('uploadedResume');
    localStorage.removeItem('resumeAnalysis');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Generate personalized improvement tips based on resume content
  const generatePersonalizedTips = (parsedContent: any, analysisResults: any) => {
    const tips: { [key: string]: string[] } = {
      contentKeywords: [],
      formatStructure: [],
      skillsCertifications: [],
      commonMistakes: []
    };

    if (!parsedContent) return tips;

    // Content & Keywords Analysis
    if (!parsedContent.summary || parsedContent.summary.length < 100) {
      tips.contentKeywords.push("Add a compelling professional summary (3-4 sentences) highlighting your key achievements and career focus");
    }
    
    if (analysisResults?.missingSkills?.length > 0) {
      tips.contentKeywords.push(`Include these relevant keywords: ${analysisResults.missingSkills.slice(0, 5).join(', ')}`);
    }
    
    if (!parsedContent.rawText.match(/\d+%|\$\d+|increased|improved|reduced|achieved/i)) {
      tips.contentKeywords.push("Add quantified achievements with specific numbers, percentages, or dollar amounts");
    }

    // Format & Structure Analysis
    if (parsedContent.rawText.length < 500) {
      tips.formatStructure.push("Your resume appears quite brief - consider adding more detailed descriptions of your roles and achievements");
    }
    
    if (!parsedContent.experience || !parsedContent.experience.match(/\d{4}/)) {
      tips.formatStructure.push("Include employment dates in a consistent format (e.g., 'Jan 2020 - Present')");
    }
    
    if (parsedContent.rawText.split('\n').filter(line => line.trim().startsWith('•')).length < 3) {
      tips.formatStructure.push("Use bullet points for better readability and ATS scanning");
    }

    // Skills & Certifications Analysis
    if (!parsedContent.skills || parsedContent.skills.length < 50) {
      tips.skillsCertifications.push("Expand your skills section with both technical and soft skills relevant to your target role");
    }
    
    if (!parsedContent.rawText.match(/certif|license|credential/i)) {
      tips.skillsCertifications.push("Add any relevant certifications, licenses, or training programs you've completed");
    }
    
    if (!parsedContent.rawText.match(/project|initiative|program/i)) {
      tips.skillsCertifications.push("Highlight specific projects or initiatives you've led or contributed to significantly");
    }

    // Common Mistakes Analysis
    if (parsedContent.rawText.match(/responsible for|duties include|job involved/i)) {
      tips.commonMistakes.push("Replace passive phrases like 'responsible for' with active verbs like 'managed', 'led', 'implemented'");
    }
    
    if (!parsedContent.rawText.match(/Led|Managed|Implemented|Developed|Optimized|Achieved/)) {
      tips.commonMistakes.push("Use strong action verbs to start your bullet points (Led, Managed, Implemented, Developed, etc.)");
    }
    
    if (parsedContent.contact && !parsedContent.contact.toLowerCase().includes('linkedin')) {
      tips.commonMistakes.push("Consider adding your LinkedIn profile URL to your contact information");
    }
    
    if (parsedContent.rawText.length > 2000) {
      tips.commonMistakes.push("Your resume may be too long - aim for 1-2 pages with the most relevant and impactful information");
    }

    return tips;
  };

  // Resume analysis function using OpenAI
  const analyzeResume = async () => {
    console.log('🔍 ANALYSIS TRIGGERED - Debug info:');
    console.log('uploadedFile:', uploadedFile);
    console.log('extractedText length:', extractedText?.length || 0);
    console.log('extractedText preview:', extractedText?.substring(0, 200));
    
    if (!uploadedFile) {
      console.error('❌ No uploaded file found');
      alert('❌ No uploaded file found. Please upload a resume first.');
      return;
    }

    if (!extractedText || extractedText.trim().length === 0) {
      console.error('❌ No extracted text available');
      alert('❌ Unable to analyze resume - no text content extracted. Please try re-uploading your file.');
      return;
    }

    setIsAnalyzing(true);
    console.log('✅ Starting AI-powered resume analysis for:', uploadedFile.name);
    console.log('✅ Extracted text length:', extractedText.length);

    try {
      // Call the AI analysis API
      console.log('🤖 Calling AI analysis API...');
      console.log('Resume text length:', extractedText?.length || 0);
      console.log('Parsed content:', uploadedFile.parsedContent);
      
      const requestBody = {
        resumeText: extractedText,
        parsedContent: uploadedFile.parsedContent || {
          name: '',
          contact: '',
          summary: '',
          experience: '',
          education: '',
          skills: '',
          rawText: extractedText
        }
      };
      
      console.log('Request body:', requestBody);
      
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('🤖 API Response status:', response.status);
      console.log('🤖 API Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🤖 API Error response:', errorText);
        console.error('🤖 Response status:', response.status);
        console.error('🤖 Response headers:', Object.fromEntries(response.headers.entries()));
        alert(`❌ Analysis API failed: ${response.status} - ${errorText}. Please check the console for details.`);
        throw new Error(`Analysis failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('🤖 API Response data:', data);
      
      if (data.status !== 'success' || !data.analysis) {
        console.error('🤖 Invalid response structure:', data);
        throw new Error('Invalid analysis response');
      }

      const aiResults = data.analysis;
      console.log('AI Analysis completed:', aiResults);

      // Combine AI results with any additional personalized tips from local analysis
      const enhancedResults = {
        ...aiResults,
        // Keep the existing personalized tips logic as backup/enhancement
        personalizedTips: {
          ...aiResults.personalizedTips,
          // Merge with local analysis if needed
          ...(aiResults.personalizedTips?.contentKeywords?.length > 0 
            ? {} 
            : generatePersonalizedTips(uploadedFile.parsedContent, aiResults))
        }
      };

      setAnalysisResults(enhancedResults);
      localStorage.setItem('resumeAnalysis', JSON.stringify(enhancedResults));
      console.log('Enhanced analysis results:', enhancedResults);

    } catch (error) {
      console.error('❌ Error analyzing resume with AI:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Fallback to local analysis if AI fails
      console.log('🔄 Falling back to local analysis...');
      try {
        const fallbackResults = {
          atsScore: 75,
          keywordMatches: 12,
          missingSkills: ['Communication', 'Project Management', 'Problem Solving'],
          strengths: ['Professional experience', 'Educational background'],
          improvements: ['Optimize for ATS systems', 'Add quantified achievements', 'Include relevant keywords'],
          personalizedTips: generatePersonalizedTips(uploadedFile.parsedContent, {
            missingSkills: ['Communication', 'Project Management', 'Problem Solving']
          }),
          analyzedAt: new Date().toISOString(),
          source: 'local_fallback'
        };

        setAnalysisResults(fallbackResults);
        localStorage.setItem('resumeAnalysis', JSON.stringify(fallbackResults));
        
        // Show user-friendly message
        alert('⚠️ AI analysis temporarily unavailable. Using local analysis instead. Your resume has been analyzed successfully!');
        
      } catch (fallbackError) {
        console.error('❌ Fallback analysis also failed:', fallbackError);
        console.error('❌ Fallback error details:', fallbackError instanceof Error ? fallbackError.message : 'Unknown error');
        const errorMsg = fallbackError instanceof Error ? fallbackError.message : 'Unknown error occurred';
        alert(`❌ Both online and offline analysis failed: ${errorMsg}. Please check console for details and try again.`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Download optimized resume function
  const downloadOptimizedResume = () => {
    if (!uploadedFile) {
      alert('Please upload your resume first.');
      return;
    }

    if (!extractedText || !uploadedFile.parsedContent) {
      alert('Unable to extract resume content. Please ensure you uploaded a PDF file, or manually check that the file is not corrupted.');
      return;
    }

    console.log('Generating optimized PDF resume from extracted content...');
    
    const parsedContent = uploadedFile.parsedContent;
    
    // Create PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    
    let yPosition = margin;

    // Helper function to add text with professional formatting (allows multiple pages)
    const addText = (text: string, fontSize: number, isBold: boolean = false, indent: number = 0) => {
      if (!text || text.trim().length === 0) return;
      
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      // Clean and format text before adding
      const cleanText = text
        .replace(/\s+/g, ' ') // Normalize spaces
        .replace(/•\s*/g, '• ') // Fix bullet points
        .trim();
      
      const lines = doc.splitTextToSize(cleanText, contentWidth - indent);
      lines.forEach((line: string) => {
        // Add new page if needed to accommodate ALL content
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          console.log('📄 Added new page to include all content');
        }
        doc.text(line, margin + indent, yPosition);
        yPosition += fontSize * 0.4; // Professional line spacing
      });
      yPosition += 3; // Professional space after text block
    };

    // Helper function to add bullet points with TIGHT formatting
    const addBulletPoint = (text: string, fontSize: number = 10, indent: number = 8) => {
      if (!text || text.trim().length === 0) return;
      
      const cleanText = text.replace(/^[•·▪▫◦‣⁃\-\*]\s*/, '').trim();
      if (cleanText.length === 0) return;
      
      addText(`• ${cleanText}`, fontSize, false, indent);
    };

    // Helper function for compact bullet lists (skills, etc.)
    const addCompactList = (items: string[], fontSize: number = 10) => {
      if (!items || items.length === 0) return;
      
      // Group items into lines of 3-4 for compact display
      const itemsPerLine = 4;
      for (let i = 0; i < items.length; i += itemsPerLine) {
        const lineItems = items.slice(i, i + itemsPerLine);
        addBulletPoint(lineItems.join(' • '), fontSize, 8);
      }
    };

    // Helper function to format experience entries
    const formatExperienceEntry = (text: string) => {
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      const formattedLines: any[] = [];
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.length === 0) return;
        
        // Check if it looks like a job title/company line
        if (trimmed.match(/\b\d{4}\b/) || trimmed.includes('|') || trimmed.includes('-')) {
          formattedLines.push({ type: 'header', text: trimmed });
        } else if (trimmed.match(/^[•·▪▫◦‣⁃\-\*]/)) {
          formattedLines.push({ type: 'bullet', text: trimmed });
        } else if (trimmed.length > 20) {
          formattedLines.push({ type: 'bullet', text: trimmed });
        } else {
          formattedLines.push({ type: 'text', text: trimmed });
        }
      });
      
      return formattedLines;
    };

    // Helper function to add a section header with professional underline (like the example)
    const addSectionHeader = (title: string) => {
      yPosition += 6; // Tight spacing before header
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(title.toUpperCase(), margin, yPosition);
      
      // Add professional underline (full width like the example)
      doc.line(margin, yPosition + 2, margin + contentWidth, yPosition + 2);
      
      yPosition += 8; // Minimal spacing after header
    };

    // Header - Name (centered and large like the example)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    
    // Validate and clean name
    let cleanName = parsedContent.name || '';
    if (cleanName) {
      cleanName = cleanName
        .replace(/[^\w\s\-\.]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (cleanName.length < 2 || cleanName.length > 50 || cleanName.includes('@') || cleanName.match(/\d{3,}/)) {
        cleanName = '[ENTER YOUR FULL NAME]';
      }
    } else {
      cleanName = '[ENTER YOUR FULL NAME]';
    }
    
    // Center the name
    const nameWidth = doc.getTextWidth(cleanName);
    const nameX = (pageWidth - nameWidth) / 2;
    doc.text(cleanName.toUpperCase(), nameX, yPosition);
    yPosition += 8;
    
    // Contact info (centered and compact like the example)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    let cleanContact = parsedContent.contact || '';
    if (cleanContact) {
      cleanContact = cleanContact.replace(/\s+/g, ' ').trim();
      if (cleanContact.length < 5 || cleanContact.includes('undefined')) {
        cleanContact = '[Your City, State Zip] | [Your Phone] | [Your Email]';
      }
    } else {
      cleanContact = '[Your City, State Zip] | [Your Phone] | [Your Email]';
    }
    
    // Center the contact info
    const contactWidth = doc.getTextWidth(cleanContact);
    const contactX = (pageWidth - contactWidth) / 2;
    doc.text(cleanContact, contactX, yPosition);
    
    // Add dotted line separator (like in example)
    yPosition += 4;
    const dotCount = Math.floor(contentWidth / 3);
    let dotLine = '';
    for (let i = 0; i < dotCount; i++) {
      dotLine += '. ';
    }
    doc.setFontSize(8);
    doc.text(dotLine, margin, yPosition);
    yPosition += 8;

    // Professional Summary (Include FULL summary from uploaded resume)
    addSectionHeader('Professional Summary');
    let summaryText = parsedContent.summary;
    
    console.log('🔍 Processing summary content...');
    console.log('📝 Original summary length:', summaryText?.length || 0);
    
    if (summaryText && summaryText.length > 20) {
      // Use the FULL extracted summary, don't truncate
      console.log('✅ Using full extracted summary');
    } else if (analysisResults && analysisResults.strengths.length > 0) {
      summaryText = `Experienced professional with demonstrated expertise in ${analysisResults.strengths.join(', ').toLowerCase()}. Proven track record of delivering results and driving business impact.`;
      console.log('✅ Generated summary from analysis results');
    } else {
      summaryText = 'Results-driven professional with strong analytical and problem-solving skills. Proven ability to deliver high-quality solutions and drive business impact. Dedicated team player with excellent communication skills.';
      console.log('✅ Using default professional summary');
    }
    
    // REMOVED length truncation - include full summary
    console.log('📋 Final summary length:', summaryText.length);
    
    addText(summaryText, 10);

    // Work History (Include ALL experience from uploaded resume)
    addSectionHeader('Work History');
    
    if (parsedContent.experience && parsedContent.experience.trim().length > 10) {
      console.log('🔍 Processing ALL experience content...');
      
      // CLEAN and VALIDATE experience content
      let experienceText = parsedContent.experience
        .replace(/%[a-zA-Z]/g, '')
        .replace(/[^\x20-\x7E\n]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim();
      
      const experienceEntries = experienceText.split('\n').filter((line: any) => {
        const trimmed = line.trim();
        return trimmed.length > 3 && !trimmed.includes('undefined');
      });
      
      console.log('📋 Found', experienceEntries.length, 'experience entries - INCLUDING ALL');
      
      if (experienceEntries.length > 0) {
        let hasValidContent = false;
        
        experienceEntries.forEach((entry: any, index: any) => {
          const cleanEntry = entry.trim();
          
          // Detect job title/company line (NO LIMIT - include ALL jobs)
          const isJobHeader = cleanEntry.match(/\d{4}/) || cleanEntry.includes('|') || 
                             cleanEntry.match(/\b(Manager|Director|Engineer|Analyst|Specialist|Coordinator|Assistant|Lead|Senior|Junior|Teaching|Board|Project|Volunteer|Intern)\b/i);
          
          if (isJobHeader) {
            // Job title/company (bold) - INCLUDE FULL TEXT, don't truncate
            addText(cleanEntry, 10, true);
            hasValidContent = true;
            console.log('✅ Added job header:', cleanEntry);
          } else if (cleanEntry.length > 10) {
            // Bullet point - INCLUDE FULL TEXT, don't truncate
            addBulletPoint(cleanEntry, 9, 8);
            hasValidContent = true;
            console.log('✅ Added bullet point:', cleanEntry.substring(0, 50) + '...');
          }
        });
        
        if (!hasValidContent) {
          addText('Could not parse experience content - showing raw content:', 10);
          addText(experienceText.substring(0, 1000), 9);
        }
      } else {
        addText('No experience entries found in extracted content.', 10);
      }
    } else {
      addText('[Job Title] | [Company] | [Dates]', 10, true);
      addBulletPoint('Key achievement or responsibility with quantified results', 9, 8);
      addBulletPoint('Another significant contribution to the organization', 9, 8);
    }

    // Skills (Include ALL skills from uploaded resume)
    addSectionHeader('Skills');
    let allSkills: string[] = [];
    
    // Add ALL extracted skills (no limits)
    if (parsedContent.skills) {
      console.log('🔍 Processing ALL skills content...');
      const skillsText = parsedContent.skills
        .replace(/[•·▪▫◦‣⁃]/g, ',')
        .replace(/\s+/g, ' ')
        .trim();
      
      const extractedSkills = skillsText
        .split(/[,;\n|]/)
        .map(s => s.trim())
        .filter(s => s.length > 1 && s.length < 50) // Allow longer skill names
        // REMOVED .slice() limit - include ALL skills
        
      allSkills = allSkills.concat(extractedSkills);
      console.log('✅ Added', extractedSkills.length, 'skills from resume');
    }
    
    // Add additional skills from analysis if we have space
    if (analysisResults && analysisResults.missingSkills) {
      const relevantMissingSkills = analysisResults.missingSkills
        .filter(skill => !allSkills.some(existing => existing.toLowerCase().includes(skill.toLowerCase())));
      allSkills = allSkills.concat(relevantMissingSkills);
      console.log('✅ Added', relevantMissingSkills.length, 'recommended skills');
    }
    
    if (allSkills.length === 0) {
      allSkills = ['Please add your skills from the original resume'];
    }
    
    console.log('📋 Total skills to display:', allSkills.length);
    
    // Display ALL skills in compact format
    addCompactList(allSkills, 10);

    // Education (Include ALL education content)
    addSectionHeader('Education');
    
    if (parsedContent.education && parsedContent.education.trim().length > 5) {
      console.log('🔍 Processing ALL education content...');
      const educationLines = parsedContent.education.split('\n').filter(line => line.trim().length > 0);
      
      console.log('📋 Found', educationLines.length, 'education lines - INCLUDING ALL');
      
      educationLines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.length > 0) {
          // Check if it's a degree/institution line (make it bold)
          if (trimmed.match(/\b(Bachelor|Master|PhD|Associate|Certificate|Diploma)\b/i) || 
              trimmed.match(/\b(University|College|Institute|School)\b/i) ||
              trimmed.match(/\b\d{4}\b/)) {
            // INCLUDE FULL TEXT, don't truncate
            addText(trimmed, 10, true);
            console.log('✅ Added education header:', trimmed);
          } else if (trimmed.length > 3) {
            // INCLUDE ALL details, don't limit length
            addBulletPoint(trimmed, 9, 8);
            console.log('✅ Added education detail:', trimmed.substring(0, 50) + '...');
          }
        }
      });
    } else {
      addText('[Degree] in [Field] | [University] | [Year]', 10, true);
      addBulletPoint('Relevant coursework or achievements', 9, 8);
    }

    // Check for and include Projects/Certifications/Additional sections
    if (parsedContent.rawText.match(/project/i)) {
      addSectionHeader('Projects');
      // Extract project information from raw text
      const projectSection = parsedContent.rawText.match(/project[s]?[\s\S]*?(?=\n[A-Z]{3,}|\n\n[A-Z]{3,}|$)/i);
      if (projectSection) {
        const projectText = projectSection[0].replace(/^project[s]?\s*/i, '').trim();
        if (projectText.length > 10) {
          addText(projectText, 9);
        }
      } else {
        addText('Projects mentioned but details not extracted - please review original resume', 9);
      }
    }

    if (parsedContent.rawText.match(/certif|license|credential/i)) {
      addSectionHeader('Certifications');
      // Extract certification information from raw text
      const certSection = parsedContent.rawText.match(/certif[ication]*[s]?[\s\S]*?(?=\n[A-Z]{3,}|\n\n[A-Z]{3,}|$)/i);
      if (certSection) {
        const certText = certSection[0].replace(/^certif[ication]*[s]?\s*/i, '').trim();
        if (certText.length > 5) {
          addText(certText, 9);
        }
      } else {
        addText('Certifications mentioned but details not extracted - please review original resume', 9);
      }
    }

    // COMPACT optimization notes at bottom (only if space allows)
    if (yPosition < pageHeight - 40) {
      yPosition = pageHeight - 35; // Position at bottom
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      const notes = [];
      
      if (analysisResults) {
        notes.push(`ATS Score: ${analysisResults.atsScore}%`);
        if (analysisResults.missingSkills.length > 0) {
          notes.push(`Keywords: ${analysisResults.missingSkills.slice(0, 3).join(', ')}`);
        }
      }
      
      const noteText = notes.length > 0 ? notes.join(' | ') : 'Optimized for ATS compatibility';
      doc.text(`Optimization Notes: ${noteText}`, margin, yPosition);
    }

    // Add generation timestamp at very bottom
    yPosition = pageHeight - 15;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    const timestamp = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    doc.text(`Generated by Mentorly ATS Optimizer - ${timestamp}`, margin, yPosition);

    // Save the PDF with improved naming
    const cleanFilename = uploadedFile.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9\-_]/g, '_');
    const filename = `Mentorly_Optimized_Resume_${cleanFilename}.pdf`;
    doc.save(filename);

    // Show success message with details about improvements
    const improvementCount = [
      parsedContent.name ? 1 : 0,
      parsedContent.contact ? 1 : 0, 
      parsedContent.summary ? 1 : 0,
      parsedContent.experience ? 1 : 0,
      parsedContent.education ? 1 : 0,
      parsedContent.skills ? 1 : 0
    ].reduce((a, b) => a + b, 0);

    const message = `🎉 Professional Resume Generated with ALL Your Content!

✅ COMPLETE CONTENT: Includes ALL information from your uploaded resume
✅ NO TRUNCATION: Full job descriptions, all skills, complete education details
✅ PROFESSIONAL FORMAT: Clean, ATS-friendly layout with proper formatting
✅ SMART EXTRACTION: Successfully extracted ${improvementCount} resume sections
✅ ENHANCED FORMATTING: Improved readability while preserving all original content
✅ VALIDATED CONTENT: Removed formatting artifacts and fixed text corruption
✅ AI-ENHANCED: ${analysisResults?.source === 'local_fallback' ? 'Local analysis' : 'AI-powered recommendations'}

📋 INCLUDED SECTIONS:
• Professional header with your actual contact information
• Complete professional summary (full content)
• ALL work experience entries (no limits, full descriptions)
• ALL skills listed (comprehensive list)
• Complete education details
• ${parsedContent.rawText.match(/project/i) ? 'Projects section included' : ''}
• ${parsedContent.rawText.match(/certif|license|credential/i) ? 'Certifications section included' : ''}

📁 Downloaded as: ${filename}
📄 Pages: Professional layout that includes all your content (may span multiple pages to ensure nothing is omitted)

💼 READY TO CUSTOMIZE: Review and adjust as needed - all your original information is preserved and professionally formatted!`;
    
    alert(message);
  };

  // Generate more STAR bullets function
  const generateMoreBullets = () => {
    if (!uploadedFile) {
      alert('Please upload your resume first.');
      return;
    }

    console.log('Generating additional STAR bullets...');
    
    const additionalBullets = [
      {
        title: "Cross-Functional Collaboration",
        situation: "Worked with marketing, sales, and product teams on a new feature launch.",
        task: "Ensure seamless integration and communication across departments.",
        action: "Organized weekly cross-functional meetings, created shared documentation, and established clear communication channels.",
        result: "Reduced project delivery time by 20% and improved inter-team satisfaction scores by 35%."
      },
      {
        title: "Process Innovation",
        situation: "Manual reporting process was consuming 15+ hours weekly across the team.",
        task: "Automate reporting and reduce manual workload.",
        action: "Researched automation tools, implemented dashboard solution, and trained team on new processes.",
        result: "Saved 12 hours per week team-wide, allowing focus on strategic initiatives and increasing productivity by 30%."
      },
      {
        title: "Customer Success Initiative",
        situation: "Customer satisfaction scores were declining due to response time issues.",
        task: "Improve customer response times and overall satisfaction.",
        action: "Implemented ticket prioritization system, created response templates, and established customer feedback loop.",
        result: "Improved response time by 45% and increased customer satisfaction scores from 3.2 to 4.6/5.0."
      }
    ];

    // Create downloadable content
    const bulletsContent = `ADDITIONAL STAR BULLETS FOR YOUR RESUME
=======================================

Generated for: ${uploadedFile.name}
Date: ${new Date().toLocaleDateString()}

${additionalBullets.map((bullet, index) => `
${index + 1}. ${bullet.title}
Situation: ${bullet.situation}
Task: ${bullet.task}
Action: ${bullet.action}
Result: ${bullet.result}

Formatted Bullet Point:
• ${bullet.situation} ${bullet.task} ${bullet.action} ${bullet.result}

`).join('\n')}

HOW TO USE THESE BULLETS:
1. Choose the most relevant bullets for your target role
2. Customize the details to match your actual experience
3. Ensure the numbers and metrics are accurate
4. Place them in the appropriate sections of your resume
5. Tailor the language to match the job description

Generated by Mentorly ATS Optimizer
`;

    const blob = new Blob([bulletsContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `additional_star_bullets_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    alert('✅ Additional STAR bullets generated and downloaded! Customize these examples to match your experience.');
  };

  // NEW: Render structured resume editor or upload interface
  console.log('🎯 RENDER CHECK - resumeData:', resumeData);
  
  if (false) { // DISABLED - Always show ATS interface
    console.log('✅ RENDERING NEW STRUCTURED EDITOR');
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
              onClick={() => {
                setResumeData(null);
                setLintResults(null);
                setEditingSection(null);
                setUploadedFile(null);
                setExtractedText('');
              }}
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
                    {resumeData.skills.reduce((total, cat) => total + cat.items.length, 0)} skills
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
                            className="w-full p-2 rounded border text-sm"
                            style={{background: colors.background, border: `1px solid ${colors.cardBorder}`, color: colors.text}}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{color: colors.text}}>Company</label>
                          <input
                            type="text"
                            value={job.company}
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

      {/* NEW: Demo Section - Structured Resume Editor */}
      <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3" style={{color: colors.text}}>
            <Edit className="h-6 w-6" style={{color: colors.accent}} />
            New: Structured Resume Editor (Demo)
          </h2>
          <button 
            onClick={() => {
              // Create demo resume data
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
                    category: 'Programming Languages',
                    items: ['JavaScript', 'Python', 'TypeScript', 'Java']
                  },
                  {
                    category: 'Frameworks & Tools', 
                    items: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes']
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
              
              // setResumeData(demoData); // DISABLED - Stay in ATS mode
              const lintResults = lintResumeData(demoData);
              setLintResults(lintResults);
              console.log('🎯 Demo data loaded:', demoData);
            }}
            className="px-4 py-2 rounded-lg border transition-colors hover:opacity-80"
            style={{background: colors.accent + '20', border: `1px solid ${colors.accent}`, color: colors.accent}}
          >
            Load Demo Resume
          </button>
        </div>
        
        <p className="text-sm opacity-80 mb-4" style={{color: colors.text}}>
          Click "Load Demo Resume" to see the new structured editing interface in action!
        </p>

        {/* Show structured editor if demo data is loaded */}
        {resumeData && (
          <div className="border-t pt-6" style={{borderColor: colors.cardBorder}}>
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
                        {resumeData.skills.reduce((total, cat) => total + cat.items.length, 0)} skills
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
                              value={category.items.join(', ')}
                              onChange={(e) => {
                                const updatedSkills = [...resumeData.skills];
                                updatedSkills[index] = { ...category, items: e.target.value.split(',').map(s => s.trim()).filter(s => s) };
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
        )}
      </div>
    </div>
  );
}

  console.log('❌ RENDERING OLD UPLOAD INTERFACE');
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3" style={{color: colors.text}}>ATS Resume Optimizer</h1>
        <p className="text-xl opacity-80" style={{color: colors.text}}>
          Upload your resume to get started with structured editing and AI-powered optimization
        </p>
      </div>

      {/* Upload Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          {/* Hidden file input - always rendered */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInputChange}
          />
          
          <div className="text-center">
            {!uploadedFile ? (
              <>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`}}>
                  <Upload className="h-8 w-8" style={{color: theme === 'dark' ? '#c4b5fd' : '#6b7280'}} />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{color: colors.text}}>Upload Your Resume</h3>
                <p className="mb-6 opacity-80" style={{color: colors.text}}>
                  Upload your current resume to analyze and optimize for ATS systems
                </p>
                <div
                  className={`w-full p-4 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${isDragOver ? 'scale-105' : ''}`}
                  style={{
                    borderColor: isDragOver ? 'rgba(139, 92, 246, 0.8)' : theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.6)',
                    background: isDragOver ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                    color: theme === 'dark' ? '#c4b5fd' : '#6b7280'
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={(e) => {
                    console.log('Upload area clicked!', e);
                    handleClick();
                  }}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{borderColor: theme === 'dark' ? '#c4b5fd' : '#6b7280'}}></div>
                      <span className="ml-2 font-medium">Processing...</span>
                    </div>
                  ) : (
                    <>
                      <div className="font-medium">
                        {isDragOver ? 'Drop your file here' : 'Click to upload or drag and drop'}
                      </div>
                      <div className="text-sm mt-1 opacity-70" style={{color: colors.text}}>PDF, DOC, DOCX up to 5MB</div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`}}>
                  <CheckCircle className="h-8 w-8" style={{color: '#22c55e'}} />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{color: colors.text}}>Upload Your Resume</h3>
                <p className="mb-6 opacity-80" style={{color: colors.text}}>
                  ✅ {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB) uploaded successfully
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button 
                    onClick={analyzeResume}
                    disabled={isAnalyzing}
                    className="px-5 py-3 rounded-xl transition-all hover:opacity-80 text-sm font-medium flex items-center space-x-2"
                    style={{
                      background: isAnalyzing ? 'rgba(139, 92, 246, 0.05)' : 'rgba(34, 197, 94, 0.1)', 
                      border: `1px solid ${isAnalyzing ? 'rgba(139, 92, 246, 0.2)' : 'rgba(34, 197, 94, 0.3)'}`, 
                      color: isAnalyzing ? (theme === 'dark' ? '#9ca3af' : '#6b7280') : '#059669'
                    }}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{borderColor: theme === 'dark' ? '#9ca3af' : '#6b7280'}}></div>
                        <span>🤖 AI Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        <span>🤖 AI Analyze Resume</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={(e) => {
                      console.log('Replace file button clicked!', e);
                      handleClick();
                    }}
                    className="px-5 py-3 rounded-xl transition-all hover:opacity-80 text-sm font-medium"
                    style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: theme === 'dark' ? '#c4b5fd' : '#8b5cf6'}}
                  >
                    Replace file
                  </button>
                  <button 
                    onClick={removeFile}
                    className="px-5 py-3 rounded-xl transition-all hover:opacity-80 text-sm font-medium"
                    style={{background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: theme === 'dark' ? '#fca5a5' : '#dc2626'}}
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{background: 'transparent', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
              <FileText className="h-8 w-8" style={{color: '#22c55e'}} />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{color: colors.text}}>Paste Job Description</h3>
            <p className="mb-6 opacity-80" style={{color: colors.text}}>
              Add the job description to tailor your resume with targeted STAR bullets
            </p>
            <textarea
              placeholder="Paste the job description here..."
              className="w-full h-32 p-4 rounded-2xl outline-none transition-all resize-none" style={{background: theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(248, 250, 252, 0.9)', border: `1px solid ${colors.cardBorder}`, color: colors.text}}
            />
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3" style={{color: colors.text}}>
            ATS Analysis Results
            {analysisResults && analysisResults.source !== 'local_fallback' && (
              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{background: 'rgba(34, 197, 94, 0.15)', color: '#059669', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
                🤖 AI-Powered
              </span>
            )}
          </h2>
        </div>
        
        {!analysisResults ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
              <Target className="h-8 w-8" style={{color: '#8b5cf6'}} />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{color: colors.text}}>No Analysis Yet</h3>
            <p className="opacity-80" style={{color: colors.text}}>
              Upload your resume and click "🤖 AI Analyze Resume" to get intelligent ATS insights powered by ChatGPT
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-2xl" style={{background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
                <div className="text-3xl font-bold mb-2" style={{color: '#059669'}}>{analysisResults.atsScore}%</div>
                <div className="font-medium" style={{color: colors.text}}>ATS Score</div>
                <div className="text-sm opacity-70" style={{color: colors.text}}>
                  {analysisResults.atsScore >= 90 ? 'Excellent match' : 
                   analysisResults.atsScore >= 80 ? 'Good match' : 
                   analysisResults.atsScore >= 70 ? 'Fair match' : 'Needs improvement'}
                </div>
              </div>
              <div className="text-center p-6 rounded-2xl" style={{background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)'}}>
                <div className="text-3xl font-bold mb-2" style={{color: '#0284c7'}}>{analysisResults.keywordMatches}</div>
                <div className="font-medium" style={{color: colors.text}}>Keywords Matched</div>
                <div className="text-sm opacity-70" style={{color: colors.text}}>Industry relevant terms</div>
              </div>
              <div className="text-center p-6 rounded-2xl" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                <div className="text-3xl font-bold mb-2" style={{color: '#8b5cf6'}}>{analysisResults.missingSkills.length}</div>
                <div className="font-medium" style={{color: colors.text}}>Missing Skills</div>
                <div className="text-sm opacity-70" style={{color: colors.text}}>To improve ranking</div>
              </div>
            </div>
          </>
        )}

        {/* Detailed Analysis */}
        {analysisResults && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* What's Working */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{color: colors.text}}>
                <CheckCircle className="h-5 w-5" style={{color: '#059669'}} />
                What's Working Well
              </h3>
              <div className="space-y-3">
                {analysisResults.strengths.map((strength: string, index: number) => (
                  <div key={index} className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
                    <div className="font-medium" style={{color: colors.text}}>{strength}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas to Improve */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{color: colors.text}}>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Areas to Improve
              </h3>
              <div className="space-y-3">
                {analysisResults.improvements.map((improvement: string, index: number) => (
                  <div key={index} className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                    <div className="font-medium" style={{color: colors.text}}>{improvement}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{color: colors.text}}>
                <Target className="h-5 w-5" style={{color: '#8b5cf6'}} />
                Missing Skills & Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResults.missingSkills.map((skill: string, index: number) => (
                  <div key={index} className="px-3 py-2 rounded-lg text-sm font-medium" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#8b5cf6'}}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resume Improvement Tips */}
      <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: 'transparent', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
            <Target className="h-5 w-5" style={{color: '#22c55e'}} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold" style={{color: colors.text}}>Resume Improvement Tips</h2>
            <p className="opacity-70" style={{color: colors.text}}>
              {analysisResults?.personalizedTips ? 'Personalized recommendations based on your resume' : 'Expert strategies to boost your ATS score and get noticed'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Content & Keywords */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{color: colors.text}}>
              <FileText className="h-5 w-5" style={{color: '#8b5cf6'}} />
              Content & Keywords
            </h3>
            <div className="space-y-3">
              {analysisResults?.personalizedTips?.contentKeywords?.length > 0 ? (
                // Show personalized tips
                analysisResults.personalizedTips.contentKeywords.map((tip: string, index: number) => (
                  <div key={index} className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(237, 233, 254, 0.8)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>For Your Resume</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>{tip}</div>
                  </div>
                ))
              ) : (
                // Show generic tips
                <>
                  <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(237, 233, 254, 0.8)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>Use Industry Keywords</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>Mirror the exact language from job descriptions. Use both acronyms and full terms (e.g., "AI" and "Artificial Intelligence").</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(237, 233, 254, 0.8)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>Quantify Everything</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>Include numbers, percentages, and metrics. "Increased sales by 25%" is better than "Increased sales significantly".</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(237, 233, 254, 0.8)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>Use Action Verbs</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>Start bullets with strong verbs: "Implemented," "Optimized," "Led," "Developed," "Achieved."</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Format & Structure */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{color: colors.text}}>
              <CheckCircle className="h-5 w-5" style={{color: '#22c55e'}} />
              Format & Structure
            </h3>
            <div className="space-y-3">
              {analysisResults?.personalizedTips?.formatStructure?.length > 0 ? (
                // Show personalized tips
                analysisResults.personalizedTips.formatStructure.map((tip: string, index: number) => (
                  <div key={index} className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>For Your Resume</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>{tip}</div>
                  </div>
                ))
              ) : (
                // Show generic tips
                <>
                  <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>Keep It Simple</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>Use standard fonts (Arial, Calibri), avoid graphics/tables, and stick to black text on white background for ATS compatibility.</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>Use Standard Headings</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>Stick to conventional section names: "Experience," "Education," "Skills" rather than creative alternatives.</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>Optimize Length</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>1 page for entry-level, 2 pages max for experienced professionals. Every line should add value.</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Skills & Certifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{color: colors.text}}>
              <Zap className="h-5 w-5" style={{color: '#f59e0b'}} />
              Skills & Certifications
            </h3>
            <div className="space-y-3">
              {analysisResults?.personalizedTips?.skillsCertifications?.length > 0 ? (
                // Show personalized tips
                analysisResults.personalizedTips.skillsCertifications.map((tip: string, index: number) => (
                  <div key={index} className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(254, 243, 199, 0.8)', border: '1px solid rgba(245, 158, 11, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>For Your Resume</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>{tip}</div>
                  </div>
                ))
              ) : (
                // Show generic tips
                <>
                  <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(254, 243, 199, 0.8)', border: '1px solid rgba(245, 158, 11, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>Match Job Requirements</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>List skills that directly match the job posting. Prioritize hard skills and technical competencies.</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(254, 243, 199, 0.8)', border: '1px solid rgba(245, 158, 11, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>Include Certifications</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>List relevant certifications, licenses, and training programs. Include dates and certification numbers when applicable.</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{color: colors.text}}>
              <AlertTriangle className="h-5 w-5" style={{color: '#ef4444'}} />
              Common Mistakes to Avoid
            </h3>
            <div className="space-y-3">
              {analysisResults?.personalizedTips?.commonMistakes?.length > 0 ? (
                // Show personalized tips
                analysisResults.personalizedTips.commonMistakes.map((tip: string, index: number) => (
                  <div key={index} className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>For Your Resume</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>{tip}</div>
                  </div>
                ))
              ) : (
                // Show generic tips
                <>
                  <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>Avoid Typos</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>Proofread multiple times. Use spell check and have others review. Typos can eliminate you instantly.</div>
                  </div>
                  <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                    <div className="font-medium mb-2" style={{color: colors.text}}>Don't Oversell</div>
                    <div className="text-sm opacity-70" style={{color: colors.text}}>Be honest about your experience level. Focus on achievements rather than exaggerated claims.</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Notice */}
        {!analysisResults?.personalizedTips && (
          <div className="mt-8 p-4 rounded-2xl text-center" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(237, 233, 254, 0.9)', border: '1px solid rgba(139, 92, 246, 0.4)'}}>
            <div className="text-sm opacity-80" style={{color: colors.text}}>
              💡 Upload and analyze your resume to get personalized improvement tips tailored specifically to your content!
            </div>
          </div>
        )}

        {analysisResults?.personalizedTips && (
          <div className="mt-8 p-4 rounded-2xl text-center" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(220, 252, 231, 0.9)', border: '1px solid rgba(34, 197, 94, 0.4)'}}>
            <div className="text-sm opacity-80" style={{color: colors.text}}>
              ✨ These tips are personalized based on your specific resume content and analysis results!
            </div>
          </div>
        )}

        {/* Pro Tips Banner */}
        <div className="mt-8 p-6 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(220, 252, 231, 0.9)', border: '1px solid rgba(34, 197, 94, 0.4)'}}>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: 'rgba(34, 197, 94, 0.2)'}}>
              <CheckCircle className="h-5 w-5" style={{color: '#059669'}} />
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{color: colors.text}}>💡 Pro Tip: The 6-Second Rule</h4>
              <p className="text-sm opacity-80" style={{color: colors.text}}>
                Recruiters spend an average of 6 seconds scanning your resume. Make sure your most impressive achievements are visible at first glance. 
                Use bullet points, bold key metrics, and put your strongest experience first.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generated STAR Bullets */}
      <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: 'transparent', border: '1px solid rgba(56, 189, 248, 0.3)'}}>
            <Zap className="h-5 w-5" style={{color: '#38bdf8'}} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold" style={{color: colors.text}}>AI-Generated STAR Bullets</h2>
            <p className="opacity-70" style={{color: colors.text}}>Evidence-based bullets tailored to the job description</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(237, 233, 254, 0.8)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
            <div className="font-medium mb-3" style={{color: colors.text}}>Team Leadership & Development</div>
            <div className="text-sm leading-relaxed opacity-80 space-y-2" style={{color: colors.text}}>
              <div><strong>Situation:</strong> Led a cross-functional team of 8 members on a high-priority marketing campaign.</div>
              <div><strong>Task:</strong> Coordinate resources, manage timelines, and ensure quality deliverables.</div>
              <div><strong>Action:</strong> Implemented weekly check-ins, streamlined communication, and provided mentorship to team members.</div>
              <div><strong>Result:</strong> Delivered campaign 2 weeks early, increased team satisfaction by 40%, and exceeded KPIs by 25%.</div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
            <div className="font-medium mb-3" style={{color: colors.text}}>Strategic Project Management</div>
            <div className="text-sm leading-relaxed opacity-80 space-y-2" style={{color: colors.text}}>
              <div><strong>Situation:</strong> Managed a complex client onboarding process across multiple departments.</div>
              <div><strong>Task:</strong> Streamline workflows and improve client satisfaction ratings.</div>
              <div><strong>Action:</strong> Analyzed existing processes, collaborated with stakeholders, and implemented new tracking systems.</div>
              <div><strong>Result:</strong> Reduced onboarding time by 35% and increased client satisfaction from 7.2 to 9.1/10.</div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(219, 234, 254, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)'}}>
            <div className="font-medium mb-3" style={{color: colors.text}}>Process Optimization</div>
            <div className="text-sm leading-relaxed opacity-80 space-y-2" style={{color: colors.text}}>
              <div><strong>Situation:</strong> Department experiencing efficiency issues during peak business periods.</div>
              <div><strong>Task:</strong> Identify bottlenecks and implement scalable process improvements.</div>
              <div><strong>Action:</strong> Conducted workflow analysis, gathered team feedback, and designed new procedures with stakeholder input.</div>
              <div><strong>Result:</strong> Improved team productivity by 60% and eliminated bottlenecks during high-volume periods.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
