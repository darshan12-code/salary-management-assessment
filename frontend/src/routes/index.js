import Dashboard from '../pages/Dashboard'
import Employees from '../pages/Employees'
import EmployeeDetails from '../pages/EmployeeDetails'
import NotFound from '../pages/NotFound'

const routes = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/employees',
    element: <Employees />,
  },
  {
    path: '/employees/:id',
    element: <EmployeeDetails />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export default routes
