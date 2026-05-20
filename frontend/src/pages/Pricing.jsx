import { usePlans } from '../hooks/useSubscriptions'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function Pricing() {
  const { plans, loading } = usePlans()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubscribe = (plan) => {
    if (!user) {
      toast.error('Please sign in first!')
      navigate('/login')
      return
    }
    navigate('/payment', { state: { plan } })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141414]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Choose Your Plan</h1>
          <p className="mt-3 text-gray-400 text-lg">Watch unlimited movies and shows. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-[#1e1e1e] rounded-xl p-8 flex flex-col h-full border border-gray-800 hover:border-red-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-600/10"
            >
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-2 text-sm text-gray-400">{plan.description}</p>

              <div className="mt-6">
                <span className="text-4xl font-bold text-white">&#8377;{plan.price}</span>
                <span className="text-gray-500 text-sm">/{plan.interval}</span>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {plan.features?.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="h-5 w-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                className="mt-8 w-full py-3 px-4 rounded-md font-semibold transition cursor-pointer bg-red-600 text-white hover:bg-red-700"
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing
