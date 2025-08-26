// @author: fatima bashir
import { ResumeData } from '@/contexts/ResumeContext';

export class ResumeProcessor {
  
  // Extract text from different file types
  static async extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type;
    
    try {
      if (fileType === 'application/pdf') {
        return await this.extractTextFromPDF(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return await this.extractTextFromDOCX(file);
      } else if (fileType === 'application/msword') {
        // For .doc files, we'll use a simpler approach or convert to text
        return await this.extractTextFromDOC(file);
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('Error extracting text from file:', error);
      throw new Error('Failed to extract text from resume');
    }
  }

  // Extract text from PDF using PDF.js (we'll need to install this)
  private static async extractTextFromPDF(file: File): Promise<string> {
    // For now, return a placeholder. In production, we'd use PDF.js
    // const pdfjsLib = await import('pdfjs-dist/webpack');
    // ... PDF processing logic
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // This is a simplified approach - in reality we'd parse the PDF properly
        resolve("PDF text extraction placeholder - resume content would appear here");
      };
      reader.readAsText(file);
    });
  }

  // Extract text from DOCX using mammoth.js (we'll need to install this)
  private static async extractTextFromDOCX(file: File): Promise<string> {
    // For now, return a placeholder. In production, we'd use mammoth.js
    // const mammoth = await import('mammoth');
    // const result = await mammoth.extractRawText({arrayBuffer: await file.arrayBuffer()});
    // return result.value;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve("DOCX text extraction placeholder - resume content would appear here");
      };
      reader.readAsText(file);
    });
  }

  // Extract text from DOC files
  private static async extractTextFromDOC(file: File): Promise<string> {
    // DOC files are more complex - for now, return placeholder
    return new Promise((resolve) => {
      resolve("DOC text extraction placeholder - resume content would appear here");
    });
  }

  // Process the extracted text to identify key information
  static processResumeData(textContent: string): ResumeData['extractedData'] {
    const extractedData: ResumeData['extractedData'] = {
      skills: [],
      experience: [],
      education: []
    };

    // Simple regex patterns to extract basic info
    const emailMatch = textContent.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    const phoneMatch = textContent.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    
    if (emailMatch) extractedData.email = emailMatch[0];
    if (phoneMatch) extractedData.phone = phoneMatch[0];

    // Extract potential skills (this is a simple approach)
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
      'TypeScript', 'Git', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL',
      'Leadership', 'Communication', 'Project Management', 'Agile', 'Scrum',
      'Machine Learning', 'Data Analysis', 'Analytics', 'Marketing', 'Sales'
    ];

    extractedData.skills = commonSkills.filter(skill => 
      textContent.toLowerCase().includes(skill.toLowerCase())
    );

    // Try to extract name (usually at the top)
    const lines = textContent.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // Basic heuristic: if first line looks like a name (2-3 words, no numbers)
      if (firstLine.split(' ').length <= 3 && !/\d/.test(firstLine)) {
        extractedData.name = firstLine;
      }
    }

    return extractedData;
  }

  // Create the complete ResumeData object
  static async processResumeFile(file: File): Promise<ResumeData> {
    const textContent = await this.extractTextFromFile(file);
    const extractedData = this.processResumeData(textContent);

    return {
      file,
      textContent,
      extractedData,
      uploadedAt: new Date()
    };
  }

  // Generate AI context from resume data
  static generateAIContext(resume: ResumeData): string {
    const { extractedData, textContent } = resume;
    
    let context = "User's Resume Information:\n";
    
    if (extractedData.name) {
      context += `Name: ${extractedData.name}\n`;
    }
    
    if (extractedData.email) {
      context += `Email: ${extractedData.email}\n`;
    }
    
    if (extractedData.skills && extractedData.skills.length > 0) {
      context += `Skills: ${extractedData.skills.join(', ')}\n`;
    }
    
    if (extractedData.experience && extractedData.experience.length > 0) {
      context += `Experience:\n`;
      extractedData.experience.forEach(exp => {
        context += `- ${exp.role} at ${exp.company} (${exp.duration})\n`;
      });
    }
    
    context += `\nFull Resume Content:\n${textContent}`;
    
    return context;
  }
}

