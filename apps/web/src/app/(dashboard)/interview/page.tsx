// @author: fatima bashir
'use client';
import { Brain, Play, Clock, Award, Mic, Video } from "lucide-react";
import { useTheme } from '@/lib/ThemeContext';

export default function MockInterviewPage() {
  const { theme, colors } = useTheme();
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3" style={{color: colors.text}}>Interview Practice</h1>
        <p className="text-xl opacity-80" style={{color: colors.text}}>
          Practice interviews for any industry with AI-powered feedback and coaching
        </p>
      </div>

      {/* Interview Types */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="group p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
            <Brain className="h-8 w-8" style={{color: '#8b5cf6'}} />
          </div>
          <h3 className="text-xl font-semibold mb-3" style={{color: colors.text}}>Behavioral Interview</h3>
          <p className="mb-4 opacity-80" style={{color: colors.text}}>
            Leadership scenarios, problem-solving, and workplace situation questions
          </p>
          <div className="flex items-center justify-center gap-2 text-sm mb-4 opacity-60" style={{color: colors.text}}>
            <Clock className="h-4 w-4" />
            <span>30-45 minutes</span>
          </div>
          <button className="w-full p-3 rounded-2xl font-semibold transition-all shadow-lg hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', color: theme === 'dark' ? '#c4b5fd' : '#6b7280', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`}}>
            Start Behavioral Interview
          </button>
        </div>

        <div className="group p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform" style={{background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)'}}>
            <Mic className="h-8 w-8" style={{color: '#38bdf8'}} />
          </div>
          <h3 className="text-xl font-semibold mb-3" style={{color: colors.text}}>Communication Skills</h3>
          <p className="mb-4 opacity-80" style={{color: colors.text}}>
            Presentation skills, active listening, and professional communication assessment
          </p>
          <div className="flex items-center justify-center gap-2 text-sm mb-4 opacity-60" style={{color: colors.text}}>
            <Clock className="h-4 w-4" />
            <span>30-45 minutes</span>
          </div>
          <button className="w-full p-3 rounded-2xl font-semibold transition-all shadow-lg hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', color: theme === 'dark' ? '#c4b5fd' : '#6b7280', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`}}>
            Start Communication Assessment
          </button>
        </div>

        <div className="group p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform" style={{background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)'}}>
            <Video className="h-8 w-8" style={{color: '#22c55e'}} />
          </div>
          <h3 className="text-xl font-semibold mb-3" style={{color: colors.text}}>Video Interview</h3>
          <p className="mb-4 opacity-80" style={{color: colors.text}}>
            Professional presentation, communication skills, and remote interview practice
          </p>
          <div className="flex items-center justify-center gap-2 text-sm mb-4 opacity-60" style={{color: colors.text}}>
            <Clock className="h-4 w-4" />
            <span>45-60 minutes</span>
          </div>
          <button className="w-full p-3 rounded-2xl font-semibold transition-all shadow-lg hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', color: theme === 'dark' ? '#c4b5fd' : '#6b7280', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`}}>
            Start Video Interview
          </button>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
        <h2 className="text-2xl font-semibold mb-6" style={{color: colors.text}}>Recent Interview Sessions</h2>
        
        <div className="space-y-4">
          <div className="p-6 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(237, 233, 254, 0.8)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold" style={{color: colors.text}}>Leadership Assessment</h3>
                <p className="text-sm opacity-70" style={{color: colors.text}}>2 days ago • 45 minutes</p>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" style={{color: '#7c3aed'}} />
                <span className="text-xl font-bold" style={{color: '#7c3aed'}}>8.4/10</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
                <div className="font-semibold mb-1" style={{color: '#059669'}}>Strengths</div>
                <ul className="text-sm opacity-80 space-y-1" style={{color: colors.text}}>
                                  <li>• Clear leadership approach</li>
                <li>• Strong team dynamics</li>
                <li>• Effective communication</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                <div className="font-semibold mb-1 text-red-500">Areas to Improve</div>
                <ul className="text-sm opacity-80 space-y-1" style={{color: colors.text}}>
                                  <li>• Team conflict resolution</li>
                <li>• Performance feedback delivery</li>
                <li>• Strategic decision making</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(240, 249, 255, 0.8)', border: `1px solid ${colors.cardBorder}`}}>
              <div className="font-medium mb-2" style={{color: colors.text}}>AI Feedback</div>
              <p className="text-sm italic opacity-80" style={{color: colors.text}}>
                "Excellent leadership demonstration! You showed strong understanding of team dynamics. 
                Focus on developing conflict resolution skills and strategic decision-making frameworks."
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(220, 252, 231, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold" style={{color: colors.text}}>Communication Assessment</h3>
                <p className="text-sm opacity-70" style={{color: colors.text}}>1 week ago • 35 minutes</p>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" style={{color: '#059669'}} />
                <span className="text-xl font-bold" style={{color: '#059669'}}>9.1/10</span>
              </div>
            </div>
            
            <div className="p-4 rounded-xl" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(220, 252, 231, 0.9)', border: '1px solid rgba(34, 197, 94, 0.4)'}}>
              <div className="font-medium mb-2" style={{color: '#059669'}}>Excellent Performance</div>
              <p className="text-sm opacity-80" style={{color: colors.text}}>
                Strong presentation skills, compelling examples, and clear professional communication.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="p-8 rounded-3xl shadow-lg" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
        <h2 className="text-2xl font-semibold mb-6" style={{color: colors.text}}>Start New Interview</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl shadow-lg flex flex-col h-full" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
            <h3 className="text-xl font-semibold mb-4" style={{color: colors.text}}>Quick Practice</h3>
            <p className="mb-8 flex-grow leading-relaxed opacity-80" style={{color: colors.text}}>
              5-10 minute focused practice sessions on specific interview topics and core skills
            </p>
            <button className="w-full p-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', color: theme === 'dark' ? '#c4b5fd' : '#6b7280', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`}}>
              Start Quick Session
            </button>
          </div>
          
          <div className="p-8 rounded-3xl shadow-lg flex flex-col h-full" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
            <h3 className="text-xl font-semibold mb-4" style={{color: colors.text}}>Full Simulation</h3>
            <p className="mb-8 flex-grow leading-relaxed opacity-80" style={{color: colors.text}}>
              Complete interview experience with detailed scoring and comprehensive feedback
            </p>
            <button className="w-full p-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl hover:opacity-90" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', color: theme === 'dark' ? '#c4b5fd' : '#6b7280', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`}}>
              Start Full Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
