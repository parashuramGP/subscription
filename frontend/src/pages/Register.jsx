import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function Register() {
  const [form, setForm] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password_confirm) {
      toast.error('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4 pt-16 pb-12">
      <div className="w-full max-w-md bg-black/70 rounded-lg p-10">
        <h2 className="text-3xl font-bold text-white mb-8">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="First name"
              className="w-full px-4 py-3.5 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-400"
            />
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full px-4 py-3.5 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-400"
            />
          </div>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full px-4 py-3.5 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="w-full px-4 py-3.5 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={8}
            className="w-full px-4 py-3.5 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-400"
          />
          <input
            type="password"
            name="password_confirm"
            value={form.password_confirm}
            onChange={handleChange}
            placeholder="Confirm password"
            required
            minLength={8}
            className="w-full px-4 py-3.5 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3.5 rounded font-semibold hover:bg-red-700 disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
