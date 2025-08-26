// @author: fatima bashir
'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from '@/lib/ThemeContext';
import { ResumeProvider } from '@/contexts/ResumeContext';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Brain,
  FileText,
  MessageCircle,
  Target,
  BookOpen,
  Settings,
  Menu,
  Sun,
  Moon,
  Edit
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Target, label: "Skill Analysis", href: "/skills" },
  { icon: BookOpen, label: "Learning Plan", href: "/learning" },
  { icon: Brain, label: "Mock Interview", href: "/interview" },
  { icon: Edit, label: "Resume Builder", href: "/resume-builder" },
  { icon: MessageCircle, label: "AI Mentor", href: "/chat" },
  { icon: FileText, label: "ATS Optimizer", href: "/ats" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication temporarily disabled - will be added back with proper auth setup

  const { theme, toggleTheme, colors } = useTheme();
  const pathname = usePathname();
  
  return (
    <ResumeProvider>
      <div className="flex min-h-screen" style={{background: theme === 'dark' ? '#0f172a' : colors.background}}>
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 shadow-xl" style={{background: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.3)', borderRight: `1px solid ${colors.cardBorder}`, backdropFilter: 'blur(20px)'}}>
        {/* Logo */}
        <div className="flex items-center h-20 px-8" style={{borderBottom: `1px solid ${colors.cardBorder}`}}>
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)'}}>
              <Brain className="w-6 h-6" style={{color: theme === 'dark' ? '#c4b5fd' : '#6b7280'}} />
            </div>
            <span className="text-2xl font-bold" style={{color: colors.text}}>Mentorly</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-8 space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href;
            const iconColors = [
              { bg: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(221, 214, 254, 0.2)', border: theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(221, 214, 254, 0.3)', color: theme === 'dark' ? '#c4b5fd' : '#6b7280' },
              { bg: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(186, 230, 253, 0.2)', border: theme === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(186, 230, 253, 0.3)', color: theme === 'dark' ? '#7dd3fc' : '#6b7280' },
              { bg: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(167, 243, 208, 0.2)', border: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(167, 243, 208, 0.3)', color: theme === 'dark' ? '#86efac' : '#6b7280' },
              { bg: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(221, 214, 254, 0.2)', border: theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(221, 214, 254, 0.3)', color: theme === 'dark' ? '#c4b5fd' : '#6b7280' },
              { bg: theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(254, 243, 199, 0.2)', border: theme === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(254, 243, 199, 0.3)', color: theme === 'dark' ? '#fbbf24' : '#6b7280' },
              { bg: theme === 'dark' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(186, 230, 253, 0.2)', border: theme === 'dark' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(186, 230, 253, 0.3)', color: theme === 'dark' ? '#7dd3fc' : '#6b7280' },
              { bg: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(167, 243, 208, 0.2)', border: theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(167, 243, 208, 0.3)', color: theme === 'dark' ? '#86efac' : '#6b7280' },
              { bg: theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(221, 214, 254, 0.2)', border: theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(221, 214, 254, 0.3)', color: theme === 'dark' ? '#c4b5fd' : '#6b7280' }
            ];

            // Enhanced styling for active items
            const activeIconColor = iconColors[index];
            const enhancedIconColor = isActive ? {
              bg: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
              border: theme === 'dark' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.4)',
              color: theme === 'dark' ? '#c4b5fd' : '#8b5cf6'
            } : activeIconColor;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-4 text-base font-semibold rounded-2xl transition-all duration-200 group hover:bg-white/5"
                style={{
                  color: isActive ? (theme === 'dark' ? '#e2e8f0' : '#1e293b') : colors.text,
                  background: isActive ? (theme === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)') : 'transparent'
                }}
              >
                <div className="w-8 h-8 mr-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200" style={{background: enhancedIconColor.bg, border: `1px solid ${enhancedIconColor.border}`}}>
                  <item.icon className="w-4 h-4" style={{color: enhancedIconColor.color}} />
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* User section at bottom */}
        <div className="p-6" style={{borderTop: `1px solid ${colors.cardBorder}`}}>
          <div className="flex items-center p-4 rounded-2xl" style={{background: theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(147, 197, 253, 0.15)'}}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mr-3" style={{background: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(167, 243, 208, 0.2)', border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(167, 243, 208, 0.3)'}`}}>
              <span className="font-bold text-sm" style={{color: theme === 'dark' ? '#86efac' : '#6b7280'}}>F</span>
            </div>
            <div>
              <div className="text-sm font-semibold" style={{color: colors.text}}>Demo User</div>
              <div className="text-xs opacity-70" style={{color: colors.text}}>demo@mentorly.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-72">
        {/* Header */}
        <header className="backdrop-blur-xl px-8 py-6" style={{background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.3)', borderBottom: `1px solid ${colors.cardBorder}`}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="lg:hidden rounded-xl">
                <Menu className="h-5 w-5" style={{color: colors.text}} />
              </Button>
              <div className="text-sm opacity-70" style={{color: colors.text}}>
                Good Morning, Fatima
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
                  <Moon size={20} style={{color: theme === 'dark' ? '#c4b5fd' : '#6b7280'}} />
                )}
              </button>
              <Link href="/settings" className="px-4 py-2 rounded-xl font-medium transition-colors hover:opacity-80" style={{color: colors.text}}>
                Settings
              </Link>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(221, 214, 254, 0.4)', border: `1px solid ${theme === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(221, 214, 254, 0.3)'}`}}>
                <span className="font-bold" style={{color: theme === 'dark' ? '#c4b5fd' : '#6b7280'}}>F</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
    </ResumeProvider>
  );
}

