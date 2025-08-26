// @author: fatima bashir
'use client';
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Play, Brain, Target, BookOpen, MessageCircle, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'

export default function DemoPage() {
  const { theme, toggleTheme, colors } = useTheme();
  
  return (
    <div className="min-h-screen" style={{background: theme === 'dark' ? '#0f172a' : colors.background}}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b" style={{background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.3)', borderColor: colors.cardBorder}}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
                <Brain className="w-5 h-5" style={{color: '#8b5cf6'}} />
              </div>
              <span className="text-xl font-bold" style={{color: colors.text}}>Mentorly</span>
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
                style={{
                  background: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(147, 197, 253, 0.15)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(147, 197, 253, 0.2)'}`
                }}
              >
                {theme === 'dark' ? (
                  <Sun size={20} style={{color: '#fbbf24'}} />
                ) : (
                  <Moon size={20} style={{color: '#8b5cf6'}} />
                )}
              </button>
              <Button size="sm" asChild className="border-0 shadow-lg rounded-xl text-white hover:opacity-90 transition-opacity" style={{background: '#8b5cf6'}}>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-32 pb-16">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mb-8 border" style={{background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)'}}>
            <Play className="w-4 h-4 mr-2" />
            Interactive Demo
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8" style={{color: '#f1f5f9'}}>
            See Mentorly in Action
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-80" style={{color: '#f1f5f9'}}>
            Explore our AI-powered career mentorship platform with this interactive preview showcasing real features.
          </p>
        </div>

        {/* Demo Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Skill Gap Analysis Demo */}
          <div className="p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: '#8b5cf6'}}>
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold" style={{color: colors.text}}>Skill Gap Analysis</h3>
                <p className="text-sm opacity-70" style={{color: colors.text}}>Upload your resume and see how your skills match your target role</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl" style={{background: 'rgba(51, 65, 85, 0.3)', border: '1px solid rgba(51, 65, 85, 0.5)'}}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold" style={{color: '#f1f5f9'}}>Current: Sales Associate</span>
                  <div className="px-3 py-1 text-xs font-bold rounded-full" style={{background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.3)'}}>3 years</div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold" style={{color: '#f1f5f9'}}>Target: Sales Manager</span>
                  <div className="px-3 py-1 text-xs font-bold rounded-full" style={{background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)'}}>Goal</div>
                </div>
                
                {/* Skills Progress */}
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold" style={{color: '#f1f5f9'}}>React/Frontend</span>
                      <span className="font-bold" style={{color: '#22c55e'}}>85%</span>
                    </div>
                    <div className="w-full rounded-full h-3" style={{background: 'rgba(51, 65, 85, 0.5)'}}>
                      <div className="h-3 rounded-full" style={{width: '85%', background: '#22c55e'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold" style={{color: '#f1f5f9'}}>Node.js/Backend</span>
                      <span className="font-bold" style={{color: '#38bdf8'}}>45%</span>
                    </div>
                    <div className="w-full rounded-full h-3" style={{background: 'rgba(51, 65, 85, 0.5)'}}>
                      <div className="h-3 rounded-full" style={{width: '45%', background: '#38bdf8'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold" style={{color: '#f1f5f9'}}>System Design</span>
                      <span className="font-bold text-red-500">25%</span>
                    </div>
                    <div className="w-full rounded-full h-3" style={{background: 'rgba(51, 65, 85, 0.5)'}}>
                      <div className="bg-gradient-to-r from-red-400 to-red-500 h-3 rounded-full" style={{width: '25%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/skills" className="block w-full p-4 rounded-2xl text-white font-semibold transition-all shadow-lg hover:shadow-xl hover:opacity-90 text-center" style={{background: '#8b5cf6'}}>
                <Play className="mr-2 h-5 w-5 inline" />
                Try Skill Analysis
              </Link>
            </div>
          </div>

          {/* Learning Plan Demo */}
          <div className="p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: '#22c55e'}}>
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold" style={{color: colors.text}}>Personalized Learning Plan</h3>
                <p className="text-sm opacity-70" style={{color: colors.text}}>AI-generated 4-week curriculum tailored to your goals</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 rounded-2xl" style={{background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
                <span className="font-semibold" style={{color: '#f1f5f9'}}>Week 1: Node.js Fundamentals</span>
                <div className="px-3 py-1 text-white text-xs font-bold rounded-full" style={{background: '#22c55e'}}>Completed</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl" style={{background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)'}}>
                <span className="font-semibold" style={{color: '#f1f5f9'}}>Week 2: Express & APIs</span>
                <div className="px-3 py-1 text-white text-xs font-bold rounded-full" style={{background: '#38bdf8'}}>Current</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl" style={{background: 'rgba(51, 65, 85, 0.3)', border: '1px solid rgba(51, 65, 85, 0.5)'}}>
                <span className="font-semibold opacity-60" style={{color: '#f1f5f9'}}>Week 3: Database Integration</span>
                <div className="px-3 py-1 text-xs font-bold rounded-full opacity-60" style={{background: 'rgba(148, 163, 184, 0.3)', color: '#f1f5f9'}}>Upcoming</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl" style={{background: 'rgba(51, 65, 85, 0.3)', border: '1px solid rgba(51, 65, 85, 0.5)'}}>
                <span className="font-semibold opacity-60" style={{color: '#f1f5f9'}}>Week 4: Full Stack Project</span>
                <div className="px-3 py-1 text-xs font-bold rounded-full opacity-60" style={{background: 'rgba(148, 163, 184, 0.3)', color: '#f1f5f9'}}>Upcoming</div>
              </div>
            </div>
            <Link href="/learning" className="block w-full p-4 rounded-2xl text-white font-semibold transition-all shadow-lg hover:shadow-xl hover:opacity-90 text-center" style={{background: '#8b5cf6'}}>
              <Play className="mr-2 h-5 w-5 inline" />
              Explore Learning Plan
            </Link>
          </div>

          {/* Mock Interview Demo */}
          <div className="p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: '#8b5cf6'}}>
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold" style={{color: colors.text}}>AI Mock Interviews</h3>
                <p className="text-sm opacity-70" style={{color: colors.text}}>Practice with AI-powered behavioral and technical interviews</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4 p-6 rounded-2xl" style={{background: 'rgba(51, 65, 85, 0.3)', border: '1px solid rgba(51, 65, 85, 0.5)'}}>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold" style={{color: '#f1f5f9'}}>Last Session: Technical</span>
                    <div className="px-3 py-1 text-white text-xs font-bold rounded-full" style={{background: '#8b5cf6'}}>Score: 8.4/10</div>
                  </div>
                  <p className="text-sm italic opacity-80" style={{color: '#f1f5f9'}}>
                    "Great problem-solving approach! Work on optimizing time complexity."
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-xl" style={{background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)'}}>
                    <div className="font-bold" style={{color: '#22c55e'}}>Strong</div>
                    <div className="text-xs opacity-70" style={{color: '#f1f5f9'}}>Code Structure</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                    <div className="font-bold text-red-500">Improve</div>
                    <div className="text-xs opacity-70" style={{color: '#f1f5f9'}}>Optimization</div>
                  </div>
                </div>
              </div>
              <Link href="/interview" className="block w-full p-4 rounded-2xl text-white font-semibold transition-all shadow-lg hover:shadow-xl hover:opacity-90 text-center" style={{background: '#8b5cf6'}}>
                <Play className="mr-2 h-5 w-5 inline" />
                Start Mock Interview
              </Link>
            </div>
          </div>

          {/* AI Mentor Chat Demo */}
          <div className="p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: '#38bdf8'}}>
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold" style={{color: colors.text}}>AI Career Mentor</h3>
                <p className="text-sm opacity-70" style={{color: colors.text}}>Get personalized career advice and guidance 24/7</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4 p-6 rounded-2xl" style={{background: 'rgba(51, 65, 85, 0.3)', border: '1px solid rgba(51, 65, 85, 0.5)'}}>
                <div className="shadow-sm rounded-2xl p-4 ml-0 mr-12" style={{background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(51, 65, 85, 0.7)'}}>
                  <p className="text-sm" style={{color: '#f1f5f9'}}>
                    "How should I prepare for a senior developer interview?"
                  </p>
                </div>
                <div className="rounded-2xl p-4 ml-12 mr-0" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                  <p className="text-sm" style={{color: '#f1f5f9'}}>
                    Based on your profile, I recommend focusing on system design and leadership scenarios. Here's a personalized prep plan...
                  </p>
                </div>
              </div>
              <Link href="/chat" className="block w-full p-4 rounded-2xl text-white font-semibold transition-all shadow-lg hover:shadow-xl hover:opacity-90 text-center" style={{background: '#8b5cf6'}}>
                <MessageCircle className="mr-2 h-5 w-5 inline" />
                Chat with AI Mentor
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="max-w-3xl mx-auto p-12 rounded-3xl shadow-xl" style={{background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(51, 65, 85, 0.5)'}}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: '#f1f5f9'}}>
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl mb-10 leading-relaxed opacity-80" style={{color: '#f1f5f9'}}>
              Join thousands of professionals who are accelerating their career growth with Mentorly
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" asChild className="px-8 py-4 text-lg rounded-2xl shadow-xl border-0 text-white hover:opacity-90 transition-opacity">
                <Link href="/dashboard" style={{background: '#8b5cf6'}}>
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Link href="/" className="inline-block px-8 py-4 text-lg rounded-2xl border-2 hover:opacity-80 transition-opacity font-semibold" style={{borderColor: '#38bdf8', color: '#38bdf8', background: 'transparent'}}>
                Learn More
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm opacity-70" style={{color: '#f1f5f9'}}>
              <div className="flex items-center">
                <span className="w-1 h-1 rounded-full mr-2" style={{background: '#22c55e'}}></span>
                No credit card required
              </div>
              <div className="flex items-center">
                <span className="w-1 h-1 rounded-full mr-2" style={{background: '#22c55e'}}></span>
                14-day free trial
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

