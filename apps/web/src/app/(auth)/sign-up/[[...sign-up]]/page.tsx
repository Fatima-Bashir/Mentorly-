// @author: fatima bashir
'use client';
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useTheme } from '@/lib/ThemeContext';

export default function Page() {
  const { theme, toggleTheme, colors } = useTheme();
  
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: theme === 'dark' ? '#0f172a' : colors.background}}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{color: colors.text}}>
                Join Mentorly
              </h2>
              <p className="text-sm opacity-70" style={{color: colors.text}}>
                Start your personalized career mentorship journey
              </p>
            </div>
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
        <div className="shadow-xl rounded-3xl p-8" style={{background: colors.cardBackground, border: `1px solid ${colors.cardBorder}`}}>
          <form className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:scale-105 focus:outline-none"
                style={{
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                  borderColor: colors.cardBorder,
                  color: colors.text
                }}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:scale-105 focus:outline-none"
                style={{
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                  borderColor: colors.cardBorder,
                  color: colors.text
                }}
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:scale-105 focus:outline-none"
                style={{
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                  borderColor: colors.cardBorder,
                  color: colors.text
                }}
                placeholder="Create a password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: colors.text}}>
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 transition-all duration-200 focus:scale-105 focus:outline-none"
                style={{
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.9)',
                  borderColor: colors.cardBorder,
                  color: colors.text
                }}
                placeholder="Confirm your password"
              />
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-200 hover:scale-105 hover:opacity-90"
              style={{background: '#8b5cf6'}}
            >
              Create Account
            </button>

            {/* Benefits */}
            <div className="text-center pt-4">
              <p className="text-xs opacity-60 mb-4" style={{color: colors.text}}>
                By creating an account, your progress, memories, and preferences will be saved
              </p>
            </div>

            {/* Already have account */}
            <div className="text-center pt-2">
              <p className="opacity-70 text-sm mb-3" style={{color: colors.text}}>
                Already have an account?
              </p>
              <Link href="/sign-in" className="inline-block py-2 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 border-2" style={{background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#22c55e'}}>
                Sign In Here
              </Link>
            </div>

            {/* Back to Home */}
            <div className="text-center pt-4">
              <Link href="/" className="inline-block font-medium transition-opacity hover:opacity-80" style={{color: colors.textSecondary}}>
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

