// @author: fatima bashir
'use client';
import Link from "next/link";
import { useTheme } from '@/lib/ThemeContext';
import { Target, TrendingUp, Brain, ChevronRight } from "lucide-react";

export default function SkillAnalysisPage() {
  const { theme, colors } = useTheme();
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3" style={{color: colors.text}}>Skill Gap Analysis</h1>
        <p className="text-xl opacity-80" style={{color: colors.text}}>
          Comprehensive analysis of your current skills vs. target role requirements
        </p>
      </div>

      {/* Current vs Target Role */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(248, 250, 252, 0.8)', border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)'}`}}>
              <Target className="h-5 w-5" style={{color: theme === 'dark' ? '#cbd5e1' : '#64748b'}} />
            </div>
            <div>
              <h3 className="text-xl font-semibold" style={{color: colors.text}}>Current Profile</h3>
              <p className="text-sm opacity-70" style={{color: colors.text}}>Your current skill set</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{color: colors.text}}>Role</span>
              <span style={{color: '#38bdf8'}}>Marketing Coordinator</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{color: colors.text}}>Experience</span>
              <span className="opacity-70" style={{color: colors.text}}>3 years</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{color: colors.text}}>Industry</span>
              <span className="opacity-70" style={{color: colors.text}}>Marketing/Media</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: 'transparent', border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`}}>
              <TrendingUp className="h-5 w-5" style={{color: theme === 'dark' ? '#4ade80' : '#22c55e'}} />
            </div>
            <div>
              <h3 className="text-xl font-semibold" style={{color: colors.text}}>Target Role</h3>
              <p className="text-sm opacity-70" style={{color: colors.text}}>Where you want to be</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{color: colors.text}}>Role</span>
              <span style={{color: '#22c55e'}}>Senior Full Stack Engineer</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{color: colors.text}}>Timeline</span>
              <span className="opacity-70" style={{color: colors.text}}>6-12 months</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{color: colors.text}}>Salary Target</span>
              <span className="opacity-70" style={{color: colors.text}}>$120k - $150k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Heatmap */}
              <div className="p-8 rounded-3xl shadow-lg" style={{background: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
        <h2 className="text-2xl font-semibold mb-6" style={{color: colors.text}}>Skill Gap Heatmap</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Communication Skills */}
          <div className="space-y-4">
            <h4 className="font-medium text-center" style={{color: colors.text}}>Communication</h4>
            <div className="rounded-2xl p-4 h-16 flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(167, 243, 208, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(167, 243, 208, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#a7f3d0' : '#6b7280'}} className="font-medium text-sm">Presentation</span>
            </div>
            <div className="rounded-2xl p-4 h-16 flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(167, 243, 208, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(167, 243, 208, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#a7f3d0' : '#6b7280'}} className="font-medium text-sm">Writing</span>
            </div>
          </div>
          
          {/* Leadership Skills */}
          <div className="space-y-4">
            <h4 className="font-medium text-center" style={{color: colors.text}}>Leadership</h4>
            <div className="rounded-2xl p-4 h-16 flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(186, 230, 253, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(186, 230, 253, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#bae6fd' : '#6b7280'}} className="font-medium text-sm">Management</span>
            </div>
            <div className="rounded-2xl p-4 h-16 flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(252, 165, 165, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(252, 165, 165, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#fca5a5' : '#6b7280'}} className="font-medium text-sm">Coaching</span>
            </div>
          </div>
          
          {/* Strategy Skills */}
          <div className="space-y-4">
            <h4 className="font-medium text-center" style={{color: colors.text}}>Strategy</h4>
            <div className="rounded-2xl p-4 h-16 flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(148, 163, 184, 0.08)' : 'rgba(241, 245, 249, 0.8)', border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.4)'}`}}>
              <span style={{color: theme === 'dark' ? '#cbd5e1' : '#64748b'}} className="font-medium text-sm">Planning</span>
            </div>
            <div className="rounded-2xl p-4 h-16 flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(252, 165, 165, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(252, 165, 165, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#fca5a5' : '#6b7280'}} className="font-medium text-sm">Analytics</span>
            </div>
          </div>
          
          {/* Teamwork Skills */}
          <div className="space-y-4">
            <h4 className="font-medium text-center" style={{color: colors.text}}>Teamwork</h4>
            <div className="rounded-2xl p-4 h-16 flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(252, 165, 165, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(252, 165, 165, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#fca5a5' : '#6b7280'}} className="font-medium text-sm">Innovation</span>
            </div>
            <div className="rounded-2xl p-4 h-16 flex items-center justify-center text-center" style={{background: theme === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(186, 230, 253, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(186, 230, 253, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#bae6fd' : '#6b7280'}} className="font-medium text-sm">Networking</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(167, 243, 208, 0.4)'}}></div>
            <span style={{color: colors.text}}>Strong (80-100%)</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded" style={{background: theme === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(186, 230, 253, 0.4)'}}></div>
            <span style={{color: colors.text}}>Developing (40-79%)</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(252, 165, 165, 0.4)'}}></div>
            <span style={{color: colors.text}}>Need Focus (&lt;40%)</span>
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <h3 className="text-xl font-semibold mb-4" style={{color: colors.text}}>Priority Skills to Develop</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
              <span className="font-medium" style={{color: colors.text}}>Strategic Planning</span>
              <ChevronRight className="h-4 w-4" style={{color: colors.text}} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
              <span className="font-medium" style={{color: colors.text}}>Team Management</span>
              <ChevronRight className="h-4 w-4" style={{color: colors.text}} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
              <span className="font-medium" style={{color: colors.text}}>Project Coordination</span>
              <ChevronRight className="h-4 w-4" style={{color: colors.text}} />
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <h3 className="text-xl font-semibold mb-4" style={{color: colors.text}}>Recommended Next Steps</h3>
          <div className="space-y-3">
            <Link href="/learning" className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(241, 245, 249, 0.8)', color: theme === 'dark' ? '#cbd5e1' : '#64748b', border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)'}`}}>
              <span className="font-medium">Start Learning Plan</span>
              <ChevronRight className="h-4 w-4" style={{color: theme === 'dark' ? '#cbd5e1' : '#64748b'}} />
            </Link>
            <Link href="/interview" className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(241, 245, 249, 0.8)', color: theme === 'dark' ? '#cbd5e1' : '#64748b', border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)'}`}}>
              <span className="font-medium">Practice Interviews</span>
              <ChevronRight className="h-4 w-4" style={{color: theme === 'dark' ? '#cbd5e1' : '#64748b'}} />
            </Link>
            <Link href="/chat" className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(241, 245, 249, 0.8)', color: theme === 'dark' ? '#cbd5e1' : '#64748b', border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(203, 213, 225, 0.6)'}`}}>
              <span className="font-medium">Chat with AI Mentor</span>
              <ChevronRight className="h-4 w-4" style={{color: theme === 'dark' ? '#cbd5e1' : '#64748b'}} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
