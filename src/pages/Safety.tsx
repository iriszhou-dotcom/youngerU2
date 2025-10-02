import { useState } from 'react'
import { Shield, Download, Save, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toast'

interface SafetyInputs {
  supplements: string[]
  medications: string[]
  conditions: string[]
  isPregnant: boolean
  isNursing: boolean
}

interface SafetyResult {
  level: 'safe' | 'caution' | 'warning'
  message: string
  details?: string
}

export default function Safety() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [inputs, setInputs] = useState<SafetyInputs>({
    supplements: [],
    medications: [],
    conditions: [],
    isPregnant: false,
    isNursing: false
  })
  const [results, setResults] = useState<SafetyResult[]>([])
  const [loading, setLoading] = useState(false)
  const [supplementInput, setSupplementInput] = useState('')
  const [medicationInput, setMedicationInput] = useState('')

  const conditionOptions = [
    'High Blood Pressure',
    'Diabetes',
    'Heart Disease',
    'Kidney Disease',
    'Liver Disease',
    'Autoimmune Condition',
    'Blood Clotting Disorder',
    'Thyroid Condition'
  ]

  const addSupplement = () => {
    if (supplementInput.trim() && !inputs.supplements.includes(supplementInput.trim())) {
      setInputs(prev => ({
        ...prev,
        supplements: [...prev.supplements, supplementInput.trim()]
      }))
      setSupplementInput('')
    }
  }

  const removeSupplement = (supplement: string) => {
    setInputs(prev => ({
      ...prev,
      supplements: prev.supplements.filter(s => s !== supplement)
    }))
  }

  const addMedication = () => {
    if (medicationInput.trim() && !inputs.medications.includes(medicationInput.trim())) {
      setInputs(prev => ({
        ...prev,
        medications: [...prev.medications, medicationInput.trim()]
      }))
      setMedicationInput('')
    }
  }

  const removeMedication = (medication: string) => {
    setInputs(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m !== medication)
    }))
  }

  const handleConditionChange = (condition: string) => {
    setInputs(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }))
  }

  const runSafetyCheck = () => {
    setLoading(true)
    
    // Simple rule-based safety checking (in a real app, this would be more comprehensive)
    const newResults: SafetyResult[] = []

    // Pregnancy/nursing checks
    if (inputs.isPregnant || inputs.isNursing) {
      newResults.push({
        level: 'warning',
        message: 'Pregnancy/Nursing Status',
        details: 'Many supplements are not recommended during pregnancy or nursing. Consult your healthcare provider before taking any supplements.'
      })
    }

    // Supplement-medication interactions
    if (inputs.supplements.includes('Omega-3') && inputs.medications.some(med => 
      med.toLowerCase().includes('warfarin') || med.toLowerCase().includes('coumadin')
    )) {
      newResults.push({
        level: 'caution',
        message: 'Omega-3 + Blood Thinners',
        details: 'Omega-3 supplements may increase bleeding risk when combined with anticoagulants. Monitor closely with your doctor.'
      })
    }

    if (inputs.supplements.includes('Vitamin D') && inputs.conditions.includes('Kidney Disease')) {
      newResults.push({
        level: 'caution',
        message: 'Vitamin D + Kidney Disease',
        details: 'High doses of Vitamin D may worsen kidney function. Regular monitoring recommended.'
      })
    }

    // General medication warning
    if (inputs.medications.length > 0 && inputs.supplements.length > 0) {
      newResults.push({
        level: 'caution',
        message: 'Multiple Medications + Supplements',
        details: 'You are taking multiple medications with supplements. Consider discussing all interactions with your pharmacist or doctor.'
      })
    }

    // If no issues found
    if (newResults.length === 0) {
      newResults.push({
        level: 'safe',
        message: 'No Major Interactions Detected',
        details: 'Based on the information provided, no major safety concerns were identified. However, this is not a substitute for professional medical advice.'
      })
    }

    setResults(newResults)
    setLoading(false)
  }

  const saveCheck = async () => {
    if (results.length === 0) return
    
    if (!user) {
      showToast('Sign up to save safety checks permanently!', 'info')
      return
    }

    try {
      await supabase
        .from('safety_checks')
        .insert({
          user_id: user.id,
          supplements: inputs.supplements,
          meds: inputs.medications,
          conditions: inputs.conditions,
          result: results
        })

      showToast('Safety check saved successfully!', 'success')
    } catch (error) {
      console.error('Error saving safety check:', error)
      showToast('Failed to save safety check', 'error')
    }
  }

  const getResultIcon = (level: string) => {
    switch (level) {
      case 'safe':
        return <Shield className="w-5 h-5 text-green-500" />
      case 'caution':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Shield className="w-5 h-5 text-gray-500" />
    }
  }

  const getResultColor = (level: string) => {
    switch (level) {
      case 'safe':
        return 'border-green-200 bg-green-50'
      case 'caution':
        return 'border-yellow-200 bg-yellow-50'
      case 'warning':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#174C4F] mb-2">
            Supplement Safety Checker
          </h1>
          <p className="text-gray-600">
            Check for potential interactions and safety considerations.
          </p>
        </div>

        {/* Safety Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">
                Important Safety Notice
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                If you're pregnant, nursing, on medications, or have a health condition, talk to your clinician 
                before starting any new supplements. This tool provides general guidance only.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[#174C4F] mb-6">
              Safety Check Information
            </h3>

            <div className="space-y-6">
              {/* Supplements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Current Supplements
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={supplementInput}
                    onChange={(e) => setSupplementInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSupplement()}
                    placeholder="Enter supplement name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#7ED957] focus:border-[#7ED957]"
                  />
                  <button
                    onClick={addSupplement}
                    className="px-4 py-2 bg-[#7ED957] text-white rounded-md hover:bg-[#6BC847]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {inputs.supplements.map(supplement => (
                    <span
                      key={supplement}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {supplement}
                      <button
                        onClick={() => removeSupplement(supplement)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Current Medications
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={medicationInput}
                    onChange={(e) => setMedicationInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                    placeholder="Enter medication name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#7ED957] focus:border-[#7ED957]"
                  />
                  <button
                    onClick={addMedication}
                    className="px-4 py-2 bg-[#7ED957] text-white rounded-md hover:bg-[#6BC847]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {inputs.medications.map(medication => (
                    <span
                      key={medication}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {medication}
                      <button
                        onClick={() => removeMedication(medication)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Health Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Health Conditions
                </label>
                <div className="space-y-2">
                  {conditionOptions.map(condition => (
                    <label key={condition} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={inputs.conditions.includes(condition)}
                        onChange={() => handleConditionChange(condition)}
                        className="rounded border-gray-300 text-[#7ED957] focus:ring-[#7ED957]"
                      />
                      <span className="ml-2 text-sm text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pregnancy/Nursing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Special Considerations
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={inputs.isPregnant}
                      onChange={(e) => setInputs(prev => ({ ...prev, isPregnant: e.target.checked }))}
                      className="rounded border-gray-300 text-[#7ED957] focus:ring-[#7ED957]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pregnant</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={inputs.isNursing}
                      onChange={(e) => setInputs(prev => ({ ...prev, isNursing: e.target.checked }))}
                      className="rounded border-gray-300 text-[#7ED957] focus:ring-[#7ED957]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Nursing</span>
                  </label>
                </div>
              </div>

              <button
                onClick={runSafetyCheck}
                disabled={loading}
                className="w-full bg-[#7ED957] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6BC847] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Checking...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Run Safety Check
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {results.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[#174C4F]">
                    Safety Check Results
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={saveCheck}
                      className="text-sm text-[#7ED957] hover:text-[#6BC847] font-medium flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" />
                      Save Check
                    </button>
                    <button className="text-sm text-[#7ED957] hover:text-[#6BC847] font-medium flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 ${getResultColor(result.level)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getResultIcon(result.level)}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {result.message}
                          </h4>
                          {result.details && (
                            <p className="text-sm text-gray-700">
                              {result.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Disclaimer:</strong> This safety check provides general guidance based on common 
                    interactions and contraindications. It is not a substitute for professional medical advice. 
                    Always consult with your healthcare provider before making changes to your supplement regimen.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Run your safety check
                </h3>
                <p className="text-gray-500">
                  Enter your supplements, medications, and health conditions to check for potential interactions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}