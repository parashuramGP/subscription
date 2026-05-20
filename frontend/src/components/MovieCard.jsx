import { useState } from 'react'

function MovieCard({ movie, onClick }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      onClick={() => onClick?.(movie)}
      className="flex-shrink-0 w-[180px] cursor-pointer group relative"
    >
      <div className="relative overflow-hidden rounded-md aspect-[2/3] bg-gray-800">
        <img
          src={imgError ? `https://placehold.co/400x600/1a1a2e/e94560?text=${encodeURIComponent(movie.title)}` : movie.image}
          alt={movie.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-400 text-xs font-semibold">{movie.rating}</span>
            <span className="text-gray-400 text-xs">{movie.year}</span>
          </div>
          <p className="text-xs text-gray-300">{movie.duration}</p>
        </div>
      </div>
      <h3 className="mt-2 text-sm text-gray-300 group-hover:text-white transition truncate">
        {movie.title}
      </h3>
    </div>
  )
}

export default MovieCard
