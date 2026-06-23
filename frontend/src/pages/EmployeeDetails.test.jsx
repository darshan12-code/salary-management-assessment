import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EmployeeDetails from './EmployeeDetails'
import { mockEmployeeDetails, mockSalaryHistory } from '../test/utils'
import { employeeService } from '../services/employeeService'
// Mock the API service
vi.mock('../services/employeeService', () => ({
  employeeService: {
    getEmployeeById: vi.fn(),
    updateEmployee: vi.fn(),
    updateSalary: vi.fn(),
    getSalaryHistory: vi.fn(),
  },
}))


describe('Employee Details Page', () => {
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

  const renderEmployeeDetails = (employeeId = '1') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/employees/${employeeId}`]}>
          <Routes>
            <Route path="/employees/:id" element={<EmployeeDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('renders employee details with complete information', async () => {
    // Arrange
    employeeService.getEmployeeById.mockResolvedValue(mockEmployeeDetails)
    employeeService.getSalaryHistory.mockResolvedValue(mockSalaryHistory)

    // Act
    renderEmployeeDetails()

    // Assert
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('EMP00001')).toBeInTheDocument()
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
      expect(screen.getByText('Engineering')).toBeInTheDocument()
      expect(screen.getByText('Software Engineer')).toBeInTheDocument()
      expect(screen.getByText('USA')).toBeInTheDocument()
    })
  })

  it('renders salary history table with change records', async () => {
    // Arrange
    employeeService.getEmployeeById.mockResolvedValue(mockEmployeeDetails)
    employeeService.getSalaryHistory.mockResolvedValue(mockSalaryHistory)

    // Act
    renderEmployeeDetails()

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/salary history/i)).toBeInTheDocument()
    })
  })

  it('opens salary update dialog when button is clicked', async () => {
    // Arrange
    employeeService.getEmployeeById.mockResolvedValue(mockEmployeeDetails)
    employeeService.getSalaryHistory.mockResolvedValue(mockSalaryHistory)

    // Act
    renderEmployeeDetails()
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const updateButton = screen.getAllByRole('button').find(btn => btn.textContent.includes('Update Salary'))
    await user.click(updateButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('submits salary update successfully and calls API', async () => {
    // Arrange
    employeeService.getEmployeeById.mockResolvedValue(mockEmployeeDetails)
    employeeService.getSalaryHistory.mockResolvedValue(mockSalaryHistory)
    employeeService.updateSalary.mockResolvedValue({ ...mockEmployeeDetails, salary: 160000 })

    // Act
    renderEmployeeDetails()
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const updateButton = screen.getAllByRole('button').find(btn => btn.textContent.includes('Update Salary'))
    await user.click(updateButton)

    const salaryInput = await screen.findByRole('spinbutton')
    await user.clear(salaryInput)
    await user.type(salaryInput, '160000')

    const submitButton = screen.getAllByRole('button').find(btn => btn.textContent.includes('Update Salary'))
    await user.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(employeeService.updateSalary).toHaveBeenCalledWith('1', 160000)
    })
  })

  it('validates salary input must be greater than 0', async () => {
    // Arrange
    employeeService.getEmployeeById.mockResolvedValue(mockEmployeeDetails)
    employeeService.getSalaryHistory.mockResolvedValue(mockSalaryHistory)

    // Act
    renderEmployeeDetails()
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const updateButton = screen.getByRole('button', { name: /update salary/i })
    await user.click(updateButton)

    const salaryInput = await screen.findByRole('spinbutton')
    await user.clear(salaryInput)
    await user.type(salaryInput, '-5000')

    const submitButton = screen.getByRole('button', { name: /update/i })
    await user.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/salary must be greater than 0/i)).toBeInTheDocument()
    })
  })

  it('closes dialog after successful salary update', async () => {
    // Arrange
    employeeService.getEmployeeById.mockResolvedValue(mockEmployeeDetails)
    employeeService.getSalaryHistory.mockResolvedValue(mockSalaryHistory)
    employeeService.updateSalary.mockResolvedValue({ ...mockEmployeeDetails, salary: 160000 })

    // Act
    renderEmployeeDetails()
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const updateButton = screen.getByRole('button', { name: /update salary/i })
    await user.click(updateButton)

    const salaryInput = await screen.findByRole('spinbutton')
    await user.clear(salaryInput)
    await user.type(salaryInput, '160000')

    const submitButton = screen.getByRole('button', { name: /update/i })
    await user.click(submitButton)

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('shows loading state while fetching employee details', () => {
    // Arrange
    employeeService.getEmployeeById.mockImplementation(() => new Promise(() => {}))

    // Act
    renderEmployeeDetails()

    // Assert
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows error state when employee fetch fails', async () => {
    // Arrange
    employeeService.getEmployeeById.mockRejectedValue(new Error('Employee not found'))

    // Act
    renderEmployeeDetails()

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('gracefully handles salary history fetch failure', async () => {
    // Arrange
    employeeService.getEmployeeById.mockResolvedValue(mockEmployeeDetails)
    employeeService.getSalaryHistory.mockRejectedValue(new Error('Failed to fetch salary history'))

    // Act
    renderEmployeeDetails()

    // Assert
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })
})
