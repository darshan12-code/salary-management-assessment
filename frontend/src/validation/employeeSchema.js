import { z } from 'zod'

export const employeeSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  department: z.enum(['Engineering', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations'], {
    required_error: 'Department is required',
  }),
  designation: z.string().min(1, 'Designation is required'),
  country: z.enum(['India', 'USA', 'UK', 'Germany', 'Canada', 'Australia'], {
    required_error: 'Country is required',
  }),
  salary: z.coerce.number().min(0.01, 'Salary must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  joining_date: z.string().min(1, 'Joining date is required'),
  is_active: z.boolean().default(true),
})

export const COUNTRY_CURRENCY_MAP = {
  India: 'INR',
  USA: 'USD',
  UK: 'GBP',
  Germany: 'EUR',
  Canada: 'CAD',
  Australia: 'AUD',
}

export const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations']
export const COUNTRIES = ['India', 'USA', 'UK', 'Germany', 'Canada', 'Australia']

export const salaryUpdateSchema = z.object({
  salary: z.coerce.number().min(0.01, 'Salary must be greater than 0'),
})
