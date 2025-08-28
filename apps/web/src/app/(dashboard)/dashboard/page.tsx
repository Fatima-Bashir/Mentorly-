// @author: fatima bashir
'use client';
import Link from "next/link";
import { useTheme } from '@/lib/ThemeContext';
import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Brain, 
  FileText, 
  Target, 
  MessageCircle,
  Upload,
  Eye,
  BarChart3,
  User,
  Briefcase,
  GraduationCap
} from "lucide-react";

// Resume data interface (same as ATS optimizer)
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



export default function DashboardPage() {
  const { theme, colors } = useTheme();
  const [hasResume, setHasResume] = useState(false);
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [analysisScore, setAnalysisScore] = useState<number | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  

  
  // Check if user has uploaded a resume and analysis
  useEffect(() => {
    console.log('🏠 Dashboard: Loading resume data from localStorage...');
    
    // Check for uploaded resume file
    const savedResume = localStorage.getItem('uploadedResume');
    if (savedResume) {
      try {
        const fileData = JSON.parse(savedResume);
        if (fileData && fileData.name) {
          setHasResume(true);
          setResumeFileName(fileData.name);
          console.log('✅ Found uploaded file:', fileData.name);
        }
      } catch (error) {
        console.error('Error loading saved resume file:', error);
      }
    }
    
    // Check for structured resume data
    const savedStructuredData = localStorage.getItem('structuredResumeData');
    if (savedStructuredData) {
      try {
        const structuredData = JSON.parse(savedStructuredData);
        if (structuredData) {
          setResumeData(structuredData);
          console.log('✅ Found structured resume data:');
          console.log('  👤 Name:', structuredData.personal?.name);
          console.log('  💼 Experience items:', structuredData.experience?.length || 0);
          console.log('  🎓 Education items:', structuredData.education?.length || 0);
          console.log('  🛠️ Skill categories:', structuredData.skills?.length || 0);
          console.log('  📱 Contact:', structuredData.personal?.email, structuredData.personal?.phone);
        }
      } catch (error) {
        console.error('Error loading structured resume data:', error);
      }
    }
    
    // Check for existing analysis
    const savedAnalysis = localStorage.getItem('resumeAnalysis');
    if (savedAnalysis) {
      try {
        const analysisData = JSON.parse(savedAnalysis);
        if (analysisData && analysisData.atsScore) {
          setHasAnalysis(true);
          setAnalysisScore(analysisData.atsScore);
          console.log('✅ Found analysis data with score:', analysisData.atsScore);
        }
      } catch (error) {
        console.error('Error loading saved analysis:', error);
      }
    }
    

  }, []);
  

  
  // Authentication temporarily disabled - showing demo data

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3 text-balance" style={{color: colors.text, fontWeight: 700, letterSpacing: '-0.025em'}}>
          Welcome back{resumeData?.personal?.name ? `, ${resumeData.personal.name.split(' ')[0]}` : ''}!
        </h1>
        
        {hasResume ? (
          <>
            <p className="text-xl opacity-80 text-pretty mb-6" style={{color: colors.text, fontWeight: 400}}>
              {(() => {
                const currentRole = resumeData?.experience?.[0]?.title?.toLowerCase() || '';
                const experienceCount = resumeData?.experience?.length || 0;
                
                if (currentRole.includes('manager') || currentRole.includes('lead')) {
                  return `Ready to advance your leadership career? Let's enhance your management profile!`;
                } else if (currentRole.includes('senior') || experienceCount >= 3) {
                  return `Time to showcase your senior expertise? Let's optimize your professional profile!`;
                } else if (currentRole.includes('developer') || currentRole.includes('engineer')) {
                  return `Ready to level up your tech career? Let's build an impressive engineering profile!`;
                } else if (currentRole.includes('analyst') || currentRole.includes('data')) {
                  return `Ready to advance your analytics career? Let's optimize your data expertise!`;
                } else if (experienceCount <= 2) {
                  return `Ready to accelerate your career growth? Let's create a standout professional profile!`;
                } else {
                  return `Ready to review and optimize your resume? Let's make it even better!`;
                }
              })()}
            </p>
            
            {/* Resume Review Call-to-Action */}
            <div className="p-6 rounded-3xl shadow-lg" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                    <FileText className="h-6 w-6" style={{color: theme === 'dark' ? '#c4b5fd' : '#8b5cf6'}} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{color: colors.text}}>
                      {resumeData?.personal?.name || resumeFileName}
                    </h3>
                    <p className="text-sm opacity-70 mb-1" style={{color: colors.text}}>
                      {resumeData?.personal?.email && resumeData?.personal?.phone ? 
                        `${resumeData.personal.email} • ${resumeData.personal.phone}` :
                        resumeData?.personal?.email || resumeData?.personal?.phone || resumeFileName
                      }
                    </p>
                    <p className="text-sm opacity-60" style={{color: colors.text}}>
                      {resumeData ? 
                        `${resumeData.experience?.length || 0} jobs • ${resumeData.education?.length || 0} education • ${resumeData.skills?.reduce((acc, cat) => acc + cat.items.length, 0) || 0} skills` :
                        hasAnalysis ? 
                          `Last ATS Score: ${analysisScore}/100 • Ready for a fresh analysis?` : 
                          'Would you like to review your resume analysis?'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {hasAnalysis && (
                    <div className="flex items-center px-4 py-3 rounded-2xl" style={{
                      background: analysisScore && analysisScore >= 85 ? 'rgba(34, 197, 94, 0.1)' : analysisScore && analysisScore >= 70 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: analysisScore && analysisScore >= 85 ? '#059669' : analysisScore && analysisScore >= 70 ? '#d97706' : '#dc2626',
                      border: `1px solid ${analysisScore && analysisScore >= 85 ? 'rgba(34, 197, 94, 0.2)' : analysisScore && analysisScore >= 70 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }}>
                      <span className="text-sm font-bold">
                        {analysisScore && analysisScore >= 85 ? '🎉 Excellent' : analysisScore && analysisScore >= 70 ? '⚡ Good' : '🎯 Needs Work'}
                      </span>
                    </div>
                  )}
                  <Link 
                    href="/ats" 
                    className="inline-flex items-center px-6 py-3 rounded-2xl font-semibold transition-all hover:opacity-90 shadow-lg"
                    style={{
                      background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)', 
                      color: theme === 'dark' ? '#c4b5fd' : '#8b5cf6',
                      border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.25)'}`
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Review Resume
                  </Link>

                </div>
              </div>
            </div>
            
            {/* Resume Data Overview - Show we have full access */}
            {resumeData && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recent Experience */}
                {resumeData.experience && resumeData.experience.length > 0 && (
                  <div className="p-4 rounded-2xl" style={{background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)'}}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Briefcase className="w-4 h-4" style={{color: '#059669'}} />
                      <span className="text-sm font-semibold" style={{color: colors.text}}>Current Role</span>
                    </div>
                    <p className="text-sm font-medium" style={{color: colors.text}}>
                      {resumeData.experience[0].title}
                    </p>
                    <p className="text-xs opacity-70" style={{color: colors.text}}>
                      {resumeData.experience[0].company}
                    </p>
                  </div>
                )}
                
                {/* Education */}
                {resumeData.education && resumeData.education.length > 0 && (
                  <div className="p-4 rounded-2xl" style={{background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)'}}>
                    <div className="flex items-center space-x-2 mb-2">
                      <GraduationCap className="w-4 h-4" style={{color: '#0284c7'}} />
                      <span className="text-sm font-semibold" style={{color: colors.text}}>Education</span>
                    </div>
                    <p className="text-sm font-medium" style={{color: colors.text}}>
                      {resumeData.education[0].degree}
                    </p>
                    <p className="text-xs opacity-70" style={{color: colors.text}}>
                      {resumeData.education[0].institution}
                    </p>
                  </div>
                )}
                
                {/* Key Skills */}
                {resumeData.skills && resumeData.skills.length > 0 && (
                  <div className="p-4 rounded-2xl" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4" style={{color: theme === 'dark' ? '#c4b5fd' : '#8b5cf6'}} />
                      <span className="text-sm font-semibold" style={{color: colors.text}}>Top Skills</span>
                    </div>
                    <p className="text-sm font-medium" style={{color: colors.text}}>
                      {resumeData.skills[0].category}
                    </p>
                    <p className="text-xs opacity-70" style={{color: colors.text}}>
                      {resumeData.skills[0].items.slice(0, 2).join(', ')}
                      {resumeData.skills[0].items.length > 2 && ` +${resumeData.skills[0].items.length - 2} more`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-xl opacity-80 text-pretty" style={{color: colors.text, fontWeight: 400}}>
            Continue your career growth journey with personalized AI guidance.
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Link href="/ats" className="group p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{background: hasResume ? 'rgba(139, 92, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)', border: hasResume ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)'}}>
            {hasResume ? (
              <FileText className="h-7 w-7" style={{color: theme === 'dark' ? '#c4b5fd' : '#8b5cf6'}} />
            ) : (
              <Upload className="h-7 w-7" style={{color: '#22c55e'}} />
            )}
          </div>
          <div className="text-center">
            <div className="font-semibold mb-1" style={{color: colors.text}}>
              {hasResume ? 
                (resumeData?.experience?.[0]?.title?.toLowerCase().includes('manager') || resumeData?.experience?.[0]?.title?.toLowerCase().includes('lead') ? 'Optimize' : 'Review') : 
                'Upload'
              }
            </div>
            <div className="text-sm opacity-70" style={{color: colors.text}}>
              {hasResume ? 
                (resumeData?.experience?.[0]?.title?.toLowerCase().includes('senior') || (resumeData?.experience?.length || 0) >= 3 ? 'Senior Profile' : 'Resume') : 
                'Resume'
              }
            </div>
          </div>
        </Link>
        
        <Link href="/chat" className="group p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)'}}>
            <MessageCircle className="h-7 w-7" style={{color: '#38bdf8'}} />
          </div>
          <div className="text-center">
            <div className="font-semibold mb-1" style={{color: colors.text}}>
              {resumeData?.experience?.[0]?.title?.toLowerCase().includes('manager') || resumeData?.experience?.[0]?.title?.toLowerCase().includes('lead') ? 'Leadership' : 'AI'} Mentor
            </div>
            <div className="text-sm opacity-70" style={{color: colors.text}}>
              {resumeData?.experience?.[0]?.title?.toLowerCase().includes('developer') || resumeData?.experience?.[0]?.title?.toLowerCase().includes('engineer') ? 'Tech Chat' : 'Chat'}
            </div>
          </div>
        </Link>
        
        <Link href="/interview" className="group p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
            <Brain className="h-7 w-7" style={{color: theme === 'dark' ? '#c4b5fd' : '#6b7280'}} />
          </div>
          <div className="text-center">
            <div className="font-semibold mb-1" style={{color: colors.text}}>
              {resumeData?.experience?.[0]?.title?.toLowerCase().includes('manager') || resumeData?.experience?.[0]?.title?.toLowerCase().includes('lead') ? 'Executive' : 
               resumeData?.experience?.[0]?.title?.toLowerCase().includes('senior') || (resumeData?.experience?.length || 0) >= 3 ? 'Advanced' : 'Mock'
              }
            </div>
            <div className="text-sm opacity-70" style={{color: colors.text}}>
              Interview
            </div>
          </div>
        </Link>
        
        <Link href="/skills" className="group p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
            <Target className="h-7 w-7" style={{color: theme === 'dark' ? '#c4b5fd' : '#6b7280'}} />
          </div>
          <div className="text-center">
            <div className="font-semibold mb-1" style={{color: colors.text}}>
              {resumeData?.experience?.[0]?.title?.toLowerCase().includes('manager') || resumeData?.experience?.[0]?.title?.toLowerCase().includes('lead') ? 'Leadership' : 'Skills'}
            </div>
            <div className="text-sm opacity-70" style={{color: colors.text}}>
              {resumeData?.experience?.[0]?.title?.toLowerCase().includes('data') || resumeData?.experience?.[0]?.title?.toLowerCase().includes('analyst') ? 'Analytics' : 'Analysis'}
            </div>
          </div>
        </Link>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Progress */}
        <div className="lg:col-span-2 p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{color: colors.text}}>
              Skill Development Progress
            </h2>
            <p className="opacity-70" style={{color: colors.text}}>
              {resumeData ? 
                `Based on your ${resumeData.experience?.length || 0} professional role${(resumeData.experience?.length || 0) > 1 ? 's' : ''}` :
                hasResume ? 'Based on your uploaded resume data' : 'Your progress towards your dream career'
              }
            </p>
          </div>
          
          {resumeData || hasResume ? (
            <>
              {/* Progress Hero Card - personalized */}
          <div className="rounded-3xl p-8 mb-8" style={{background: theme === 'dark' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(56, 189, 248, 0.4))' : 'linear-gradient(135deg, rgba(221, 214, 254, 0.6), rgba(186, 230, 253, 0.6))', color: theme === 'dark' ? '#f1f5f9' : '#1e293b', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)'}`}}>
            <div className="flex items-center justify-between">
              <div>
                    <h3 className="text-xl mb-2 text-balance" style={{fontWeight: 600, letterSpacing: '-0.02em'}}>
                      {(() => {
                        if (!resumeData && hasResume) {
                          return `Great! Your resume data is being analyzed`;
                        }
                        const experienceCount = resumeData?.experience?.length || 0;
                        const currentRole = resumeData?.experience?.[0]?.title || '';
                        
                        if (experienceCount >= 5) {
                          return `Excellent! Your senior-level skills are impressive`;
                        } else if (experienceCount >= 3) {
                          return `Great progress! Your mid-level expertise shows`;
                        } else {
                          return `Nice start! Building strong foundation skills`;
                        }
                      })()}
                    </h3>
                    <p className="opacity-80" style={{fontWeight: 400}}>
                      {resumeData?.experience?.[0]?.title ? `Growing in ${resumeData.experience[0].title}` : 
                       hasResume ? 'Building your professional profile' : 'Keep developing your expertise'}
                    </p>
              </div>
              <div className="relative w-20 h-20">
                    {/* Circular progress - based on experience level */}
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
                  <circle cx="40" cy="40" r="30" stroke="white" strokeWidth="6" fill="none" 
                              strokeDasharray="188" strokeDashoffset={(() => {
                                if (!resumeData && hasResume) return 188 - (188 * 65 / 100); // Default 65% for uploaded resume
                                const exp = resumeData?.experience?.length || 0;
                                const progress = Math.min(Math.max(exp * 20 + 20, 20), 90);
                                return 188 - (188 * progress / 100);
                              })()} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {(() => {
                          if (!resumeData && hasResume) return '65'; // Default for uploaded resume
                          const exp = resumeData?.experience?.length || 0;
                          return Math.min(Math.max(exp * 20 + 20, 20), 90);
                        })()}%
                      </span>
                </div>
              </div>
            </div>
          </div>
          
              {/* Individual Skills - from resume */}
          <div className="space-y-6">
                {(() => {
                  // Get skills from resume or create role-based skills
                  const currentRole = resumeData?.experience?.[0]?.title?.toLowerCase() || '';
                  const experienceLevel = resumeData?.experience?.length || 2; // Default to 2 if just uploaded
                  
                  let skillsToShow = [];
                  
                  // If no structured data but resume uploaded, show generic professional skills
                  if (!resumeData && hasResume) {
                    skillsToShow = [
                      {name: 'Communication', percentage: 75, color: '#059669'},
                      {name: 'Problem Solving', percentage: 70, color: '#0284c7'},
                      {name: 'Professional Skills', percentage: 68, color: '#0284c7'}
                    ];
                  }
                  // If user has skills in resume, use those
                  else if (resumeData?.skills && resumeData.skills.length > 0) {
                    // Take first few skills from resume
                    const resumeSkills = resumeData.skills.flatMap(cat => cat.items).slice(0, 3);
                    skillsToShow = resumeSkills.map(skill => ({
                      name: skill,
                      percentage: Math.floor(Math.random() * 30) + 60 + (experienceLevel * 5), // 60-95% based on experience
                      color: Math.floor(Math.random() * 30) + 60 + (experienceLevel * 5) >= 80 ? '#059669' : '#0284c7'
                    }));
                  } else {
                    // Generate role-based skills
                    if (currentRole.includes('manager') || currentRole.includes('lead')) {
                      skillsToShow = [
                        {name: 'Leadership', percentage: 75 + (experienceLevel * 3), color: '#059669'},
                        {name: 'Strategic Planning', percentage: 60 + (experienceLevel * 4), color: '#0284c7'},
                        {name: 'Team Management', percentage: 65 + (experienceLevel * 3), color: '#0284c7'}
                      ];
                    } else if (currentRole.includes('developer') || currentRole.includes('engineer')) {
                      skillsToShow = [
                        {name: 'Technical Skills', percentage: 80 + (experienceLevel * 2), color: '#059669'},
                        {name: 'Problem Solving', percentage: 75 + (experienceLevel * 3), color: '#059669'},
                        {name: 'System Design', percentage: 50 + (experienceLevel * 5), color: experienceLevel >= 3 ? '#0284c7' : '#dc2626'}
                      ];
                    } else if (currentRole.includes('analyst') || currentRole.includes('data')) {
                      skillsToShow = [
                        {name: 'Data Analysis', percentage: 85 + (experienceLevel * 2), color: '#059669'},
                        {name: 'Visualization', percentage: 70 + (experienceLevel * 3), color: '#0284c7'},
                        {name: 'Machine Learning', percentage: 40 + (experienceLevel * 7), color: experienceLevel >= 2 ? '#0284c7' : '#dc2626'}
                      ];
                    } else {
                      skillsToShow = [
                        {name: 'Communication', percentage: 70 + (experienceLevel * 4), color: '#059669'},
                        {name: 'Problem Solving', percentage: 65 + (experienceLevel * 4), color: '#0284c7'},
                        {name: 'Leadership', percentage: 45 + (experienceLevel * 6), color: experienceLevel >= 2 ? '#0284c7' : '#dc2626'}
                      ];
                    }
                  }
                  
                  return skillsToShow.slice(0, 3).map((skill, index) => (
                    <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                        <span className="font-semibold" style={{color: colors.text}}>{skill.name}</span>
                        <span className="text-sm font-bold" style={{color: skill.color}}>{Math.min(skill.percentage, 95)}%</span>
              </div>
              <div className="w-full rounded-full h-3" style={{background: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(203, 213, 225, 0.8)'}}>
                        <div className="h-3 rounded-full transition-all duration-700" style={{
                          width: `${Math.min(skill.percentage, 95)}%`, 
                          background: skill.color === '#059669' ? 
                            (theme === 'dark' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(167, 243, 208, 0.5)') :
                            skill.color === '#0284c7' ?
                            (theme === 'dark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(186, 230, 253, 0.5)') :
                            (theme === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(252, 165, 165, 0.5)')
                        }}></div>
              </div>
            </div>
                  ));
                })()}
              </div>
            </>
          ) : (
            // Fallback for users without resume
            <div className="text-center py-16">
              <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" style={{color: colors.text}} />
              <p className="text-lg font-medium mb-2" style={{color: colors.text}}>Upload Your Resume</p>
              <p className="opacity-70 mb-6" style={{color: colors.text}}>Get personalized skill progress tracking</p>
              <Link href="/ats" className="inline-block px-6 py-3 rounded-2xl font-semibold transition-all hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', color: theme === 'dark' ? '#c4b5fd' : '#8b5cf6', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)'}`}}>
                Upload Resume
              </Link>
            </div>
          )}
        </div>





        {/* Skill Gap Heatmap Preview */}
        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2" style={{color: colors.text}}>Skill Gap Analysis</h3>
            <p className="text-sm opacity-70" style={{color: colors.text}}>
              {resumeData ? 'Based on your resume and career progression' : 
               hasResume ? 'Analyzing your uploaded resume data' : 'Upload your resume for personalized insights'}
            </p>
          </div>
          
          {resumeData || hasResume ? (
            <div>
              {/* Current Skills */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-3 opacity-80" style={{color: colors.text}}>Your Current Skills</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {resumeData?.skills && resumeData.skills.length > 0 ? (
                    resumeData.skills.slice(0, 2).map((skillCategory, index) => (
                      skillCategory.items.slice(0, 2).map((skill, skillIndex) => (
                        <div key={`${index}-${skillIndex}`} className="p-3 rounded-xl shadow-sm flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(167, 243, 208, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(167, 243, 208, 0.2)'}`}}>
                          <span style={{color: theme === 'dark' ? '#a7f3d0' : '#059669'}} className="font-medium text-xs">{skill}</span>
                        </div>
                      ))
                    )).flat()
                  ) : (
                    <>
                      <div className="p-3 rounded-xl shadow-sm flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(167, 243, 208, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(167, 243, 208, 0.2)'}`}}>
                        <span style={{color: theme === 'dark' ? '#a7f3d0' : '#059669'}} className="font-medium text-xs">Communication</span>
                      </div>
                      <div className="p-3 rounded-xl shadow-sm flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(167, 243, 208, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(167, 243, 208, 0.2)'}`}}>
                        <span style={{color: theme === 'dark' ? '#a7f3d0' : '#059669'}} className="font-medium text-xs">Problem Solving</span>
                      </div>
                    </>
                  )}
                </div>
            </div>
              
              {/* Suggested Skills to Develop */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-3 opacity-80" style={{color: colors.text}}>Recommended Skills</h4>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    // Generate suggestions based on job title and experience
                    const currentRole = resumeData?.experience?.[0]?.title?.toLowerCase() || '';
                    let suggestions = [];
                    
                    // If no structured data but resume uploaded, show general professional skills
                    if (!resumeData && hasResume) {
                      suggestions = ['Leadership', 'Strategic Thinking', 'Digital Literacy', 'Project Management'];
                    }
                    
                    if (currentRole.includes('manager') || currentRole.includes('lead')) {
                      suggestions = ['Leadership', 'Strategic Planning', 'Team Management', 'Performance Management'];
                    } else if (currentRole.includes('developer') || currentRole.includes('engineer')) {
                      suggestions = ['System Design', 'Cloud Architecture', 'DevOps', 'Mentoring'];
                    } else if (currentRole.includes('analyst') || currentRole.includes('data')) {
                      suggestions = ['Machine Learning', 'Advanced Analytics', 'Data Visualization', 'Statistical Modeling'];
                    } else if (currentRole.includes('designer')) {
                      suggestions = ['User Research', 'Prototyping', 'Design Systems', 'Accessibility'];
                    } else if (currentRole.includes('marketing')) {
                      suggestions = ['Digital Marketing', 'SEO/SEM', 'Analytics', 'Content Strategy'];
                    } else if (currentRole.includes('sales')) {
                      suggestions = ['CRM Systems', 'Negotiation', 'Account Management', 'Sales Analytics'];
                    } else {
                      // Generic suggestions
                      suggestions = ['Leadership', 'Strategic Thinking', 'Digital Literacy', 'Project Management'];
                    }
                    
                    return suggestions.slice(0, 4).map((skill, index) => (
                      <div key={skill} className="p-3 rounded-xl shadow-sm flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(252, 165, 165, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(252, 165, 165, 0.2)'}`}}>
                        <span style={{color: theme === 'dark' ? '#fca5a5' : '#dc2626'}} className="font-medium text-xs">{skill}</span>
            </div>
                    ));
                  })()}
            </div>
            </div>
              
                            {/* Career Level Insights */}
              {(resumeData?.experience && resumeData.experience.length > 0) ? (
                <div className="p-3 rounded-xl mb-4" style={{background: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(219, 234, 254, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.3)'}`}}>
                  <p className="text-xs font-medium" style={{color: colors.text}}>
                    💡 Based on your {resumeData.experience.length} role{resumeData.experience.length > 1 ? 's' : ''} as {resumeData.experience[0].title}
                  </p>
                </div>
              ) : hasResume && (
                <div className="p-3 rounded-xl mb-4" style={{background: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(219, 234, 254, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.3)'}`}}>
                  <p className="text-xs font-medium" style={{color: colors.text}}>
                    💡 Analyzing your resume for personalized recommendations
                  </p>
            </div>
              )}
            </div>
          ) : (
            // Fallback for users without resume data
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(221, 214, 254, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`}}>
                <Upload className="h-8 w-8" style={{color: theme === 'dark' ? '#c4b5fd' : '#8b5cf6'}} />
            </div>
              <p className="text-sm font-medium mb-2" style={{color: colors.text}}>Upload Your Resume</p>
              <p className="text-xs opacity-70 mb-4" style={{color: colors.text}}>Get personalized skill recommendations</p>
              <Link href="/ats" className="inline-block px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', color: theme === 'dark' ? '#c4b5fd' : '#8b5cf6', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)'}`}}>
                Upload Resume
              </Link>
            </div>
          )}
          
                    {(resumeData || hasResume) && (
            <Link href="/skills" className="block w-full p-4 rounded-2xl font-semibold transition-all text-center shadow-lg hover:shadow-xl hover:opacity-90 mt-4" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', color: theme === 'dark' ? '#c4b5fd' : '#6b7280', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`}}>
            View Full Analysis
          </Link>
          )}
        </div>
      </div>
    </div>
  );
}

