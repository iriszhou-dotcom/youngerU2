import { useState, useEffect } from 'react'
import { Plus, Flame, Calendar, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toast'

interface Habit {
  id: number
  title: string
  schedule: any
  reminder_time: string | null
  created_at: string
}

interface HabitLog {
  id: number
  habit_id: number
  date: string
  done: boolean
}

export default function Habits() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newHabit, setNewHabit] = useState({
    title: '',
    schedule: { type: 'daily' },
    reminder_time: ''
  })

  useEffect(() => {
    if (user) {
      fetchHabits()
      fetchHabitLogs()
    }
  }, [user])

  const fetchHabits = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setHabits(data || [])
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHabitLogs = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setHabitLogs(data || [])
    } catch (error) {
      console.error('Error fetching habit logs:', error)
    }
  }

  const createHabit = async () => {
    if (!newHabit.title.trim()) return
    
    if (!user) {
      showToast('Sign up to save habits permanently!', 'info')
      // Add to local state for demo
      const demoHabit = {
        id: Date.now(),
        title: newHabit.title,
        schedule: newHabit.schedule,
        reminder_time: newHabit.reminder_time || null,
        created_at: new Date().toISOString()
      }
      setHabits(prev => [demoHabit, ...prev])
      setShowCreateModal(false)
      setNewHabit({ title: '', schedule: { type: 'daily' }, reminder_time: '' })
      return
    }

    try {
      const { error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          title: newHabit.title,
          schedule: newHabit.schedule,
          reminder_time: newHabit.reminder_time || null
        })

      if (error) throw error

      showToast('Habit created successfully!', 'success')
      setShowCreateModal(false)
      setNewHabit({ title: '', schedule: { type: 'daily' }, reminder_time: '' })
      fetchHabits()
    } catch (error) {
      console.error('Error creating habit:', error)
      showToast('Failed to create habit', 'error')
    }
  }

  const toggleHabitToday = async (habitId: number) => {
    if (!user) return

    const today = new Date().toISOString().split('T')[0]
    const existingLog = habitLogs.find(log => 
      log.habit_id === habitId && log.date === today
    )

    try {
      if (existingLog) {
        // Update existing log
        const { error } = await supabase
          .from('habit_logs')
          .update({ done: !existingLog.done })
          .eq('id', existingLog.id)

        if (error) throw error
      } else {
        // Create new log
        const { error } = await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            date: today,
            done: true
          })

        if (error) throw error
      }

      fetchHabitLogs()
      showToast('Habit updated!', 'success')
    } catch (error) {
      console.error('Error updating habit log:', error)
      showToast('Failed to update habit', 'error')
    }
  }

  const getStreak = (habitId: number) => {
    const logs = habitLogs
      .filter(log => log.habit_id === habitId && log.done)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < logs.length; i++) {
      const logDate = new Date(logs[i].date)
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      
      if (logDate.toDateString() === expectedDate.toDateString()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const isHabitDoneToday = (habitId: number) => {
    const today = new Date().toISOString().split('T')[0]
    const todayLog = habitLogs.find(log => 
      log.habit_id === habitId && log.date === today
    )
    return todayLog?.done || false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7ED957]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7F8] to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#174C4F] mb-6">
            Habit Builder & Streak Tracker
          </h1>
          <p className="text-xl text-gray-600">
            Small, consistent steps beat all-or-nothing.
          </p>
        </div>

        {/* Create Habit Button */}
        <div className="mb-12">
          <button
            onClick={() => setShowCreateModal(true)}
            data-track="habit_create"
            className="bg-[#7ED957] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#6BC847] flex items-center gap-3 transition-all duration-200 hover-lift shadow-lg text-lg"
          >
            <Plus className="w-5 h-5" />
            Create Habit
          </button>
        </div>

        {/* Habits List */}
        {habits.length > 0 ? (
          <div className="space-y-6">
            {habits.map(habit => (
              <div key={habit.id} className="bg-white rounded-3xl shadow-soft p-8 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => toggleHabitToday(habit.id)}
                      className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 hover-lift ${
                        isHabitDoneToday(habit.id)
                          ? 'bg-[#7ED957] border-[#7ED957] text-white'
                          : 'border-gray-300 hover:border-[#7ED957] hover:bg-[#7ED957]/10'
                      }`}
                    >
                      {isHabitDoneToday(habit.id) && <Check className="w-6 h-6" />}
                    </button>
                    
                    <div>
                      <h3 className="text-xl font-bold text-[#174C4F] group-hover:text-[#7ED957] transition-colors">{habit.title}</h3>
                      {habit.reminder_time && (
                        <p className="text-base text-gray-500 mt-1">Reminder: {habit.reminder_time}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-2xl">
                      <Flame className="w-6 h-6 text-orange-500" />
                      <span className="text-xl font-bold text-orange-500">
                        {getStreak(habit.id)}
                      </span>
                    </div>
                    
                    <Calendar className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-[#174C4F]/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Plus className="w-12 h-12 text-[#174C4F]/60" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Create your first habit
            </h3>
            <p className="text-lg text-gray-500 mb-8">
              Start building healthy routines that stick.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#7ED957] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#6BC847] transition-all duration-200 hover-lift shadow-lg text-lg"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Create Habit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-[#174C4F] mb-8">
                Create New Habit
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-semibold text-[#174C4F] mb-3">
                    Habit Title
                  </label>
                  <input
                    type="text"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Take Vitamin D"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-base"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-[#174C4F] mb-3">
                    Reminder Time (optional)
                  </label>
                  <input
                    type="time"
                    value={newHabit.reminder_time}
                    onChange={(e) => setNewHabit(prev => ({ ...prev, reminder_time: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-[#7ED957] text-base"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={createHabit}
                  disabled={!newHabit.title.trim()}
                  className="flex-1 px-6 py-3 bg-[#7ED957] text-white rounded-xl hover:bg-[#6BC847] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  Create Habit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}