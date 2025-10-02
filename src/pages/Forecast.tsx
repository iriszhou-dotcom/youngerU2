import { useState } from 'react'
import { TrendingUp, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toast'

interface ForecastInputs {
  activeHabits: string[]
  consistency: number
  timeHorizon: number
}

interface ProjectionData {
  week: number
  energy: number
  focus: number
  recovery: number
}

export default function Forecast() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [inputs, setInputs] = useState<ForecastInputs>({
    activeHabits: [],
    consistency: 80,
    timeHorizon: 8
  })
  const [projection, setProjection] = useState<ProjectionData[]>([])
  const [loading, setLoading] = useState(false)

  const habitOptions = [
    'Vitamin D3',
    'Omega-3',
    'Magnesium',
    'Regular Exercise',
    'Quality Sleep',
    'Stress Management'
  ]

  const handleHabitToggle = (habit: string) => {
    setInputs(prev => ({
      ...prev,
      activeHabits: prev.activeHabits.includes(habit)
        ? prev.activeHabits.filter(h => h !== habit)
        : [...prev.activeHabits, habit]
    }))
  }

  const generateForecast = () => {
    setLoading(true)
    
    // Simple heuristic for projection
    const baselineEnergy = 5
    const baselineFocus = 5
    const baselineRecovery = 5
    
    const improvementRate = (inputs.consistency / 100) * 0.2 * (inputs.activeHabits.length / 6)
    
    const newProjection: ProjectionData[] = []
    
    for (let week = 0; week <= inputs.timeHorizon; week++) {
      const improvement = Math.min(improvementRate * week, 3) // Cap at +3 points
      const plateauFactor = week > 8 ? 0.8 : 1 // Plateau after week 8
      
      newProjection.push({
        week,
        energy: Math.min(10, baselineEnergy + (improvement * plateauFactor)),
        focus: Math.min(10, baselineFocus + (improvement * plateauFactor * 0.9)),
        recovery: Math.min(10, baselineRecovery + (improvement * plateauFactor * 1.1))
      })
    }
    
    setProjection(newProjection)
    setLoading(false)
  }

  const saveForecast = async () => {
    if (projection.length === 0) return
    
    if (!user) {
      showToast('Sign up to save forecasts permanently!', 'info')
      return
    }

    try {
      await supabase
        .from('forecasts')
        .insert({
          user_id: user.id,
          inputs,
          projection
        })

      showToast('Forecast saved successfully!', 'success')
    } catch (error) {
      console.error('Error saving forecast:', error)
      showToast('Failed to save forecast', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#174C4F] mb-2">
            Wellness Forecast - "Your Future Self"
          </h1>
          <p className="text-gray-600">
            Visualize your potential progress with consistent habits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#174C4F] mb-4">
              Forecast Parameters
            </h3>
            
            <div className="space-y-6">
              {/* Active Habits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Active Habits
                </label>
                <div className="space-y-2">
                  {habitOptions.map(habit => (
                    <label key={habit} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={inputs.activeHabits.includes(habit)}
                        onChange={() => handleHabitToggle(habit)}
                        className="rounded border-gray-300 text-[#7ED957] focus:ring-[#7ED957]"
                      />
                      <span className="ml-2 text-sm text-gray-700">{habit}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Consistency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Expected Consistency: {inputs.consistency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={inputs.consistency}
                  onChange={(e) => setInputs(prev => ({ ...prev, consistency: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Time Horizon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Time Horizon
                </label>
                <select
                  value={inputs.timeHorizon}
                  onChange={(e) => setInputs(prev => ({ ...prev, timeHorizon: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#7ED957] focus:border-[#7ED957]"
                >
                  <option value={4}>4 weeks</option>
                  <option value={8}>8 weeks</option>
                  <option value={12}>12 weeks</option>
                </select>
              </div>

              <button
                onClick={generateForecast}
                disabled={loading || inputs.activeHabits.length === 0}
                className="w-full bg-[#7ED957] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6BC847] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Generate Forecast
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {projection.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#174C4F]">
                    Projected Progress
                  </h3>
                  <button
                    onClick={saveForecast}
                    className="text-sm text-[#7ED957] hover:text-[#6BC847] font-medium flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" />
                    Save Forecast
                  </button>
                </div>

                {/* Simple Chart */}
                <div className="space-y-4 mb-6">
                  {projection.map((point, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 text-sm text-gray-600">
                        Week {point.week}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-xs text-gray-600">Energy</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(point.energy / 10) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-xs text-gray-600">{point.energy.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-xs text-gray-600">Focus</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(point.focus / 10) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-xs text-gray-600">{point.focus.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-xs text-gray-600">Recovery</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(point.recovery / 10) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-xs text-gray-600">{point.recovery.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Disclaimer:</strong> This is an illustrative projection, not medical advice. 
                    Individual results may vary based on many factors including genetics, lifestyle, and adherence.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Generate your forecast
                </h3>
                <p className="text-gray-500">
                  Select your active habits and consistency level to see your potential progress.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}