// @author: fatima bashir
'use client';
import Link from "next/link";
import { useTheme } from '@/lib/ThemeContext';
import { 
  BookOpen, 
  Brain, 
  Calendar, 
  FileText, 
  Target, 
  TrendingUp,
  MessageCircle,
  Upload
} from "lucide-react";

export default function DashboardPage() {
  const { theme, colors } = useTheme();
  // Authentication temporarily disabled - showing demo data

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3 text-balance" style={{color: colors.text, fontWeight: 700, letterSpacing: '-0.025em'}}>Welcome back!</h1>
        <p className="text-xl opacity-80 text-pretty" style={{color: colors.text, fontWeight: 400}}>
          Continue your career growth journey with personalized AI guidance.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Link href="/ats" className="group p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)'}}>
            <Upload className="h-7 w-7" style={{color: '#22c55e'}} />
          </div>
          <div className="text-center">
            <div className="font-semibold mb-1" style={{color: colors.text}}>Upload</div>
            <div className="text-sm opacity-70" style={{color: colors.text}}>Resume</div>
          </div>
        </Link>
        
        <Link href="/chat" className="group p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)'}}>
            <MessageCircle className="h-7 w-7" style={{color: '#38bdf8'}} />
          </div>
          <div className="text-center">
            <div className="font-semibold mb-1" style={{color: colors.text}}>AI Mentor</div>
            <div className="text-sm opacity-70" style={{color: colors.text}}>Chat</div>
          </div>
        </Link>
        
        <Link href="/interview" className="group p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
            <Brain className="h-7 w-7" style={{color: theme === 'dark' ? '#c4b5fd' : '#6b7280'}} />
          </div>
          <div className="text-center">
            <div className="font-semibold mb-1" style={{color: colors.text}}>Mock</div>
            <div className="text-sm opacity-70" style={{color: colors.text}}>Interview</div>
          </div>
        </Link>
        
        <Link href="/skills" className="group p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
            <Target className="h-7 w-7" style={{color: theme === 'dark' ? '#c4b5fd' : '#6b7280'}} />
          </div>
          <div className="text-center">
            <div className="font-semibold mb-1" style={{color: colors.text}}>Skills</div>
            <div className="text-sm opacity-70" style={{color: colors.text}}>Analysis</div>
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
              Your progress towards your dream career
            </p>
          </div>
          
          {/* Progress Hero Card - like the mobile design */}
          <div className="rounded-3xl p-8 mb-8" style={{background: theme === 'dark' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(56, 189, 248, 0.4))' : 'linear-gradient(135deg, rgba(221, 214, 254, 0.6), rgba(186, 230, 253, 0.6))', color: theme === 'dark' ? '#f1f5f9' : '#1e293b', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)'}`}}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl mb-2 text-balance" style={{fontWeight: 600, letterSpacing: '-0.02em'}}>Excellent! Your today's plan is almost done</h3>
                <p className="opacity-80" style={{fontWeight: 400}}>Keep up the great work</p>
              </div>
              <div className="relative w-20 h-20">
                {/* Circular progress */}
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
                  <circle cx="40" cy="40" r="30" stroke="white" strokeWidth="6" fill="none" 
                          strokeDasharray="188" strokeDashoffset="47" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">75%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Individual Skills */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{color: colors.text}}>Communication</span>
                <span className="text-sm font-bold" style={{color: '#059669'}}>85%</span>
              </div>
              <div className="w-full rounded-full h-3" style={{background: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(203, 213, 225, 0.8)'}}>
                <div className="h-3 rounded-full transition-all duration-700" style={{width: '85%', background: theme === 'dark' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(167, 243, 208, 0.5)'}}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{color: colors.text}}>Leadership</span>
                <span className="text-sm font-bold" style={{color: '#0284c7'}}>75%</span>
              </div>
              <div className="w-full rounded-full h-3" style={{background: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(203, 213, 225, 0.8)'}}>
                <div className="h-3 rounded-full transition-all duration-700" style={{width: '75%', background: theme === 'dark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(186, 230, 253, 0.5)'}}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{color: colors.text}}>Strategic Planning</span>
                <span className="text-sm font-bold" style={{color: '#dc2626'}}>40%</span>
              </div>
              <div className="w-full rounded-full h-3" style={{background: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(203, 213, 225, 0.8)'}}>
                <div className="h-3 rounded-full transition-all duration-700" style={{width: '40%', background: theme === 'dark' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(252, 165, 165, 0.5)'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Plan */}
        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-1" style={{color: colors.text}}>This Week's Plan</h3>
            <p className="text-sm opacity-70" style={{color: colors.text}}>Week 2 of 4</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
              <div className="w-3 h-3 rounded-full" style={{background: 'rgba(167, 243, 208, 0.6)'}}></div>
              <div className="flex-1">
                <p className="font-semibold" style={{color: colors.text}}>Leadership Communication Skills</p>
                <p className="text-sm opacity-70" style={{color: colors.text}}>Completed</p>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background: 'rgba(167, 243, 208, 0.6)'}}>
                <span className="text-gray-600 text-xs font-bold">✓</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(219, 234, 254, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)'}}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{background: 'rgba(186, 230, 253, 0.6)'}}></div>
              <div className="flex-1">
                <p className="font-semibold" style={{color: colors.text}}>Team Management Workshop</p>
                <p className="text-sm opacity-70" style={{color: colors.text}}>In Progress</p>
              </div>
              <div className="text-sm font-bold" style={{color: '#0284c7'}}>60%</div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(241, 245, 249, 0.8)', border: `1px solid ${colors.cardBorder}`}}>
              <div className="w-3 h-3 rounded-full" style={{background: 'rgba(148, 163, 184, 0.5)'}}></div>
              <div className="flex-1">
                <p className="font-semibold opacity-60" style={{color: colors.text}}>Performance Management</p>
                <p className="text-sm opacity-50" style={{color: colors.text}}>Upcoming</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <h3 className="text-xl font-bold mb-6" style={{color: colors.text}}>Recent Activity</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start p-4 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
              <div>
                <p className="font-semibold" style={{color: colors.text}}>Completed communication training</p>
                <p className="text-sm opacity-70" style={{color: colors.text}}>2 hours ago</p>
              </div>
              <div className="px-3 py-1 text-gray-600 text-xs font-bold rounded-full" style={{background: 'rgba(167, 243, 208, 0.6)'}}>+15 XP</div>
            </div>
            <div className="flex justify-between items-start p-4 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(219, 234, 254, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)'}}>
              <div>
                <p className="font-semibold" style={{color: colors.text}}>Leadership assessment</p>
                <p className="text-sm opacity-70" style={{color: colors.text}}>1 day ago</p>
              </div>
              <div className="px-3 py-1 text-gray-600 text-xs font-bold rounded-full" style={{background: 'rgba(186, 230, 253, 0.6)'}}>Score: 9.1</div>
            </div>
            <div className="flex justify-between items-start p-4 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(241, 245, 249, 0.8)', border: `1px solid ${colors.cardBorder}`}}>
              <div>
                <p className="font-semibold" style={{color: colors.text}}>Profile updated</p>
                <p className="text-sm opacity-70" style={{color: colors.text}}>3 days ago</p>
              </div>
              <div className="px-3 py-1 text-xs font-bold rounded-full" style={{background: 'rgba(148, 163, 184, 0.3)', color: colors.text}}>Analyzed</div>
            </div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <h3 className="text-xl font-bold mb-6" style={{color: colors.text}}>Upcoming Sessions</h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border-l-4" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(221, 214, 254, 0.2)', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.3)'}`, borderLeftColor: theme === 'dark' ? '#8b5cf6' : '#a855f7'}}>
              <p className="font-semibold" style={{color: colors.text}}>Mock Technical Interview</p>
              <p className="text-sm opacity-70" style={{color: colors.text}}>Tomorrow, 2:00 PM</p>
            </div>
            <div className="p-4 rounded-2xl border-l-4" style={{background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderLeftColor: '#22c55e'}}>
              <p className="font-semibold" style={{color: colors.text}}>Behavioral Practice</p>
              <p className="text-sm opacity-70" style={{color: colors.text}}>Friday, 10:00 AM</p>
            </div>
            <Link href="/interview" className="block w-full p-4 rounded-2xl font-semibold transition-all text-center shadow-lg hover:shadow-xl hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', color: theme === 'dark' ? '#c4b5fd' : '#6b7280', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`}}>
              Schedule New Session
            </Link>
          </div>
        </div>

        {/* Skill Gap Heatmap Preview */}
        <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2" style={{color: colors.text}}>Skill Gap Analysis</h3>
            <p className="text-sm opacity-70" style={{color: colors.text}}>
              Based on your career goals and industry insights
            </p>
          </div>
          
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="aspect-square rounded-2xl shadow-lg flex items-center justify-center" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(167, 243, 208, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(167, 243, 208, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#a7f3d0' : '#6b7280'}} className="font-medium text-xs">Communication</span>
            </div>
            <div className="aspect-square rounded-2xl shadow-lg flex items-center justify-center" style={{background: theme === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(186, 230, 253, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(186, 230, 253, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#bae6fd' : '#6b7280'}} className="font-medium text-xs">Leadership</span>
            </div>
            <div className="aspect-square rounded-2xl shadow-lg flex items-center justify-center" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(252, 165, 165, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(252, 165, 165, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#fca5a5' : '#6b7280'}} className="font-medium text-xs">Strategy</span>
            </div>
            <div className="aspect-square rounded-2xl shadow-lg flex items-center justify-center" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(167, 243, 208, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(167, 243, 208, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#a7f3d0' : '#6b7280'}} className="font-medium text-xs">Teamwork</span>
            </div>
            <div className="aspect-square rounded-2xl shadow-lg flex items-center justify-center" style={{background: theme === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(186, 230, 253, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(186, 230, 253, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#bae6fd' : '#6b7280'}} className="font-medium text-xs">Planning</span>
            </div>
            <div className="aspect-square rounded-2xl shadow-lg flex items-center justify-center" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(167, 243, 208, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(167, 243, 208, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#a7f3d0' : '#6b7280'}} className="font-medium text-xs">Analytics</span>
            </div>
            <div className="aspect-square rounded-2xl shadow-lg flex items-center justify-center" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(252, 165, 165, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(252, 165, 165, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#fca5a5' : '#6b7280'}} className="font-medium text-xs">Innovation</span>
            </div>
            <div className="aspect-square rounded-2xl shadow-lg flex items-center justify-center" style={{background: theme === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(186, 230, 253, 0.3)', border: `1px solid ${theme === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(186, 230, 253, 0.2)'}`}}>
              <span style={{color: theme === 'dark' ? '#bae6fd' : '#6b7280'}} className="font-medium text-xs">Networking</span>
            </div>
          </div>
          <Link href="/skills" className="block w-full p-4 rounded-2xl font-semibold transition-all text-center shadow-lg hover:shadow-xl hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', color: theme === 'dark' ? '#c4b5fd' : '#6b7280', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`}}>
            View Full Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}

