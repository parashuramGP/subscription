import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

function Payment() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const plan = location.state?.plan

  const [form, setForm] = useState({ card_number: '', card_name: '', expiry: '', cvv: '' })
  const [cardType, setCardType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const [savedCards, setSavedCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [cardsLoading, setCardsLoading] = useState(true)

  useEffect(() => {
    if (!plan) navigate('/pricing')
    if (!user) { toast.error('Please login first!'); navigate('/login') }
  }, [plan, user, navigate])

  useEffect(() => {
    api.get('/payments/cards/')
      .then(({ data }) => setSavedCards(data))
      .catch(() => {})
      .finally(() => setCardsLoading(false))
  }, [])

  const detectCardType = (number) => {
    const c = number.replace(/\s/g, '')
    if (/^4/.test(c)) return 'visa'
    if (/^5[1-5]/.test(c) || /^2[2-7]/.test(c)) return 'mastercard'
    if (/^3[47]/.test(c)) return 'amex'
    if (/^6(?:011|5)/.test(c)) return 'discover'
    if (/^(?:60|65|81|82)/.test(c)) return 'rupay'
    return null
  }

  const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v) => { const c = v.replace(/\D/g, '').slice(0, 4); return c.length >= 3 ? c.slice(0, 2) + '/' + c.slice(2) : c }

  const handleChange = (e) => {
    let { name, value } = e.target
    if (name === 'card_number') { value = formatCardNumber(value); setCardType(detectCardType(value)) }
    if (name === 'expiry') value = formatExpiry(value)
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4)
    setForm({ ...form, [name]: value })
    setSelectedCard(null)
  }

  const handleSelectCard = (card) => {
    setSelectedCard(card)
    setForm({ card_number: `**** **** **** ${card.card_last4}`, card_name: card.card_name, expiry: card.expiry, cvv: '' })
    setCardType(card.card_type)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCard && form.cvv.length < 3) return toast.error('Enter a valid CVV.')
    if (!selectedCard) {
      const cardNum = form.card_number.replace(/\s/g, '')
      if (cardNum.length < 13) return toast.error('Enter a valid card number.')
      if (!form.card_name.trim()) return toast.error('Enter cardholder name.')
      if (form.expiry.length < 5) return toast.error('Enter a valid expiry date.')
    }
    if (selectedCard && form.cvv.length < 3) return toast.error('Enter CVV to confirm payment.')

    setLoading(true)
    try {
      const cardNum = selectedCard ? `****${selectedCard.card_last4}` : form.card_number.replace(/\s/g, '')
      const { data } = await api.post('/payments/pay/', {
        plan_id: plan.id,
        card_last4: selectedCard ? selectedCard.card_last4 : cardNum.slice(-4),
        card_type: selectedCard ? selectedCard.card_type : (cardType || 'card'),
        card_name: selectedCard ? selectedCard.card_name : form.card_name,
        expiry: selectedCard ? selectedCard.expiry : form.expiry,
        save_card: saveCard,
      })
      toast.success(data.message)
      navigate('/success')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed.')
    } finally {
      setLoading(false)
    }
  }

  const CardTypeBadge = ({ type, size = 'sm' }) => {
    const cls = size === 'sm' ? 'h-5 w-8' : 'h-6 w-9'
    if (type === 'visa') return <svg viewBox="0 0 36 24" className={cls}><rect width="36" height="24" rx="3" fill="#1A1F71" /><text x="18" y="15" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">VISA</text></svg>
    if (type === 'mastercard') return <svg viewBox="0 0 36 24" className={cls}><rect width="36" height="24" rx="3" fill="#252525" /><circle cx="14" cy="12" r="6" fill="#EB001B" /><circle cx="22" cy="12" r="6" fill="#F79E1B" /></svg>
    if (type === 'rupay') return <svg viewBox="0 0 36 24" className={cls}><rect width="36" height="24" rx="3" fill="#097A44" /><text x="18" y="15" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">RuPay</text></svg>
    if (type === 'amex') return <svg viewBox="0 0 36 24" className={cls}><rect width="36" height="24" rx="3" fill="#2E77BC" /><text x="18" y="15" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="Arial">AMEX</text></svg>
    return <svg viewBox="0 0 36 24" className={cls}><rect width="36" height="24" rx="3" fill="#555" /><text x="18" y="15" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">CARD</text></svg>
  }

  if (!plan) return null

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-lg">
        {/* Order Summary */}
        <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-400 uppercase">Order Summary</h3>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">{plan.name} Plan</p>
              <p className="text-sm text-gray-500">{plan.interval} subscription</p>
            </div>
            <p className="text-2xl font-bold text-white">&#8377;{plan.price}</p>
          </div>
        </div>

        {/* Saved Cards */}
        {!cardsLoading && savedCards.length > 0 && (
          <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 p-6 mb-6">
            <h3 className="text-sm font-medium text-gray-400 uppercase mb-4">Saved Cards</h3>
            <div className="space-y-3">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleSelectCard(card)}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition border ${
                    selectedCard?.id === card.id
                      ? 'border-red-500 bg-red-600/10'
                      : 'border-gray-700 hover:border-gray-600 bg-[#2a2a2a]'
                  }`}
                >
                  <CardTypeBadge type={card.card_type} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">**** **** **** {card.card_last4}</p>
                    <p className="text-gray-500 text-xs">{card.card_name} &middot; Exp {card.expiry}</p>
                  </div>
                  {selectedCard?.id === card.id && (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}

              <button
                onClick={() => { setSelectedCard(null); setForm({ card_number: '', card_name: '', expiry: '', cvv: '' }); setCardType(null) }}
                className={`w-full p-3 rounded-lg border border-dashed text-sm transition ${
                  !selectedCard
                    ? 'border-red-500 text-red-400 bg-red-600/5'
                    : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                }`}
              >
                + Use a new card
              </button>
            </div>

            {/* CVV for saved card */}
            {selectedCard && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Enter CVV to confirm</label>
                <input
                  type="password"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  onFocus={() => {}}
                  onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); setForm({ ...form, cvv: e.target.value }) }}
                  placeholder="***"
                  required
                  className="w-32 px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-500"
                />
              </div>
            )}
          </div>
        )}

        {/* New Card Form */}
        {!selectedCard && (
          <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {savedCards.length > 0 ? 'New Card' : 'Payment Details'}
              </h2>
              <div className="flex items-center gap-2">
                {['visa', 'mastercard', 'rupay', 'amex'].map((type) => (
                  <div key={type} className={`transition ${cardType === type ? 'opacity-100 scale-110' : cardType ? 'opacity-30' : 'opacity-60'}`}>
                    <CardTypeBadge type={type} size="lg" />
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
                <div className="relative">
                  <input type="text" name="card_number" value={form.card_number} onChange={handleChange} placeholder="1234 5678 9012 3456" required className="w-full px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none pr-14 text-lg tracking-wider placeholder-gray-500" />
                  {cardType && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CardTypeBadge type={cardType} size="lg" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Cardholder Name</label>
                <input type="text" name="card_name" value={form.card_name} onChange={handleChange} placeholder="John Doe" required className="w-full px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                  <input type="text" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" required className="w-full px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">CVV</label>
                  <input type="password" name="cvv" value={form.cvv} onChange={handleChange} placeholder="***" required className="w-full px-4 py-3 bg-[#333] text-white rounded border border-gray-600 focus:border-red-500 outline-none placeholder-gray-500" />
                </div>
              </div>

              {/* Save card checkbox */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setSaveCard(!saveCard)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                    saveCard ? 'bg-red-600 border-red-600' : 'border-gray-500 group-hover:border-gray-400'
                  }`}
                >
                  {saveCard && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300">Save this card for future payments</span>
              </label>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {saveCard ? 'Card will be saved securely without CVV' : 'Your payment is secure and encrypted'}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded font-semibold text-lg hover:bg-red-700 disabled:opacity-50 transition cursor-pointer">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Processing...
                  </span>
                ) : `Pay ₹${plan.price}`}
              </button>
            </form>
          </div>
        )}

        {/* Pay button for saved card */}
        {selectedCard && (
          <button
            onClick={handleSubmit}
            disabled={loading || form.cvv.length < 3}
            className="w-full bg-red-600 text-white py-4 rounded font-semibold text-lg hover:bg-red-700 disabled:opacity-50 transition cursor-pointer mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Processing...
              </span>
            ) : `Pay ₹${plan.price}`}
          </button>
        )}
      </div>
    </div>
  )
}

export default Payment
