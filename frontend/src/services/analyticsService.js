import api from './api.js'

export const analyticsService = {
  // Get analytics data
  getAnalytics: async () => {
    const response = await api.get('/api/analytics/')
    return response.data
  },

  // Get top paid employees
  getTopPaidEmployees: async (limit = 10, country = null) => {
    const params = { limit }
    if (country) params.country = country
    const response = await api.get('/api/analytics/top-paid', { params })
    return response.data
  },

  // Get lowest paid employees
  getLowestPaidEmployees: async (limit = 10, country = null) => {
    const params = { limit }
    if (country) params.country = country
    const response = await api.get('/api/analytics/lowest-paid', { params })
    return response.data
  },
}
