// @author: fatima bashir
'use client';
import Link from "next/link";
import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from '@/lib/ThemeContext';

export default function Page() {
  const { theme, toggleTheme, colors } = useTheme();
  const [showSignIn, setShowSignIn] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirect to dashboard after sign in
    // Later this will validate credentials
    window.location.href = '/dashboard';
  };

  if (showSignIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: theme === 'dark' ? '#0f172a' : colors.background}}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2" style={{color: colors.text}}>
                  Welcome back!
                </h2>
                <p className="text-sm opacity-70" style={{color: colors.text}}>
                  Sign in to your Mentorly account
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
            <form onSubmit={handleSignIn} className="space-y-6">
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
                  placeholder="Enter your password"
                />
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 border-2"
                style={{background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#22c55e'}}
              >
                Sign In
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <button type="button" className="text-sm font-medium py-2 px-4 rounded-xl transition-all duration-200 hover:scale-105 border" style={{background: theme === 'dark' ? 'rgba(148, 163, 184, 0.08)' : 'rgba(248, 250, 252, 0.8)', border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.4)'}`, color: theme === 'dark' ? '#cbd5e1' : '#64748b'}}>
                  Forgot your password?
                </button>
              </div>

              {/* Back to Options */}
              <div className="text-center pt-4">
                <button 
                  type="button"
                  onClick={() => setShowSignIn(false)}
                  className="inline-block py-2 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 border-2" 
                  style={{background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)', color: '#8b5cf6'}}
                >
                  ← Back to Options
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: theme === 'dark' ? '#0f172a' : colors.background}}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{color: colors.text}}>
                Welcome back to Mentorly
              </h2>
              <p className="text-sm opacity-70" style={{color: colors.text}}>
                Continue your career growth journey
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
          <div className="space-y-6">
            {/* Create Account Option */}
            <div className="p-6 rounded-2xl border-2 hover:scale-105 transition-transform duration-200" style={{background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)'}}>
              <h3 className="text-xl font-semibold mb-3" style={{color: colors.text}}>Create Account</h3>
              <p className="opacity-70 mb-4 text-sm" style={{color: colors.text}}>
                Save your progress, memories, and get personalized recommendations
              </p>
              <Link href="/sign-up" className="inline-block w-full py-3 px-6 rounded-2xl font-semibold transition-opacity hover:opacity-80 text-center" style={{background: 'transparent', border: '2px solid #8b5cf6', color: '#8b5cf6'}}>
                Sign Up
              </Link>
            </div>

            {/* Continue as Guest Option */}
            <div className="p-6 rounded-2xl border-2 hover:scale-105 transition-transform duration-200" style={{background: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)'}}>
              <h3 className="text-xl font-semibold mb-3" style={{color: colors.text}}>Continue as Guest</h3>
              <p className="opacity-70 mb-4 text-sm" style={{color: colors.text}}>
                Start exploring immediately without creating an account
              </p>
              <Link href="/dashboard" className="inline-block w-full py-3 px-6 rounded-2xl font-semibold transition-opacity hover:opacity-80 text-center" style={{background: 'transparent', border: '2px solid #38bdf8', color: '#38bdf8'}}>
                Continue as Guest
              </Link>
            </div>

            {/* Existing users */}
            <div className="text-center pt-4">
              <p className="opacity-70 text-sm mb-4" style={{color: colors.text}}>
                Already have an account?
              </p>
              <button 
                onClick={() => setShowSignIn(true)}
                className="inline-block py-3 px-8 rounded-2xl font-semibold transition-all duration-200 hover:scale-105 border-2" 
                style={{background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#22c55e'}}
              >
                Sign In
              </button>
            </div>

            {/* Back to Home */}
            <div className="text-center pt-2">
              <Link href="/" className="inline-block font-medium transition-opacity hover:opacity-80" style={{color: colors.textSecondary}}>
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

