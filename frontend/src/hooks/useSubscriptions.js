import { useState, useEffect } from 'react'
import api from '../services/api'

export function usePlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/subscriptions/plans/')
      .then(({ data }) => setPlans(data.results || data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { plans, loading }
}

export function useMySubscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSubscriptions = () => {
    api.get('/subscriptions/my/')
      .then(({ data }) => setSubscriptions(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const cancelSubscription = async (id) => {
    await api.post(`/subscriptions/${id}/cancel/`)
    fetchSubscriptions()
  }

  return { subscriptions, loading, cancelSubscription, refresh: fetchSubscriptions }
}
