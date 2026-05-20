import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import movies from '../data/movies'
import MovieCard from '../components/MovieCard'
import MovieModal from '../components/MovieModal'

function Home() {
  const { user } = useAuth()
  const [selectedMovie, setSelectedMovie] = useState(null)

  const topPicks = [
    movies.trending[0], movies.tvShows[0], movies.action[2],
    movies.kids[1], movies.documentary[0], movies.sports[1],
    movies.thriller[2], movies.drama[0], movies.scifi[0], movies.tvShows[3],
  ]

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Hero Video Banner */}
      <div className="relative h-[90vh] w-full overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="w-full h-full object-cover"
          poster="https://picsum.photos/seed/herostream/1920/1080"
        >
          <source src="https://cdn.coverr.co/videos/coverr-an-aerial-view-of-a-city-at-night-2559/1080p.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

        <div className="absolute bottom-[18%] left-0 px-4 sm:px-6 lg:px-8 max-w-2xl">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white leading-tight tracking-tight">
            Unlimited<br />Entertainment
          </h1>
          <p className="mt-4 text-gray-300 text-lg leading-relaxed">
            Stream thousands of movies, TV shows, sports, documentaries and more. Anytime, anywhere.
          </p>
          <div className="flex gap-4 mt-8">
            {user ? (
              <Link to="/movies" className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-semibold text-lg hover:bg-gray-200 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Start Watching
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-red-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-red-700 transition">
                  Get Started
                </Link>
                <Link to="/pricing" className="bg-white/10 backdrop-blur text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-white/20 transition border border-white/20">
                  View Plans
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Subscribe banner for non-logged-in users */}
      {!user && (
        <div className="mx-4 sm:mx-6 lg:mx-8 -mt-16 relative z-10 bg-gradient-to-r from-red-900/80 to-red-600/80 rounded-xl p-6 flex items-center justify-between mb-12 backdrop-blur-sm">
          <div>
            <h3 className="text-xl font-bold text-white">Plans starting at just ₹199/month</h3>
            <p className="text-red-100 mt-1">No ads. No commitments. Cancel anytime.</p>
          </div>
          <Link to="/pricing" className="bg-white text-red-600 px-6 py-2.5 rounded-md font-semibold hover:bg-gray-100 transition flex-shrink-0">
            Subscribe
          </Link>
        </div>
      )}

      {/* Category Quick Links */}
      <div className="px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {[
            { label: 'Movies', to: '/movies', color: 'from-red-600 to-red-800' },
            { label: 'TV Shows', to: '/tv-shows', color: 'from-purple-600 to-purple-800' },
            { label: 'Sports', to: '/sports', color: 'from-green-600 to-green-800' },
            { label: 'Kids', to: '/kids', color: 'from-yellow-500 to-yellow-700' },
            { label: 'Documentaries', to: '/documentaries', color: 'from-blue-600 to-blue-800' },
          ].map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              className={`flex-shrink-0 bg-gradient-to-br ${cat.color} px-8 py-4 rounded-lg text-white font-semibold text-sm hover:scale-105 transition-transform`}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Top 10 Picks */}
      <div className="px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Top 10 This Week</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {topPicks.slice(0, 10).map((movie, index) => (
            <div key={movie.id} className="relative cursor-pointer group" onClick={() => setSelectedMovie(movie)}>
              <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-800">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="absolute -left-2 -bottom-2 text-7xl font-extrabold text-white/10 leading-none select-none">
                {index + 1}
              </div>
              <p className="mt-2 text-sm text-gray-300 group-hover:text-white transition truncate">{movie.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Continue from where you left */}
      {user && (
        <div className="px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Continue Watching</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {movies.trending.slice(0, 4).map((movie) => (
              <div key={movie.id} className="cursor-pointer group" onClick={() => setSelectedMovie(movie)}>
                <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-800">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div className="h-full bg-red-600 rounded-r" style={{ width: `${30 + Math.random() * 60}%` }} />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-300 truncate">{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Releases */}
      <div className="px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">New Releases</h2>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {[...movies.action.slice(0, 3), ...movies.scifi.slice(0, 3)].map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
          ))}
        </div>
      </div>

      {/* Popular in each category - horizontal cards */}
      <div className="px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">Popular Right Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[movies.tvShows[0], movies.drama[2], movies.thriller[0], movies.sports[3], movies.documentary[5], movies.kids[4]].map((movie) => (
            <div key={movie.id} className="flex gap-4 bg-[#1e1e1e] rounded-lg overflow-hidden cursor-pointer hover:bg-[#2a2a2a] transition group" onClick={() => setSelectedMovie(movie)}>
              <img src={movie.image} alt={movie.title} className="w-24 h-32 object-cover flex-shrink-0" />
              <div className="py-3 pr-3 flex flex-col justify-center">
                <h3 className="text-white font-medium text-sm group-hover:text-red-400 transition">{movie.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-green-400 text-xs font-semibold">{movie.rating}</span>
                  <span className="text-gray-500 text-xs">{movie.year}</span>
                </div>
                <span className="text-gray-500 text-xs mt-1">{movie.genre} &middot; {movie.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  )
}

export default Home
