import { vi } from 'vitest'

// Mock analytics data
export const mockAnalytics = {
  total_employees: 10000,
  global_payroll: 1500000000,
  average_salary_by_department: [
    { department: 'Engineering', average_salary: 180000, count: 4000, total_payroll: 720000000 },
    { department: 'HR', average_salary: 80000, count: 1500, total_payroll: 120000000 },
    { department: 'Finance', average_salary: 120000, count: 2000, total_payroll: 240000000 },
  ],
  average_salary_by_country: [
    { country: 'India', average_salary: 80000, count: 5000 },
    { country: 'USA', average_salary: 200000, count: 3000 },
    { country: 'UK', average_salary: 150000, count: 2000 },
  ],
  employees_by_department: [
    { department: 'Engineering', count: 4000, average_salary: 180000, total_payroll: 720000000 },
    { department: 'HR', count: 1500, average_salary: 80000, total_payroll: 120000000 },
    { department: 'Finance', count: 2000, average_salary: 120000, total_payroll: 240000000 },
  ],
  employees_by_country: [
    { country: 'India', count: 5000, average_salary: 80000 },
    { country: 'USA', count: 3000, average_salary: 200000 },
    { country: 'UK', count: 2000, average_salary: 150000 },
  ],
  country_analytics: [
    {
      country: 'India',
      primary_currency: 'INR',
      total_employees: 5000,
      total_payroll: 400000000,
      average_salary: 80000,
      payroll_by_department: [
        { department: 'Engineering', count: 2000, average_salary: 100000, total_payroll: 200000000 },
        { department: 'HR', count: 1000, average_salary: 60000, total_payroll: 60000000 },
        { department: 'Finance', count: 1000, average_salary: 70000, total_payroll: 70000000 },
        { department: 'Operations', count: 1000, average_salary: 70000, total_payroll: 70000000 },
      ],
      highest_paid_employees: [
        { id: 1, employee_id: 'EMP00001', name: 'John Doe', department: 'Engineering', salary: 250000, currency: 'INR', country: 'India' },
        { id: 2, employee_id: 'EMP00002', name: 'Jane Smith', department: 'Finance', salary: 230000, currency: 'INR', country: 'India' },
      ],
      lowest_paid_employees: [
        { id: 3, employee_id: 'EMP00003', name: 'Bob Johnson', department: 'HR', salary: 40000, currency: 'INR', country: 'India' },
        { id: 4, employee_id: 'EMP00004', name: 'Alice Brown', department: 'Operations', salary: 45000, currency: 'INR', country: 'India' },
      ],
    },
    {
      country: 'USA',
      primary_currency: 'USD',
      total_employees: 3000,
      total_payroll: 600000000,
      average_salary: 200000,
      payroll_by_department: [
        { department: 'Engineering', count: 1500, average_salary: 250000, total_payroll: 375000000 },
        { department: 'HR', count: 500, average_salary: 100000, total_payroll: 50000000 },
        { department: 'Finance', count: 1000, average_salary: 175000, total_payroll: 175000000 },
      ],
      highest_paid_employees: [
        { id: 5, employee_id: 'EMP00005', name: 'Mike Wilson', department: 'Engineering', salary: 300000, currency: 'USD', country: 'USA' },
        { id: 6, employee_id: 'EMP00006', name: 'Sarah Davis', department: 'Finance', salary: 280000, currency: 'USD', country: 'USA' },
      ],
      lowest_paid_employees: [
        { id: 7, employee_id: 'EMP00007', name: 'Tom Brown', department: 'HR', salary: 80000, currency: 'USD', country: 'USA' },
        { id: 8, employee_id: 'EMP00008', name: 'Lisa White', department: 'Engineering', salary: 100000, currency: 'USD', country: 'USA' },
      ],
    },
    {
      country: 'UK',
      primary_currency: 'GBP',
      total_employees: 2000,
      total_payroll: 300000000,
      average_salary: 150000,
      payroll_by_department: [
        { department: 'Engineering', count: 500, average_salary: 200000, total_payroll: 100000000 },
        { department: 'HR', count: 0, average_salary: 0, total_payroll: 0 },
        { department: 'Finance', count: 1000, average_salary: 200000, total_payroll: 200000000 },
        { department: 'Operations', count: 500, average_salary: 0, total_payroll: 0 },
      ],
      highest_paid_employees: [
        { id: 9, employee_id: 'EMP00009', name: 'James Miller', department: 'Finance', salary: 250000, currency: 'GBP', country: 'UK' },
        { id: 10, employee_id: 'EMP00010', name: 'Emma Taylor', department: 'Engineering', salary: 220000, currency: 'GBP', country: 'UK' },
      ],
      lowest_paid_employees: [
        { id: 11, employee_id: 'EMP00011', name: 'David Clark', department: 'Operations', salary: 50000, currency: 'GBP', country: 'UK' },
        { id: 12, employee_id: 'EMP00012', name: 'Olivia Lewis', department: 'Finance', salary: 80000, currency: 'GBP', country: 'UK' },
      ],
    },
  ],
}

// Mock employee data
export const mockEmployees = [
  {
    id: 1,
    employee_id: 'EMP00001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    designation: 'Software Engineer',
    country: 'USA',
    salary: 150000,
    currency: 'USD',
    joining_date: '2020-01-15',
    is_active: true,
  },
  {
    id: 2,
    employee_id: 'EMP00002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    department: 'HR',
    designation: 'HR Executive',
    country: 'UK',
    salary: 80000,
    currency: 'GBP',
    joining_date: '2019-06-20',
    is_active: true,
  },
  {
    id: 3,
    employee_id: 'EMP00003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    department: 'Finance',
    designation: 'Financial Analyst',
    country: 'India',
    salary: 60000,
    currency: 'INR',
    joining_date: '2021-03-10',
    is_active: true,
  },
]

// Mock employee details
export const mockEmployeeDetails = {
  id: 1,
  employee_id: 'EMP00001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  department: 'Engineering',
  designation: 'Software Engineer',
  country: 'USA',
  salary: 150000,
  currency: 'USD',
  joining_date: '2020-01-15',
  is_active: true,
  created_at: '2020-01-15T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// Mock salary history
export const mockSalaryHistory = [
  {
    id: 1,
    employee_id: 1,
    old_salary: 120000,
    new_salary: 150000,
    changed_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    employee_id: 1,
    old_salary: 100000,
    new_salary: 120000,
    changed_at: '2023-01-01T00:00:00Z',
  },
]

// Mock API responses
export const mockPaginatedResponse = {
  items: mockEmployees,
  page: 1,
  page_size: 10,
  total: 10000,
  total_pages: 1000,
}

// Mock successful API call
export const mockSuccessfulApiCall = (data) => {
  return vi.fn().mockResolvedValue({
    data,
    status: 200,
  })
}

// Mock failed API call
export const mockFailedApiCall = (errorMessage = 'API Error') => {
  return vi.fn().mockRejectedValue({
    response: {
      data: { detail: errorMessage },
      status: 500,
    },
  })
}
