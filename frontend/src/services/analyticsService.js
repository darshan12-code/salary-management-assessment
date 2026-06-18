import api from './api'

export const analyticsService = {
  // Get analytics data
  getAnalytics: async () => {
    const response = await api.get('/api/analytics/')
    return response.data
  },
}
