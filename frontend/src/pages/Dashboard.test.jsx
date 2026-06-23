import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './Dashboard'
import { mockAnalytics } from '../test/utils'
import { analyticsService } from '../services/analyticsService'
// Mock the API service
vi.mock('../services/analyticsService', () => ({
  analyticsService: {
    getAnalytics: vi.fn(),
    getTopPaidEmployees: vi.fn(),
    getLowestPaidEmployees: vi.fn(),
  },
}))


describe('Dashboard Page', () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    vi.clearAllMocks()
  })

  const renderDashboard = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    )
  }

  it('renders analytics cards with key business metrics', async () => {
    // Arrange
    analyticsService.getAnalytics.mockResolvedValue(mockAnalytics)
    analyticsService.getTopPaidEmployees.mockResolvedValue([])
    analyticsService.getLowestPaidEmployees.mockResolvedValue([])

    // Act
    renderDashboard()

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/total employees/i)).toBeInTheDocument()
      expect(screen.getByText('10000')).toBeInTheDocument()
      expect(screen.getByText(/global payroll/i)).toBeInTheDocument()
    })
  })

  it('shows loading state while fetching analytics', () => {
    // Arrange
    analyticsService.getAnalytics.mockImplementation(() => new Promise(() => {}))

    // Act
    renderDashboard()

    // Assert
    expect(document.querySelector('.MuiSkeleton-root')).toBeInTheDocument()
  })

  it('shows error state when API call fails', async () => {
    // Arrange
    analyticsService.getAnalytics.mockRejectedValue(new Error('Failed to fetch analytics'))

    // Act
    renderDashboard()

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('renders employee distribution charts for analytics', async () => {
    // Arrange
    analyticsService.getAnalytics.mockResolvedValue(mockAnalytics)
    analyticsService.getTopPaidEmployees.mockResolvedValue([])
    analyticsService.getLowestPaidEmployees.mockResolvedValue([])

    // Act
    renderDashboard()

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/global analytics overview/i)).toBeInTheDocument()
    })
  })

  it('renders country summary cards when no country selected', async () => {
    // Arrange
    analyticsService.getAnalytics.mockResolvedValue(mockAnalytics)
    analyticsService.getTopPaidEmployees.mockResolvedValue([])
    analyticsService.getLowestPaidEmployees.mockResolvedValue([])

    // Act
    renderDashboard()

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/country details/i)).toBeInTheDocument()
      expect(screen.getByText('India')).toBeInTheDocument()
      expect(screen.getByText('USA')).toBeInTheDocument()
    })
  })
})
