// @author: fatima bashir
'use client';
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Check, Brain, Zap, Crown, ArrowRight, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/ThemeContext'

export default function PricingPage() {
  const { theme, toggleTheme, colors } = useTheme();
  
  return (
    <div className="min-h-screen" style={{background: theme === 'dark' ? '#0f172a' : colors.background}}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b" style={{background: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.3)', borderColor: colors.cardBorder}}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold" style={{color: colors.text}}>Mentorly</span>
            </Link>
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
                  <Moon size={20} style={{color: '#8b5cf6'}} />
                )}
              </button>
              <Link href="/sign-in" className="transition-colors hover:opacity-80" style={{color: colors.text}}>
                Sign In
              </Link>
              <Button size="sm" asChild className="border-0 shadow-lg rounded-xl text-white hover:opacity-90 transition-opacity" style={{background: '#8b5cf6'}}>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-32 pb-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your career growth journey. All plans include our core AI mentorship features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="p-8 rounded-3xl glass dark:glass-dark apple-shadow hover:apple-shadow-large transition-all duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Free</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">$0</div>
              <div className="text-gray-600 dark:text-gray-300">Forever</div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">Basic skill assessment</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">Limited AI chat (10 messages/day)</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">Resume ATS scoring</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">1 mock interview/month</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full py-3 rounded-xl" asChild>
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="relative p-8 rounded-3xl glass dark:glass-dark apple-shadow-large hover:apple-shadow transition-all duration-300 border-2 border-blue-500">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full">
                Most Popular
              </div>
            </div>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Pro</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">$29</div>
              <div className="text-gray-600 dark:text-gray-300">per month</div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">Unlimited AI chat</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">Personalized 4-week learning plans</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">Unlimited mock interviews</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">STAR bullet generation</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">Priority support</span>
              </div>
            </div>
            
            <Button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/sign-up">Start Free Trial</Link>
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-3xl glass dark:glass-dark apple-shadow hover:apple-shadow-large transition-all duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Enterprise</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">$99</div>
              <div className="text-gray-600 dark:text-gray-300">per month</div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">Everything in Pro</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">Custom learning paths</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">1-on-1 mentorship sessions</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">Company integration</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">Advanced analytics</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full py-3 rounded-xl" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <div className="p-6 rounded-2xl glass dark:glass-dark apple-shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl glass dark:glass-dark apple-shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl glass dark:glass-dark apple-shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How does the AI mentorship work?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes your profile, goals, and industry trends to provide personalized career advice, learning recommendations, and interview preparation.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto p-8 rounded-3xl glass dark:glass-dark apple-shadow-large">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to accelerate your career?
            </h2>
            <p className="mb-6 opacity-70" style={{color: colors.text}}>
              Join thousands of professionals advancing their careers with Mentorly
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl" asChild>
              <Link href="/sign-up">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
