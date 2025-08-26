// @author: fatima bashir
'use client';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Brain, Target, TrendingUp, Users, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/lib/ThemeContext';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Get personalized skill gap analysis and career recommendations powered by advanced AI'
  },
  {
    icon: Target,
    title: 'Skill Gap Heatmap',
    description: 'Visualize your current skills vs. target role requirements with interactive heatmaps'
  },
  {
    icon: TrendingUp,
    title: 'Personalized Learning',
    description: '4-week structured learning plans with modules and hands-on projects'
  },
  {
    icon: Users,
    title: 'Mock Interviews',
    description: 'Practice behavioral and technical interviews with AI-powered feedback and scoring'
  }
]

export default function HomePage() {
  const { theme, toggleTheme, colors } = useTheme();
  
  return (
    <div className="min-h-screen" style={{background: theme === 'dark' ? '#0f172a' : colors.background}}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b" style={{background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.3)', borderColor: colors.cardBorder}}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
                <Brain className="w-6 h-6" style={{color: '#8b5cf6'}} />
              </div>
              <span className="text-xl font-bold" style={{color: colors.text}}>Mentorly</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mb-8 border" style={{background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.3)'}}>
              <span className="w-2 h-2 rounded-full mr-3 animate-pulse" style={{background: '#22c55e'}}></span>
              AI-Powered Career Mentorship
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight text-balance bg-gradient-to-r bg-clip-text text-transparent" style={{backgroundImage: `linear-gradient(to right, #8b5cf6, #38bdf8, #22c55e)`, fontWeight: 800, letterSpacing: '-0.02em'}}>
              Find Your Dream
              <br />
              Career Path
            </h1>
            
            <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-80 text-pretty" style={{color: colors.text, fontWeight: 400}}>
              Discover your ideal career path, develop essential skills, and achieve your professional goals with 
              personalized AI mentorship across all industries.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Link href="/sign-in" className="inline-block px-10 py-4 text-lg rounded-2xl border-2 hover:opacity-80 transition-opacity" style={{borderColor: colors.accent, color: colors.accent, background: 'transparent', fontWeight: 600}}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-2">
                      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance" style={{color: colors.text, fontWeight: 700, letterSpacing: '-0.025em'}}>
            For Every Career Journey
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-70 text-pretty" style={{color: colors.text, fontWeight: 400}}>
            From career discovery to skill development, we support professionals across all industries in achieving their goals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const iconColors = ['#8b5cf6', '#38bdf8', '#22c55e', '#8b5cf6'];
            return (
              <div 
                key={index} 
                className="group relative p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}
              >
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{background: `rgba(${iconColors[index] === '#8b5cf6' ? '139, 92, 246' : iconColors[index] === '#38bdf8' ? '56, 189, 248' : '34, 197, 94'}, 0.15)`, border: `1px solid rgba(${iconColors[index] === '#8b5cf6' ? '139, 92, 246' : iconColors[index] === '#38bdf8' ? '56, 189, 248' : '34, 197, 94'}, 0.3)`}}>
                    <feature.icon className="h-8 w-8" style={{color: iconColors[index]}} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4" style={{color: colors.text}}>
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed opacity-70" style={{color: colors.text}}>
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl shadow-xl p-12 md:p-16 text-center overflow-hidden" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
            {/* Background gradient overlay */}
            <div className="absolute inset-0 rounded-3xl" style={{background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(56, 189, 248, 0.1), rgba(34, 197, 94, 0.1))'}}></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: colors.text}}>
                Ready to accelerate your career?
              </h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed opacity-80" style={{color: colors.text}}>
                Join thousands of professionals who are already using Mentorly to advance their careers and unlock their potential.
              </p>
              

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

