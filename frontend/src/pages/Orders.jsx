import { useState, useEffect } from 'react'
import api from '../services/api'
import MovieModal from '../components/MovieModal'

function Orders() {
  const [history, setHistory] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('history')
  const [selectedMovie, setSelectedMovie] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/orders/history/').then(({ data }) => setHistory(data)).catch(() => {}),
      api.get('/payments/my/').then(({ data }) => setPayments(data)).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141414]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white mb-6">Activity</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1e1e1e] rounded-lg p-1 mb-8 w-fit">
          <button
            onClick={() => setTab('history')}
            className={`px-5 py-2 rounded-md text-sm font-medium transition ${tab === 'history' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Watch History
          </button>
          <button
            onClick={() => setTab('payments')}
            className={`px-5 py-2 rounded-md text-sm font-medium transition ${tab === 'payments' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Payments
          </button>
        </div>

        {/* Watch History */}
        {tab === 'history' && (
          history.length === 0 ? (
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-10 text-center">
              <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-400">No watch history yet. Start watching something!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMovie(item.movie)}
                  className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-[#2a2a2a] transition group"
                >
                  <img
                    src={item.movie?.image}
                    alt={item.movie?.title}
                    className="w-20 h-28 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium group-hover:text-red-400 transition">{item.movie?.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-green-400 text-xs font-semibold">{item.movie?.rating}</span>
                      <span className="text-gray-500 text-xs">{item.movie?.year}</span>
                      <span className="text-gray-500 text-xs">{item.movie?.genre}</span>
                      <span className="text-gray-500 text-xs">{item.movie?.duration}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2 line-clamp-1">{item.movie?.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gray-500 text-xs">{new Date(item.watched_at).toLocaleDateString()}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{new Date(item.watched_at).toLocaleTimeString()}</p>
                    {item.watch_count > 1 && (
                      <span className="text-xs text-gray-500 mt-1 inline-block">Watched {item.watch_count}x</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Payments */}
        {tab === 'payments' && (
          payments.length === 0 ? (
            <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-10 text-center">
              <p className="text-gray-400">No payments yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">{p.plan?.name} Plan</p>
                      <p className="text-gray-500 text-sm">
                        {p.card_type?.toUpperCase()} ending in {p.card_last4} &middot; {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">&#8377;{p.amount}</p>
                    <span className="text-green-400 text-xs">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  )
}

export default Orders
