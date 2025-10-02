import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface LibraryItem {
  id: number
  slug: string
  title: string
  category: string
  evidence_level: string
  summary: string
  how_to_take: string
  guardrails: string
  tags: string[]
}

export default function LibraryDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [item, setItem] = useState<LibraryItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchItem()
    }
  }, [slug])

  const fetchItem = async () => {
    try {
      const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      setItem(data)
    } catch (error) {
      console.error('Error fetching item:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEvidenceBadgeColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-green-100 text-green-800'
      case 'B': return 'bg-yellow-100 text-yellow-800'
      case 'C': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7ED957]"></div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
          <Link to="/library" className="text-[#7ED957] hover:text-[#6BC847]">
            ← Back to Library
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/library"
            className="inline-flex items-center text-[#7ED957] hover:text-[#6BC847] font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-[#174C4F] mb-2">{item.title}</h1>
                <p className="text-gray-600">{item.category}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded ${getEvidenceBadgeColor(item.evidence_level)}`}>
                Evidence: {item.evidence_level}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded">
                  {tag}
                </span>
              ))}
            </div>

            <button className="bg-[#7ED957] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#6BC847] flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Use in Planner
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            <section id="what-it-is">
              <h2 className="text-xl font-semibold text-[#174C4F] mb-3">What it is</h2>
              <p className="text-gray-700 leading-relaxed">{item.summary}</p>
            </section>

            <section id="why-it-helps">
              <h2 className="text-xl font-semibold text-[#174C4F] mb-3">Why it helps</h2>
              <p className="text-gray-700 leading-relaxed">
                This supplement has been studied for its potential benefits in supporting overall health and wellness. 
                The evidence level of {item.evidence_level} indicates the strength of research backing these claims.
              </p>
            </section>

            <section id="how-to-take">
              <h2 className="text-xl font-semibold text-[#174C4F] mb-3">How to take</h2>
              <p className="text-gray-700 leading-relaxed">{item.how_to_take}</p>
            </section>

            <section id="guardrails">
              <h2 className="text-xl font-semibold text-[#174C4F] mb-3">Guardrails</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">{item.guardrails}</p>
              </div>
            </section>

            <section id="evidence-notes">
              <h2 className="text-xl font-semibold text-[#174C4F] mb-3">Evidence notes</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700">
                  Evidence level {item.evidence_level} indicates {
                    item.evidence_level === 'A' ? 'strong, consistent evidence from multiple high-quality studies' :
                    item.evidence_level === 'B' ? 'moderate evidence with some limitations or mixed results' :
                    'limited or preliminary evidence requiring more research'
                  }.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Educational, not medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}