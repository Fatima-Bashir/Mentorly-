// @author: fatima bashir
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface ResumeData {
  file: File;
  textContent: string;
  extractedData: {
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    experience?: Array<{
      company: string;
      role: string;
      duration: string;
      description: string;
    }>;
    education?: Array<{
      institution: string;
      degree: string;
      year: string;
    }>;
  };
  uploadedAt: Date;
}

interface ResumeContextType {
  resume: ResumeData | null;
  setResume: (resume: ResumeData | null) => void;
  isResumeUploaded: boolean;
  clearResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resume, setResumeState] = useState<ResumeData | null>(null);

  const setResume = (newResume: ResumeData | null) => {
    setResumeState(newResume);
    // Optionally persist to localStorage
    if (newResume) {
      localStorage.setItem('uploadedResume', JSON.stringify({
        fileName: newResume.file.name,
        textContent: newResume.textContent,
        extractedData: newResume.extractedData,
        uploadedAt: newResume.uploadedAt
      }));
    } else {
      localStorage.removeItem('uploadedResume');
    }
  };

  const clearResume = () => {
    setResumeState(null);
    localStorage.removeItem('uploadedResume');
  };

  const isResumeUploaded = resume !== null;

  return (
    <ResumeContext.Provider value={{ 
      resume, 
      setResume, 
      isResumeUploaded, 
      clearResume 
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

