import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

function MovieModal({ movie, onClose }) {
  const [imgError, setImgError] = useState(false)
  const [playing, setPlaying] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!movie) return null

  const handlePlay = async () => {
    if (!user) {
      toast.error('Please sign in to watch!')
      onClose()
      navigate('/login')
      return
    }

    try {
      await api.post('/orders/watch/', { movie })
      setPlaying(true)
      toast.success(`Now playing ${movie.title}`)
    } catch {
      toast.error('Failed to play. Try again.')
    }
  }

  const handleClose = () => {
    setPlaying(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#181818] rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner / Player */}
        <div className="relative h-72">
          {playing ? (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p className="text-white text-lg font-semibold">{movie.title}</p>
                <p className="text-gray-400 text-sm mt-1">Now Playing...</p>
                <div className="mt-4 w-64 mx-auto h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full animate-[progress_8s_linear_infinite]" style={{ width: '0%', animation: 'progress 8s linear forwards' }} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <img
                src={imgError ? `https://placehold.co/800x400/1a1a2e/e94560?text=${encodeURIComponent(movie.title)}` : movie.image}
                alt={movie.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
            </>
          )}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 bg-black/60 rounded-full p-2 hover:bg-black/80 transition z-10"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {!playing && (
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl font-bold text-white">{movie.title}</h2>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-green-400 font-semibold">{movie.rating} Rating</span>
            <span className="text-gray-400">{movie.year}</span>
            <span className="text-gray-400">{movie.duration}</span>
            <span className="border border-gray-600 text-gray-400 text-xs px-2 py-0.5 rounded">
              {movie.genre}
            </span>
          </div>
          <p className="text-gray-300 leading-relaxed">{movie.description}</p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handlePlay}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold transition ${
                playing
                  ? 'bg-gray-600 text-white cursor-default'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
              disabled={playing}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {playing ? 'Playing...' : 'Play'}
            </button>
            <button className="flex items-center gap-2 bg-gray-600/50 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-gray-600/70 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              My List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal
