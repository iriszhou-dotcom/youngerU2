import { useState } from 'react'
import { Sparkles, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toast'

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

export default function Planner() {
  const { user } = useAuth()
  const { showToast } = useToast()
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
    if (!user) {
      // Allow demo functionality without user
      console.log('Demo mode - plan generated without saving')
    }
    
    setLoading(true)
    
    // Simple rule-based recommendations (in a real app, this would be more sophisticated)
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
    
    // Save to database
    if (user) {
      try {
        await supabase
          .from('planner_sessions')
          .insert({
            user_id: user.id,
            inputs,
            output: newRecommendations
          })
        
        showToast('Plan generated and saved successfully!', 'success')
      } catch (error) {
        console.error('Error saving plan:', error)
        showToast('Plan generated, but failed to save', 'error')
      }
    } else {
      showToast('Plan generated! Sign up to save your results.', 'success')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7F8] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#174C4F] to-[#174C4F]/90 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#174C4F] via-[#174C4F]/95 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="animate-fade-in-up">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Feel younger, live stronger.
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
                Personalized, science-backed supplement guidance in 3 minutes.
              </p>
              
              {/* Benefit Chips */}
              <div className="flex flex-wrap gap-3 mb-10">
                {['Energy', 'Focus', 'Recovery'].map(benefit => (
                  <span key={benefit} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                    {benefit}
                  </span>
                ))}
              </div>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={() => document.getElementById('planner-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#7ED957] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#6BC847] transition-all duration-200 hover-lift shadow-xl text-lg"
                >
                  Start Your Plan
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-200 text-lg">
                  See How It Works
                </button>
              </div>
              
              {/* Trust Line */}
              <p className="text-white/70 text-sm">
                Science-based. No hype.
              </p>
            </div>
            
            {/* Hero Image */}
            <div className="relative lg:order-first">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/7640744/pexels-photo-7640744.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Smiling midlife couple walking outdoors, looking energetic and confident"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#174C4F]/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#174C4F] mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get personalized recommendations in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Take the quick quiz",
                description: "Answer questions about your lifestyle, goals, and health",
                image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400",
                alt: "Person using phone to take a short health quiz"
              },
              {
                step: "2", 
                title: "Get your simple plan",
                description: "Receive science-backed supplement recommendations tailored to you",
                image: "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400",
                alt: "Simple plan on a screen with two supplement cards"
              },
              {
                step: "3",
                title: "Build habits that last", 
                description: "Track your progress and build sustainable wellness routines",
                image: "https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400",
                alt: "Calendar with daily check marks showing a streak"
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="aspect-square w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <img 
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#7ED957] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#174C4F] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Planner Form Section */}
      <div id="planner-form" className="py-24 bg-[#F5F7F8]">
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

              {/* Fish Intake */}
              <div>
                <label className="block text-base font-semibold text-[#174C4F] mb-4">
                  Fish Intake (servings per week)
                </label>
                <select
                  value={inputs.fishIntake}
                  onChange={(e) => setInputs(prev => ({ ...prev, fishIntake: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-base"
                >
                  <option value="">Select fish intake</option>
                  <option value="0-1">0-1 servings</option>
                  <option value="2-3">2-3 servings</option>
                  <option value="4+">4+ servings</option>
                </select>
              </div>

              {/* Sun Exposure */}
              <div>
                <label className="block text-base font-semibold text-[#174C4F] mb-4">
                  Sun Exposure
                </label>
                <select
                  value={inputs.sunExposure}
                  onChange={(e) => setInputs(prev => ({ ...prev, sunExposure: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-base"
                >
                  <option value="">Select sun exposure</option>
                  <option value="low">Low (mostly indoors)</option>
                  <option value="medium">Medium (some outdoor time)</option>
                  <option value="high">High (outdoors frequently)</option>
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

              {/* Stress */}
              <div>
                <label className="block text-base font-semibold text-[#174C4F] mb-4">
                  Stress Level (1-5 scale)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={inputs.stress}
                  onChange={(e) => setInputs(prev => ({ ...prev, stress: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <p className="text-base text-gray-600 mt-2 font-medium">Current: {inputs.stress}</p>
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

              {/* Sensitivities */}
              <div>
                <label className="block text-base font-semibold text-[#174C4F] mb-4">
                  Sensitivities (select all that apply)
                </label>
                <div className="space-y-3">
                  {['GI sensitive', 'Caffeine sensitive'].map(sensitivity => (
                    <label key={sensitivity} className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inputs.sensitivities.includes(sensitivity)}
                        onChange={() => handleSensitivityChange(sensitivity)}
                        className="rounded-lg border-gray-300 text-[#7ED957] focus:ring-[#7ED957] w-5 h-5"
                      />
                      <span className="ml-3 text-base text-gray-700 font-medium">{sensitivity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Medications/Conditions */}
              <div>
                <label className="block text-base font-semibold text-[#174C4F] mb-4">
                  Current Medications or Health Conditions
                </label>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                  <p className="text-base text-yellow-800 font-medium">
                    ⚠️ If you're pregnant, nursing, on medications, or have a condition, talk to your clinician.
                  </p>
                </div>
                <textarea
                  value={inputs.medsConditions}
                  onChange={(e) => setInputs(prev => ({ ...prev, medsConditions: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-base resize-none"
                  placeholder="List any medications or health conditions..."
                />
              </div>

              <button
                type="button"
                onClick={generatePlan}
                disabled={loading || inputs.goals.length === 0}
                data-track="planner_generate"
                className="w-full bg-[#7ED957] text-white py-4 px-6 rounded-2xl font-semibold hover:bg-[#6BC847] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-200 hover-lift shadow-lg text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate My Plan
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
                  Your Personalized Plan
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
                        <p><span className="font-semibold text-[#174C4F]">Food-first alternative:</span> {rec.foodFirst}</p>
                      </div>
                      
                      <button className="mt-3 text-sm text-[#7ED957] hover:text-[#6BC847] font-medium flex items-center gap-1">
                        <Save className="w-4 h-4" />
                        Save to Library
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Generate your first plan
                </h3>
                <p className="text-lg text-gray-500">
                  Fill out the form and click "Generate My Plan" to get personalized recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}