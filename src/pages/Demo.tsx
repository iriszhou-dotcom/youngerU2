import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Save, User, LogIn, ArrowRight } from 'lucide-react'

interface PlannerInputs {
  goals: string[]
  diet: string
  fishIntake: string
  sunExposure: string
  sleepQuality: number
  stress: number
  budget: string
  sensitivities: string[]
  medsConditions: string
}

interface Recommendation {
  category: string
  why: string
  dose: string
  timing: string
  evidence: string
  guardrails: string
  foodFirst: string
}

export default function Demo() {
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState<PlannerInputs>({
    goals: [],
    diet: '',
    fishIntake: '',
    sunExposure: '',
    sleepQuality: 3,
    stress: 3,
    budget: '',
    sensitivities: [],
    medsConditions: ''
  })
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false)

  const handleGoalChange = (goal: string) => {
    setInputs(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const handleSensitivityChange = (sensitivity: string) => {
    setInputs(prev => ({
      ...prev,
      sensitivities: prev.sensitivities.includes(sensitivity)
        ? prev.sensitivities.filter(s => s !== sensitivity)
        : [...prev.sensitivities, sensitivity]
    }))
  }

  const generatePlan = async () => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simple rule-based recommendations
    const newRecommendations: Recommendation[] = []
    
    if (inputs.goals.includes('Energy')) {
      newRecommendations.push({
        category: 'Vitamin D3',
        why: 'Low sun exposure and energy goals suggest potential deficiency',
        dose: '2000-4000 IU daily',
        timing: 'With breakfast (fat-soluble)',
        evidence: 'A',
        guardrails: 'Monitor levels if taking >4000 IU long-term',
        foodFirst: 'Fatty fish, egg yolks, fortified foods'
      })
    }
    
    if (inputs.goals.includes('Focus')) {
      newRecommendations.push({
        category: 'Omega-3 (EPA/DHA)',
        why: 'Brain health support for focus and cognitive function',
        dose: '1-2g combined EPA/DHA daily',
        timing: 'With meals to improve absorption',
        evidence: 'A',
        guardrails: 'Consult doctor if on blood thinners',
        foodFirst: 'Fatty fish 2-3x per week'
      })
    }
    
    if (inputs.goals.includes('Recovery') || inputs.sleepQuality < 3) {
      newRecommendations.push({
        category: 'Magnesium Glycinate',
        why: 'Supports muscle recovery and sleep quality',
        dose: '200-400mg before bed',
        timing: '30-60 minutes before sleep',
        evidence: 'B',
        guardrails: 'Start low, may cause loose stools in some',
        foodFirst: 'Dark leafy greens, nuts, seeds'
      })
    }

    setRecommendations(newRecommendations)
    setLoading(false)
  }

  const handleSaveAttempt = () => {
    setShowSignUpPrompt(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7F8] to-white">
      {/* Demo Navigation */}
      <nav className="bg-white/90 backdrop-blur-glass border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-[#174C4F] tracking-tight">
                YoungerU
              </Link>
              <span className="ml-3 px-3 py-1 bg-[#7ED957]/10 text-[#7ED957] text-sm font-medium rounded-full">
                Demo Mode
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 hover:text-[#174C4F] transition-colors"
              >
                ← Back to Landing
              </Link>
              <Link
                to="/auth/sign-up"
                className="bg-[#7ED957] text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-[#6BC847] transition-all duration-200 hover-lift shadow-lg flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign Up for Full Access
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-[#7ED957] to-[#6BC847] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium">
            🎯 You're in demo mode! Try all features - sign up to save your data and get full access.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#174C4F] to-[#174C4F]/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Try YoungerU Risk-Free
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Experience our AI-powered supplement planner. No signup required to explore.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Full Demo Access', 'No Credit Card', 'Instant Results'].map(benefit => (
                <span key={benefit} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Planner Form Section */}
      <div className="py-24 bg-[#F5F7F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#174C4F] mb-4">
              AI Supplement & Wellness Planner
            </h2>
            <p className="text-xl text-gray-600">
              Tell us about you. We'll build a simple, science-aligned plan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Column */}
            <div className="bg-white rounded-3xl shadow-soft p-8 lg:p-10">
              <form className="space-y-6">
                {/* Goals */}
                <div>
                  <label className="block text-base font-semibold text-[#174C4F] mb-4">
                    Primary Goals (select all that apply)
                  </label>
                  <div className="space-y-3">
                    {['Energy', 'Focus', 'Recovery'].map(goal => (
                      <label key={goal} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inputs.goals.includes(goal)}
                          onChange={() => handleGoalChange(goal)}
                          className="rounded-lg border-gray-300 text-[#7ED957] focus:ring-[#7ED957] w-5 h-5"
                        />
                        <span className="ml-3 text-base text-gray-700 font-medium">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Diet */}
                <div>
                  <label className="block text-base font-semibold text-[#174C4F] mb-4">
                    Diet Pattern
                  </label>
                  <select
                    value={inputs.diet}
                    onChange={(e) => setInputs(prev => ({ ...prev, diet: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-base"
                  >
                    <option value="">Select diet pattern</option>
                    <option value="omnivore">Omnivore</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                {/* Sleep Quality */}
                <div>
                  <label className="block text-base font-semibold text-[#174C4F] mb-4">
                    Sleep Quality (1-5 scale)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={inputs.sleepQuality}
                    onChange={(e) => setInputs(prev => ({ ...prev, sleepQuality: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                  <p className="text-base text-gray-600 mt-2 font-medium">Current: {inputs.sleepQuality}</p>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-base font-semibold text-[#174C4F] mb-4">
                    Monthly Budget
                  </label>
                  <select
                    value={inputs.budget}
                    onChange={(e) => setInputs(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-base"
                  >
                    <option value="">Select budget range</option>
                    <option value="low">Low ($20-50)</option>
                    <option value="medium">Medium ($50-100)</option>
                    <option value="high">High ($100+)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={generatePlan}
                  disabled={loading || inputs.goals.length === 0}
                  className="w-full bg-[#7ED957] text-white py-4 px-6 rounded-2xl font-semibold hover:bg-[#6BC847] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-200 hover-lift shadow-lg text-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate My Demo Plan
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Column */}
            <div className="bg-white rounded-3xl shadow-soft p-8 lg:p-10">
              {recommendations.length > 0 ? (
                <div>
                  <h3 className="text-2xl font-bold text-[#174C4F] mb-8">
                    Your Demo Plan
                  </h3>
                  <div className="space-y-8">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-bold text-[#174C4F]">{rec.category}</h4>
                          <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                            rec.evidence === 'A' ? 'bg-green-100 text-green-800' :
                            rec.evidence === 'B' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            Evidence: {rec.evidence}
                          </span>
                        </div>
                        
                        <div className="space-y-3 text-base">
                          <p><span className="font-semibold text-[#174C4F]">Why you got this:</span> {rec.why}</p>
                          <p><span className="font-semibold text-[#174C4F]">Dose range:</span> {rec.dose}</p>
                          <p><span className="font-semibold text-[#174C4F]">Timing:</span> {rec.timing}</p>
                          <p><span className="font-semibold text-[#174C4F]">Guardrails:</span> {rec.guardrails}</p>
                        </div>
                        
                        <button 
                          onClick={handleSaveAttempt}
                          className="mt-4 text-sm text-[#7ED957] hover:text-[#6BC847] font-medium flex items-center gap-1"
                        >
                          <Save className="w-4 h-4" />
                          Save to My Plan
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Sign Up CTA */}
                  <div className="mt-8 bg-gradient-to-r from-[#7ED957]/10 to-[#6BC847]/10 border border-[#7ED957]/20 rounded-2xl p-6 text-center">
                    <h4 className="text-lg font-bold text-[#174C4F] mb-2">
                      Love your plan? Get the full experience!
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Sign up to save your plan, track habits, and access all features.
                    </p>
                    <Link
                      to="/auth/sign-up"
                      className="inline-flex items-center gap-2 bg-[#7ED957] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#6BC847] transition-all duration-200 hover-lift shadow-lg"
                    >
                      Sign Up Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Generate your demo plan
                  </h3>
                  <p className="text-lg text-gray-500">
                    Fill out the form and click "Generate My Demo Plan" to see personalized recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up Prompt Modal */}
      {showSignUpPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center">
            <User className="w-16 h-16 text-[#7ED957] mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-[#174C4F] mb-4">
              Sign Up to Save Your Plan
            </h3>
            <p className="text-gray-600 mb-6">
              Create an account to save your personalized recommendations and access all features.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowSignUpPrompt(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Continue Demo
              </button>
              <Link
                to="/auth/sign-up"
                className="flex-1 px-6 py-3 bg-[#7ED957] text-white rounded-xl hover:bg-[#6BC847] transition-colors font-semibold"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}