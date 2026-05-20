import { useState } from 'react'
import movies from '../data/movies'
import MovieRow from '../components/MovieRow'
import MovieModal from '../components/MovieModal'

function Sports() {
  const [selectedMovie, setSelectedMovie] = useState(null)
  const featured = movies.sports[1]

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Hero */}
      <div className="relative h-[60vh] w-full">
        <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        <div className="absolute bottom-[15%] left-0 px-4 sm:px-6 lg:px-8 max-w-xl">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded mb-3 inline-block">SPORTS</span>
          <h1 className="text-4xl font-bold text-white mb-3">{featured.title}</h1>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-green-400 font-semibold">{featured.rating}</span>
            <span className="text-gray-300">{featured.year}</span>
            <span className="text-gray-300">{featured.duration}</span>
          </div>
          <p className="text-gray-300 line-clamp-2">{featured.description}</p>
          <button onClick={() => setSelectedMovie(featured)} className="mt-4 flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-md font-semibold hover:bg-gray-200 transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            Play
          </button>
        </div>
      </div>

      <div className="pb-16">
        <MovieRow title="Sports Movies" movies={movies.sports} onMovieClick={setSelectedMovie} />
        <MovieRow title="Sports Documentaries" movies={movies.documentary.filter(d => ['Senna', 'The Last Dance', 'Free Solo'].includes(d.title))} onMovieClick={setSelectedMovie} />
        <MovieRow title="You Might Also Like" movies={movies.action} onMovieClick={setSelectedMovie} />
      </div>

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  )
}

export default Sports
