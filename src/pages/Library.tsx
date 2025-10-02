import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Plus } from 'lucide-react'
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

export default function Library() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<LibraryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const filterOptions = [
    'Energy', 'Focus', 'Recovery', 'Vegan', 'Sleep', 'Evidence A', 'Evidence B', 'Evidence C'
  ]

  useEffect(() => {
    fetchLibraryItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, searchTerm, selectedFilters])

  const fetchLibraryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching library items:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = items

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category and evidence filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(item => {
        return selectedFilters.some(filter => {
          if (filter.startsWith('Evidence ')) {
            return item.evidence_level === filter.split(' ')[1]
          }
          return item.tags.includes(filter) || item.category === filter
        })
      })
    }

    setFilteredItems(filtered)
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7F8] to-white">
      {/* Header Section */}
      <div className="relative bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#174C4F] mb-6 leading-tight">
                Science-Backed Recommendation Library
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Evidence, explained in plain English.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Evidence A', 'Evidence B', 'Evidence C'].map(level => (
                  <span key={level} className="px-4 py-2 bg-[#F5F7F8] rounded-full text-sm font-medium text-[#174C4F]">
                    {level}
                  </span>
                ))}
              </div>
            </div>
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
              <img 
                src="https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Clean flat-lay of supplement bottles on a neutral background"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-3xl shadow-soft p-8 mb-12 -mt-8 relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search supplements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-base"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {filterOptions.map(filter => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 font-medium ${
                  selectedFilters.includes(filter)
                    ? 'bg-[#7ED957] text-white border-[#7ED957]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#7ED957] hover-lift'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="pb-24">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-3xl shadow-soft p-8 hover:shadow-xl transition-all duration-300 hover-lift group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-[#174C4F] text-xl group-hover:text-[#7ED957] transition-colors">{item.title}</h3>
                  <span className={`px-3 py-1 text-sm font-bold rounded-full ${getEvidenceBadgeColor(item.evidence_level)}`}>
                    {item.evidence_level}
                  </span>
                </div>
                
                <p className="text-base text-gray-600 mb-4 font-medium">{item.category}</p>
                <p className="text-base text-gray-700 mb-6 line-clamp-3 leading-relaxed">{item.summary}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <Link
                    to={`/library/${item.slug}`}
                    className="text-base text-[#7ED957] hover:text-[#6BC847] font-semibold transition-colors"
                  >
                    Learn more →
                  </Link>
                  <button className="text-base text-[#7ED957] hover:text-[#6BC847] font-semibold flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add to Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No items found
            </h3>
            <p className="text-lg text-gray-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}