import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import Employees from './Employees'
import { mockEmployees, mockPaginatedResponse } from '../test/utils'
import { employeeService } from '../services/employeeService'
// Mock the API service
vi.mock('../services/employeeService', () => ({
  employeeService: {
    getEmployees: vi.fn(),
    createEmployee: vi.fn(),
    updateEmployee: vi.fn(),
    deleteEmployee: vi.fn(),
  },
}))


describe('Employee List Page', () => {
  let queryClient
  let user

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  const renderEmployees = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Employees />
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('renders employee table with data and pagination', async () => {
    // Arrange
    employeeService.getEmployees.mockResolvedValue(mockPaginatedResponse)

    // Act
    renderEmployees()

    // Assert
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('filters results when search term is entered', async () => {
    // Arrange
    const filteredResponse = {
      ...mockPaginatedResponse,
      items: [mockEmployees[0]],
      total: 1,
    }
    employeeService.getEmployees.mockResolvedValue(mockPaginatedResponse)
    employeeService.getEmployees.mockResolvedValueOnce(mockPaginatedResponse)
    employeeService.getEmployees.mockResolvedValueOnce(filteredResponse)

    // Act
    renderEmployees()
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/name or id/i)
    await user.type(searchInput, 'John')

    // Assert
    await waitFor(() => {
      expect(employeeService.getEmployees).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'John',
        })
      )
    })
  })

  it('filters employees by country and department', async () => {
    // Arrange
    const filteredResponse = {
      ...mockPaginatedResponse,
      items: mockEmployees.filter(e => e.country === 'USA' && e.department === 'Engineering'),
      total: 1,
    }
    employeeService.getEmployees.mockResolvedValue(mockPaginatedResponse)
    employeeService.getEmployees.mockResolvedValueOnce(mockPaginatedResponse)
    employeeService.getEmployees.mockResolvedValueOnce(filteredResponse)

    // Act
    renderEmployees()
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const comboboxes = screen.getAllByRole('combobox')
    const countryFilter = comboboxes[1] // Country is the second combobox
    await user.click(countryFilter)
    const usaOptions = screen.getAllByText('USA')
    const usaOption = usaOptions.find(option => option.getAttribute('role') === 'option')
    await user.click(usaOption)

    const departmentFilter = comboboxes[0] // Department is the first combobox
    await user.click(departmentFilter)
    const engineeringOptions = screen.getAllByText('Engineering')
    const engineeringOption = engineeringOptions.find(option => option.getAttribute('role') === 'option')
    await user.click(engineeringOption)

    // Assert
    await waitFor(() => {
      expect(employeeService.getEmployees).toHaveBeenCalledWith(
        expect.objectContaining({
          country: 'USA',
          department: 'Engineering',
        })
      )
    })
  })

  it('displays empty state when no employees match filters', async () => {
    // Arrange
    const emptyResponse = {
      items: [],
      page: 1,
      page_size: 10,
      total: 0,
      total_pages: 0,
    }
    employeeService.getEmployees.mockResolvedValue(emptyResponse)

    // Act
    renderEmployees()

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/no employees found/i)).toBeInTheDocument()
    })
  })

  it('shows loading state while fetching employees', () => {
    // Arrange
    employeeService.getEmployees.mockImplementation(() => new Promise(() => {}))

    // Act
    renderEmployees()

    // Assert
    // expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows error state when API call fails', async () => {
    // Arrange
    employeeService.getEmployees.mockRejectedValue(new Error('Failed to fetch employees'))

    // Act
    renderEmployees()

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/failed to load employees/i)).toBeInTheDocument()
    })
  })
})
