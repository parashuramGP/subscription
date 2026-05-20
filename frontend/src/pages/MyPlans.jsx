import { useMySubscriptions } from '../hooks/useSubscriptions'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

function MyPlans() {
  const { subscriptions, loading, cancelSubscription } = useMySubscriptions()

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        await cancelSubscription(id)
        toast.success('Subscription cancelled.')
      } catch {
        toast.error('Failed to cancel.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">My Plans</h1>
          <Link to="/pricing" className="text-red-500 hover:text-red-400 text-sm font-medium transition">
            Browse Plans
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-10 text-center">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400 mb-4">You don't have any subscriptions yet.</p>
            <Link to="/pricing" className="bg-red-600 text-white px-6 py-2.5 rounded font-semibold hover:bg-red-700 transition">
              Choose a Plan
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{sub.plan?.name} Plan</h3>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        sub.status === 'active' ? 'bg-green-600/20 text-green-400' :
                        sub.status === 'cancelled' ? 'bg-red-600/20 text-red-400' :
                        'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">&#8377;{sub.plan?.price} / {sub.plan?.interval}</p>
                  </div>
                  <p className="text-2xl font-bold text-white">&#8377;{sub.plan?.price}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Started</p>
                    <p className="text-gray-300">{new Date(sub.current_period_start).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Renews on</p>
                    <p className="text-gray-300">{new Date(sub.current_period_end).toLocaleDateString()}</p>
                  </div>
                </div>

                {sub.plan?.features && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-gray-500 text-xs uppercase mb-2">Includes</p>
                    <div className="flex flex-wrap gap-2">
                      {sub.plan.features.map((f, i) => (
                        <span key={i} className="text-xs text-gray-400 bg-gray-800 px-2.5 py-1 rounded">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {sub.status === 'active' && (
                  <div className="mt-4 pt-4 border-t border-gray-800 flex gap-3">
                    <Link to="/pricing" className="text-sm text-gray-400 hover:text-white transition">
                      Change Plan
                    </Link>
                    <button onClick={() => handleCancel(sub.id)} className="text-sm text-red-400 hover:text-red-300 transition">
                      Cancel Subscription
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPlans
