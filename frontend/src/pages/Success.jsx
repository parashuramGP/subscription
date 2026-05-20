import { Link } from 'react-router-dom'

function Success() {
  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white">Welcome to Streamify!</h1>
        <p className="mt-3 text-gray-400 text-lg">
          Your subscription is active. Enjoy unlimited movies and shows!
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            to="/"
            className="bg-red-600 text-white px-8 py-3 rounded font-semibold hover:bg-red-700 transition"
          >
            Start Watching
          </Link>
          <Link
            to="/dashboard"
            className="bg-gray-700 text-white px-8 py-3 rounded font-semibold hover:bg-gray-600 transition"
          >
            My Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Success
