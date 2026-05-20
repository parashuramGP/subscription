import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm transition ${isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'}`

  const initial = user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-red-600 tracking-wider flex-shrink-0">
              STREAMIFY
            </Link>

            <div className="hidden md:flex items-center gap-5">
              <NavLink to="/" end className={navLinkClass}>Home</NavLink>
              <NavLink to="/movies" className={navLinkClass}>Movies</NavLink>
              <NavLink to="/tv-shows" className={navLinkClass}>TV Shows</NavLink>
              <NavLink to="/sports" className={navLinkClass}>Sports</NavLink>
              <NavLink to="/kids" className={navLinkClass}>Kids</NavLink>
              <NavLink to="/documentaries" className={navLinkClass}>Documentaries</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded bg-red-600 flex items-center justify-center text-white font-semibold text-sm hover:bg-red-700 transition"
                >
                  {initial}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-white font-medium text-sm">{user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        My Account
                      </Link>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Profile & Settings
                      </Link>
                      <Link to="/my-plans" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        My Plans
                      </Link>
                      <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        Payments
                      </Link>
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-gray-700 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition w-full text-left"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white text-sm transition">
                  Sign In
                </Link>
                <Link to="/register" className="text-gray-300 hover:text-white text-sm transition">
                  Sign Up
                </Link>
              </>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-black/95 border-t border-gray-800 py-4 space-y-3">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className={navLinkClass}><span className="block px-2 py-1">Home</span></NavLink>
            <NavLink to="/movies" onClick={() => setMenuOpen(false)} className={navLinkClass}><span className="block px-2 py-1">Movies</span></NavLink>
            <NavLink to="/tv-shows" onClick={() => setMenuOpen(false)} className={navLinkClass}><span className="block px-2 py-1">TV Shows</span></NavLink>
            <NavLink to="/sports" onClick={() => setMenuOpen(false)} className={navLinkClass}><span className="block px-2 py-1">Sports</span></NavLink>
            <NavLink to="/kids" onClick={() => setMenuOpen(false)} className={navLinkClass}><span className="block px-2 py-1">Kids</span></NavLink>
            <NavLink to="/documentaries" onClick={() => setMenuOpen(false)} className={navLinkClass}><span className="block px-2 py-1">Documentaries</span></NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
