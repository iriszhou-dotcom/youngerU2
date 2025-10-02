import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, CheckCircle, ArrowRight, User, Zap, Shield } from 'lucide-react'

export default function Landing() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Customer info:', { name, email, password })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#174C4F] to-[#174C4F]/90 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-[#7ED957] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#174C4F] mb-4">
            Thank you, {name}!
          </h2>
          <p className="text-gray-600 mb-8">
            We've received your information. You can now explore the app or wait for our team to contact you.
          </p>
          <div className="space-y-4">
            <Link
              to="/demo"
              className="block w-full bg-[#7ED957] text-white py-3 px-6 rounded-2xl font-semibold hover:bg-[#6BC847] transition-all duration-200 hover-lift shadow-lg"
            >
              Try the App Demo
            </Link>
            <Link
              to="/auth/sign-in"
              className="block w-full border-2 border-[#174C4F] text-[#174C4F] py-3 px-6 rounded-2xl font-semibold hover:bg-[#174C4F] hover:text-white transition-all duration-200"
            >
              Sign In to Full App
            </Link>
          </div>
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
          <div className="flex items-center space-x-6">
            <Link
              to="/demo"
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              Try Demo
            </Link>
            <Link
              to="/auth/sign-in"
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-2xl font-medium hover:bg-white/20 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="animate-fade-in-up">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Feel younger, live stronger.
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
                Get personalized, science-backed supplement guidance in 3 minutes.
              </p>
              
              {/* Benefit Chips */}
              <div className="flex flex-wrap gap-3 mb-10">
                {['Energy', 'Focus', 'Recovery'].map(benefit => (
                  <span key={benefit} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                    {benefit}
                  </span>
                ))}
              </div>
              
              {/* Trust Line */}
              <p className="text-white/70 text-lg mb-8">
                Join thousands who've transformed their wellness journey
              </p>
            </div>
            
            {/* Sign Up Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#174C4F] mb-2">
                  Start Your Journey
                </h2>
                <p className="text-gray-600">
                  Get your personalized wellness plan
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#174C4F] mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-base bg-white text-black"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#174C4F] mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-base bg-white text-black"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-[#174C4F] mb-2">
                    Create Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-base bg-white text-black"
                    placeholder="Create a secure password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#7ED957] text-white py-4 px-6 rounded-2xl font-semibold hover:bg-[#6BC847] transition-all duration-200 hover-lift shadow-lg text-lg flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Get My Personalized Plan
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#174C4F] mb-4">
              Why Choose YoungerU?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Science-backed recommendations tailored to your unique needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <User className="w-8 h-8 text-[#7ED957]" />,
                title: "Personalized for You",
                description: "Every recommendation is tailored to your lifestyle, goals, and health profile"
              },
              {
                icon: <Zap className="w-8 h-8 text-[#7ED957]" />,
                title: "Science-Backed",
                description: "All recommendations are based on peer-reviewed research and clinical evidence"
              },
              {
                icon: <Shield className="w-8 h-8 text-[#7ED957]" />,
                title: "Safety First",
                description: "Built-in safety checks for interactions and contraindications"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-[#F5F7F8] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#7ED957]/10 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#174C4F] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-[#F5F7F8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#174C4F] mb-6">
            Ready to Feel Your Best?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands who've already started their wellness transformation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#signup"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-[#7ED957] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#6BC847] transition-all duration-200 hover-lift shadow-lg text-lg flex items-center justify-center gap-3"
            >
              Start Your Plan
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              to="/demo"
              className="border-2 border-[#174C4F] text-[#174C4F] px-8 py-4 rounded-2xl font-semibold hover:bg-[#174C4F] hover:text-white transition-all duration-200 text-lg"
            >
              Try Demo First
            </Link>
            <Link
              to="/app"
              className="bg-[#174C4F] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#174C4F]/90 transition-all duration-200 text-lg"
            >
              Full App Access
            </Link>
          </div>
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