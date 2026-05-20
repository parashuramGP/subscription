import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useMySubscriptions } from '../hooks/useSubscriptions'
import movies from '../data/movies'
import MovieRow from '../components/MovieRow'
import MovieModal from '../components/MovieModal'
import toast from 'react-hot-toast'

function Dashboard() {
  const { user } = useAuth()
  const { subscriptions, loading, cancelSubscription } = useMySubscriptions()
  const [selectedMovie, setSelectedMovie] = useState(null)

  const activeSub = subscriptions.find((s) => s.status === 'active')

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        await cancelSubscription(id)
        toast.success('Subscription cancelled.')
      } catch {
        toast.error('Failed to cancel subscription.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User greeting + Subscription */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Welcome, {user?.first_name || user?.username || user?.email}
          </h1>

          {loading ? (
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : activeSub ? (
            <div className="mt-6 bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">{activeSub.plan?.name} Plan</h3>
                  <span className="bg-green-600/20 text-green-400 text-xs font-medium px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  &#8377;{activeSub.plan?.price}/{activeSub.plan?.interval} &middot; Renews {new Date(activeSub.current_period_end).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleCancel(activeSub.id)}
                className="text-red-400 hover:text-red-300 text-sm font-medium border border-red-400/30 px-4 py-2 rounded hover:border-red-400/60 transition"
              >
                Cancel Plan
              </button>
            </div>
          ) : (
            <div className="mt-6 bg-[#1e1e1e] border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400">You don't have an active subscription.</p>
              <a
                href="/pricing"
                className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
              >
                Browse Plans
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Movie rows */}
      <MovieRow title="Continue Watching" movies={movies.trending.slice(0, 4)} onMovieClick={setSelectedMovie} />
      <MovieRow title="My List" movies={movies.drama.slice(0, 5)} onMovieClick={setSelectedMovie} />
      <MovieRow title="Recommended For You" movies={movies.scifi} onMovieClick={setSelectedMovie} />

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  )
}

export default Dashboard
