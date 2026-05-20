import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function PlanCard({ plan, featured = false }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubscribe = () => {
    if (!user) {
      toast.error('Please login first!')
      navigate('/login')
      return
    }
    navigate('/payment', { state: { plan } })
  }

  return (
    <div
      className={`rounded-2xl p-8 flex flex-col h-full ${
        featured
          ? 'bg-primary-600 text-white ring-4 ring-primary-600'
          : 'bg-white text-gray-900 ring-1 ring-gray-200'
      }`}
    >
      {featured && (
        <span className="self-start bg-white text-primary-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
          MOST POPULAR
        </span>
      )}

      <h3 className="text-xl font-semibold">{plan.name}</h3>
      <p className={`mt-2 text-sm ${featured ? 'text-primary-100' : 'text-gray-500'}`}>
        {plan.description}
      </p>

      <div className="mt-6">
        <span className="text-4xl font-bold">&#8377;{plan.price}</span>
        <span className={`text-sm ${featured ? 'text-primary-200' : 'text-gray-500'}`}>
          /{plan.interval}
        </span>
      </div>

      <ul className="mt-8 space-y-3 flex-1">
        {plan.features?.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
        onClick={handleSubscribe}
        className={`mt-8 w-full py-3 px-4 rounded-lg font-medium transition cursor-pointer ${
          featured
            ? 'bg-white text-primary-600 hover:bg-primary-50'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
      >
        Subscribe
      </button>
    </div>
  )
}

export default PlanCard
