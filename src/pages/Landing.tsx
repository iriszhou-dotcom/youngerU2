import { useState } from 'react'
import { Sparkles, CheckCircle, ArrowRight, X, AlertCircle, AlertTriangle, TrendingDown } from 'lucide-react'

export default function Landing() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#174C4F] to-[#174C4F]/90 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-[#7ED957] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#174C4F] mb-4">
            Check Your Email!
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent your Free Supplement Clarity Guide to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Don't see it? Check your spam folder.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#174C4F] to-[#174C4F]/90 text-white">
      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">
            YoungerU
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          {/* Pain Point Headline */}
          <h1 className="text-4xl lg:text-7xl font-bold mb-6 leading-tight">
            Confused by supplements?
            <br />
            <span className="text-white/90">You're not alone.</span>
          </h1>

          {/* Promise Subheadline */}
          <p className="text-xl lg:text-3xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
            YoungerU cuts through the hype with science-backed, personalized guidance — in just 3 minutes.
          </p>

          {/* Primary CTA */}
          <a
            href="#email-form"
            className="inline-flex items-center justify-center gap-3 bg-[#7ED957] text-white px-12 py-5 rounded-2xl font-bold hover:bg-[#6BC847] transition-all duration-200 shadow-2xl text-xl mb-6 hover:scale-105 transform"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('email-form')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <Sparkles className="w-6 h-6" />
            Get My Free Plan
          </a>

          {/* Secondary CTA */}
          <p className="text-white/80 text-base">
            Join the waitlist & get your <strong>free supplement clarity guide</strong>
          </p>
        </div>
      </div>

      {/* Pain Point Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {[
              {
                icon: <AlertCircle className="w-10 h-10 text-red-500" />,
                text: "Too many pills, too little clarity."
              },
              {
                icon: <AlertTriangle className="w-10 h-10 text-orange-500" />,
                text: "Studies feel like hype and BS."
              },
              {
                icon: <TrendingDown className="w-10 h-10 text-amber-500" />,
                text: "I'm 40, energy's dipping, recovery is slower."
              }
            ].map((pain, index) => (
              <div key={index} className="flex items-start gap-6 p-6 bg-gray-50 rounded-2xl border-l-4 border-red-400">
                <div className="flex-shrink-0">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-xl text-gray-800 font-medium flex-1">
                  {pain.text}
                </p>
              </div>
            ))}
          </div>

          {/* Solution CTA */}
          <div className="mt-12 text-center">
            <p className="text-2xl text-[#174C4F] font-bold mb-6">
              → Take the quiz and see what actually works for you.
            </p>
            <a
              href="#email-form"
              className="inline-flex items-center justify-center gap-3 bg-[#7ED957] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#6BC847] transition-all duration-200 shadow-lg text-lg"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('email-form')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Start Your Quiz
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Email Capture Section */}
      <div id="email-form" className="py-24 bg-gradient-to-br from-[#174C4F] to-[#174C4F]/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#174C4F] mb-4">
                Get Your Free Supplement Clarity Guide
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                What actually works, what doesn't, and how to save money.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-lg bg-white text-black"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="bg-[#7ED957] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#6BC847] transition-all duration-200 shadow-lg text-lg whitespace-nowrap"
                >
                  Get My Guide
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                No spam. Unsubscribe anytime. Your data is safe with us.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-24 bg-[#F5F7F8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#174C4F] mb-6">
            Ready to Cut Through the Confusion?
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Join thousands who've stopped wasting money on supplements that don't work
          </p>
          <a
            href="#email-form"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('email-form')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center justify-center gap-3 bg-[#7ED957] text-white px-10 py-5 rounded-2xl font-bold hover:bg-[#6BC847] transition-all duration-200 shadow-xl text-xl hover:scale-105 transform"
          >
            Get Your Free Guide Now
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#174C4F] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">YoungerU</h3>
              <p className="text-lg text-white/80">Science-based wellness guidance</p>
            </div>
            <p className="text-base text-white/70 font-medium">
              Educational, not medical advice.
            </p>
            <p className="text-sm text-white/60 mt-4">
              © 2024 YoungerU. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}