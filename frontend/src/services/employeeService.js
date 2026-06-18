import api from './api'

export const employeeService = {
  // Get all employees with pagination and filters
  getEmployees: async (params = {}) => {
    const response = await api.get('/api/employees/', { params })
    return response.data
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    const response = await api.get(`/api/employees/${id}`)
    return response.data
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    const response = await api.post('/api/employees/', employeeData)
    return response.data
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/api/employees/${id}`, employeeData)
    return response.data
  },

  // Update employee salary
  updateSalary: async (id, salary) => {
    const response = await api.put(`/api/employees/${id}/salary`, { salary })
    return response.data
  },

  // Get employee salary history
  getSalaryHistory: async (id) => {
    const response = await api.get(`/api/employees/${id}/salary-history`)
    return response.data
  },
}
