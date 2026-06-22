# Salary Management System

A modern, full-stack salary management application built with FastAPI (backend) and React (frontend). The system provides comprehensive employee management, salary tracking, analytics, and multi-currency support.

## Project Overview

The Salary Management System is designed to help organizations manage employee salaries across different countries and currencies. It features a responsive dashboard, employee CRUD operations, salary history tracking, and advanced analytics for payroll insights.

## Features

### Core Features
- **Employee Management**: Create, read, update, and delete employee records
- **Salary Tracking**: Track salary changes over time with complete history
- **Multi-Currency Support**: Handle salaries in multiple currencies (USD, INR, GBP, EUR, etc.)
- **Country-Based Analytics**: View payroll analytics aggregated by country
- **Department Analytics**: Analyze salary distribution across departments
- **Responsive Design**: Fully responsive UI that works on mobile, tablet, and desktop
- **Real-time Updates**: Optimistic UI updates with automatic refetching

### Dashboard Features
- Global KPIs (Total Employees, Total Countries, Global Payroll)
- Country-specific analytics with payroll breakdown
- Top 10 highest and lowest paid employees per country
- Interactive charts for salary distribution
- Country selection for detailed views

### Employee Management Features
- Advanced filtering (search, department, country)
- Server-side pagination for large datasets
- Inline editing with modal dialogs
- Salary update functionality
- Employee status management (Active/Inactive)

## Architecture Overview

The application follows a clean architecture pattern with clear separation of concerns:

### Backend Architecture
- **FastAPI**: Modern, fast Python web framework for building APIs
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation and serialization
- **Repository Pattern**: Data access layer abstraction
- **Service Layer**: Business logic separation
- **Dependency Injection**: Clean dependency management

### Frontend Architecture
- **React**: Modern UI library for building user interfaces
- **Material UI (MUI)**: Component library for consistent design
- **TanStack Query**: Data fetching and caching
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

## Backend Structure

```
backend/
├── app/
│   ├── api/                 # API endpoints and routing
│   │   ├── employees.py     # Employee CRUD endpoints
│   │   ├── analytics.py     # Analytics endpoints
│   │   ├── dependencies.py  # Dependency injection
│   │   └── exception_handlers.py  # Global exception handlers
│   ├── core/                # Core configuration
│   │   ├── config.py        # Application settings
│   │   └── exceptions.py    # Custom exceptions
│   ├── database/            # Database configuration
│   │   └── session.py       # Database session management
│   ├── models/              # SQLAlchemy models
│   │   ├── base.py          # Base model with common fields
│   │   ├── employee.py      # Employee model
│   │   └── salary_history.py # Salary history model
│   ├── repositories/        # Data access layer
│   │   ├── employee_repository.py
│   │   └── salary_history_repository.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── employee.py      # Employee schemas
│   │   ├── analytics.py    # Analytics schemas
│   │   ├── salary.py        # Salary schemas
│   │   └── common.py        # Common schemas
│   ├── services/            # Business logic layer
│   │   ├── employee_service.py
│   │   └── analytics_service.py
│   └── main.py              # FastAPI application entry point
├── tests/                   # Test suite
│   ├── conftest.py          # Pytest configuration
│   ├── test_analytics.py    # Analytics tests
│   └── test_employee_repository.py
├── seed.py                  # Database seeding script
├── requirements.txt         # Python dependencies
├── pytest.ini              # Pytest configuration
└── .env.example            # Environment variables template
```

### Backend Layer Responsibilities

**API Layer** (`app/api/`):
- Handles HTTP requests and responses
- Request validation using Pydantic
- Response serialization
- Exception handling and error responses

**Service Layer** (`app/services/`):
- Contains business logic
- Orchestrates repository operations
- Implements complex queries and calculations
- Handles cross-entity operations

**Repository Layer** (`app/repositories/`):
- Direct database operations
- CRUD operations on models
- Query optimization
- Transaction management

**Models Layer** (`app/models/`):
- Database schema definition
- Relationships between entities
- Model-level validations

## Frontend Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable components
│   │   ├── DashboardCharts.jsx
│   │   ├── DashboardTable.jsx
│   │   ├── EmployeeFilters.jsx
│   │   ├── EmployeeForm.jsx
│   │   ├── EmployeeProfileCard.jsx
│   │   ├── EmployeeTable.jsx
│   │   ├── ErrorState.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Loading.jsx
│   │   ├── SalaryInfoCard.jsx
│   │   ├── SalaryUpdateDialog.jsx
│   │   ├── SalaryHistoryTable.jsx
│   │   ├── StatCard.jsx
│   │   ├── TableSkeleton.jsx
│   │   ├── TableWrapper.jsx
│   │   └── tableStyles.js   # Shared table styles
│   ├── config/              # Configuration files
│   │   └── api.js           # API client configuration
│   ├── hooks/               # Custom React hooks
│   │   └── useDebounce.js   # Debounce hook
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Employees.jsx
│   │   ├── EmployeeDetails.jsx
│   │   └── EmployeeEdit.jsx
│   ├── services/            # API service functions
│   │   └── employeeService.js
│   ├── utils/               # Utility functions
│   │   └── formatUtils.js   # Formatting utilities
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Application entry point
│   └── index.html           # HTML template
├── .env.example            # Environment variables template
├── package.json            # Node dependencies
├── vite.config.js          # Vite configuration
└── index.html              # HTML entry point
```

### Frontend Component Organization

**Page Components** (`src/pages/`):
- Route-level components
- Handle page-level state and data fetching
- Compose smaller components

**Reusable Components** (`src/components/`):
- Self-contained, reusable UI components
- Accept props for customization
- Handle their own state when appropriate

**Services** (`src/services/`):
- API communication layer
- Centralized endpoint definitions
- Request/response transformation

**Utils** (`src/utils/`):
- Pure utility functions
- Formatting helpers
- Common transformations

## Setup Instructions

### Prerequisites
- Python 3.9 or higher
- Node.js 18 or higher
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create environment file:
```bash
cp .env.example .env
```

6. Configure environment variables in `.env`:
```
DATABASE_URL=sqlite:///./salary_management.db
DEBUG=True
CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
VITE_API_URL=http://localhost:8000
```

## Run Backend

1. Ensure you're in the backend directory with the virtual environment activated

2. Start the FastAPI server:
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or using the main.py script:
```bash
python app/main.py
```

The backend will be available at `http://localhost:8000`

API documentation will be available at `http://localhost:8000/docs`

## Run Frontend

1. Ensure you're in the frontend directory

2. Start the Vite development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Create Database

The database is automatically created when you run the backend for the first time. SQLite is used by default, but you can configure PostgreSQL or MySQL by changing the `DATABASE_URL` in the `.env` file.

## Run Seed Script

To populate the database with sample data:

1. Ensure the backend is running

2. Run the seed script:
```bash
python seed.py
```

This will create sample employees with salary history across different countries and departments.

## Run Tests

### Backend Tests

1. Ensure you're in the backend directory with the virtual environment activated

2. Run pytest:
```bash
pytest
```

Run with coverage:
```bash
pytest --cov=app --cov-report=html
```

### Frontend Tests

Frontend tests can be added using a testing framework like React Testing Library or Jest. Currently, the project focuses on backend testing.

## API Overview

### Endpoints

#### Employees
- `GET /api/employees` - List all employees with pagination and filtering
- `POST /api/employees` - Create a new employee
- `GET /api/employees/{id}` - Get employee by ID
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee
- `PATCH /api/employees/{id}/salary` - Update employee salary

#### Analytics
- `GET /api/analytics/global` - Get global analytics
- `GET /api/analytics/country/{country}` - Get country-specific analytics
- `GET /api/analytics/salary-history/{employee_id}` - Get employee salary history

#### Health
- `GET /health` - Health check endpoint

### Error Responses

All error responses follow a consistent format:
```json
{
  "detail": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `422` - Validation Error
- `500` - Internal Server Error

## Architecture Decisions

See [architecture.md](architecture.md) for detailed architecture decisions and design patterns.

## Tradeoffs

See [tradeoffs.md](tradeoffs.md) for detailed tradeoffs made during development.

## Future Improvements

### Backend
- Add authentication and authorization (JWT)
- Implement role-based access control (RBAC)
- Add audit logging for sensitive operations
- Implement data export functionality (CSV, Excel)
- Add email notifications for salary updates
- Implement caching for frequently accessed data
- Add database migrations using Alembic
- Support for PostgreSQL and MySQL in production

### Frontend
- Add comprehensive unit and integration tests
- Implement dark mode theme
- Add data visualization charts using Recharts or D3
- Implement advanced filtering and sorting
- Add bulk operations (bulk update, bulk delete)
- Implement offline support with service workers
- Add PWA capabilities
- Improve accessibility (WCAG 2.1 AA compliance)
- Add internationalization (i18n) support

### DevOps
- Docker containerization
- CI/CD pipeline setup
- Automated testing in CI/CD
- Production deployment configuration
- Monitoring and alerting
- Performance monitoring
- Security scanning

## AI Usage

See [ai-usage.md](ai-usage.md) for details on AI assistance used during development.

## License

This project is for educational purposes.

## Support

For issues or questions, please refer to the project documentation or contact the development team.
