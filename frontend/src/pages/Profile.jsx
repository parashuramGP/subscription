import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip_code: user?.zip_code || '',
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/accounts/profile/', form)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const initial = user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white mb-8">Profile & Settings</h1>

        {/* Avatar + email */}
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
            {initial}
          </div>
          <div>
            <p className="text-white font-semibold text-lg">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username}
            </p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSubmit} className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-white mb-2">Personal Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">First Name</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} className="w-full px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} className="w-full px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" className="w-full px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-500" />
          </div>

          <h2 className="text-lg font-semibold text-white pt-2">Address</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Street Address</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="123 Main Street" className="w-full px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-500" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">City</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className="w-full px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">State</label>
              <input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" className="w-full px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">PIN Code</label>
              <input name="zip_code" value={form.zip_code} onChange={handleChange} placeholder="400001" className="w-full px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-red-600 text-white px-8 py-3 rounded font-semibold hover:bg-red-700 disabled:opacity-50 transition cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
