import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navLinks = [
    { name: 'Planner', href: '/planner' },
    { name: 'Library', href: '/library' },
    { name: 'Habits', href: '/habits' },
    { name: 'Forecast', href: '/forecast' },
    { name: 'Safety', href: '/safety' },
    { name: 'Community', href: '/community' },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <nav className="bg-white/90 backdrop-blur-glass border-b border-gray-100 sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#174C4F] tracking-tight hover:opacity-80 transition-opacity">
              YoungerU
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-all duration-200 relative py-2 ${
                  isActive(link.href)
                    ? 'text-[#174C4F]'
                    : 'text-gray-600 hover:text-[#174C4F]'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7ED957] rounded-full" />
                )}
              </Link>
            ))}
            <Link
              to="/app"
              className={`text-sm font-medium transition-all duration-200 relative py-2 ${
                isActive('/app')
                  ? 'text-[#174C4F]'
                  : 'text-gray-600 hover:text-[#174C4F]'
              }`}
            >
              Full App
              {isActive('/app') && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7ED957] rounded-full" />
              )}
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-[#174C4F] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/auth/sign-in"
                  className="text-sm font-medium text-gray-600 hover:text-[#174C4F] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/sign-up"
                  className="bg-[#7ED957] text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-[#6BC847] transition-all duration-200 hover-lift shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-[#174C4F] transition-colors p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-glass border-t border-gray-100">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive(link.href)
                    ? 'text-[#174C4F] bg-[#F5F7F8]'
                    : 'text-gray-600 hover:text-[#174C4F] hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Auth */}
            <div className="border-t border-gray-100 pt-6 mt-6">
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-gray-600">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-gray-600 hover:text-[#174C4F] hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/auth/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-[#174C4F] hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/sign-up"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-base font-medium bg-[#7ED957] text-white rounded-xl hover:bg-[#6BC847] transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}