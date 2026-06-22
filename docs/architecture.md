# Architecture Documentation

## Overview

The Salary Management System follows a clean architecture pattern with clear separation of concerns across layers. This document describes the architectural decisions, design patterns, and system organization.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  State Mgmt  │  │  API Client  │      │
│  │   (Pages)    │  │ (TanStack Q) │  │   (Axios)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              │
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Layer   │  │Service Layer │  │Repository    │      │
│  │  (FastAPI)   │  │  (Business)  │  │   Layer      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                              │                               │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │   Models     │  │  Schemas     │                         │
│  │ (SQLAlchemy) │  │  (Pydantic)  │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Database                                │
│                    (SQLite/PostgreSQL)                        │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Layer Responsibilities

#### 1. API Layer (`app/api/`)

**Purpose**: Handle HTTP requests and responses

**Responsibilities**:
- Route definition and HTTP method handling
- Request validation using Pydantic schemas
- Response serialization
- Exception handling and error responses
- Dependency injection for services

**Key Files**:
- `employees.py`: Employee CRUD endpoints
- `analytics.py`: Analytics and reporting endpoints
- `dependencies.py`: Dependency injection configuration
- `exception_handlers.py`: Global exception handlers

**Design Pattern**: Controller Pattern

#### 2. Service Layer (`app/services/`)

**Purpose**: Implement business logic

**Responsibilities**:
- Orchestrate repository operations
- Implement complex business rules
- Handle cross-entity operations
- Data transformation and aggregation
- Validation beyond schema validation

**Key Files**:
- `employee_service.py`: Employee business logic
- `analytics_service.py`: Analytics calculations and aggregations

**Design Pattern**: Service Layer Pattern

**Example Business Logic**:
```python
# Analytics service calculates country-specific payroll
def get_country_analytics(self, country: str):
    employees = self.employee_repo.get_by_country(country)
    return {
        "total_employees": len(employees),
        "total_payroll": sum(e.salary for e in employees),
        "average_salary": self._calculate_average(employees),
        "department_breakdown": self._group_by_department(employees)
    }
```

#### 3. Repository Layer (`app/repositories/`)

**Purpose**: Data access abstraction

**Responsibilities**:
- Direct database operations
- CRUD operations on models
- Query construction and optimization
- Transaction management
- Database-specific logic

**Key Files**:
- `employee_repository.py`: Employee data access
- `salary_history_repository.py`: Salary history data access

**Design Pattern**: Repository Pattern

**Benefits**:
- Testability (can mock repositories)
- Single Responsibility Principle
- Easy to swap database implementations
- Centralized query logic

#### 4. Models Layer (`app/models/`)

**Purpose**: Database schema definition

**Responsibilities**:
- Define database tables and relationships
- Model-level constraints and validations
- ORM mappings

**Key Files**:
- `base.py`: Base model with common fields
- `employee.py`: Employee model
- `salary_history.py`: Salary history model

**Design Pattern**: Active Record Pattern (via SQLAlchemy)

#### 5. Schemas Layer (`app/schemas/`)

**Purpose**: Data validation and serialization

**Responsibilities**:
- Request/response validation
- Data transformation
- API contract definition

**Key Files**:
- `employee.py`: Employee schemas
- `analytics.py`: Analytics schemas
- `salary.py`: Salary schemas
- `common.py`: Common schemas

**Design Pattern**: Data Transfer Object (DTO) Pattern

### Data Flow

```
HTTP Request
    ↓
API Layer (validation)
    ↓
Service Layer (business logic)
    ↓
Repository Layer (data access)
    ↓
Database
    ↓
Repository Layer (result mapping)
    ↓
Service Layer (transformation)
    ↓
API Layer (serialization)
    ↓
HTTP Response
```

### Exception Handling Strategy

**Custom Exceptions** (`app/core/exceptions.py`):
- `EmployeeNotFoundException`: Resource not found
- `DuplicateEmployeeIdException`: Business rule violation
- `DuplicateEmailException`: Business rule violation
- `InvalidSalaryException`: Validation error

**Exception Handlers** (`app/api/exception_handlers.py`):
- Map custom exceptions to HTTP status codes
- Provide consistent error response format
- Centralized error handling logic

**Error Response Format**:
```json
{
  "detail": "Error message description"
}
```

## Frontend Architecture

### Component Hierarchy

```
App (Root)
├── Dashboard
│   ├── StatCard (reused)
│   ├── DashboardCharts
│   └── DashboardTable
│       ├── TableWrapper
│       └── DataGrid (MUI)
├── Employees
│   ├── EmployeeFilters
│   ├── EmployeeTable
│   │   ├── TableWrapper
│   │   └── DataGrid (MUI)
│   └── EmployeeForm (Dialog)
└── EmployeeDetails
    ├── EmployeeProfileCard
    │   ├── SalaryInfoCard
    │   └── EmployeeForm (Dialog)
    └── SalaryHistoryTable
```

### State Management Strategy

**TanStack Query (React Query)**:
- Server state management
- Automatic caching and refetching
- Optimistic updates
- Loading and error states
- Pagination support

**Local State**:
- Component-specific UI state (dialogs, filters)
- Form state
- Temporary UI states

**State Flow**:
```
User Action
    ↓
Local State Update
    ↓
API Call (TanStack Query)
    ↓
Server State Update
    ↓
UI Re-render
```

### Component Design Patterns

#### 1. Container/Presentational Pattern

**Container Components** (`src/pages/`):
- Handle data fetching
- Manage state
- Pass data to presentational components

**Presentational Components** (`src/components/`):
- Receive data via props
- Render UI
- Emit events via callbacks

**Example**:
```jsx
// Container (Employees.jsx)
const Employees = () => {
  const { data, isLoading } = useQuery(['employees'], fetchEmployees);
  return <EmployeeTable employees={data} isLoading={isLoading} />;
};

// Presentational (EmployeeTable.jsx)
const EmployeeTable = ({ employees, isLoading }) => {
  if (isLoading) return <Loading />;
  return <DataGrid rows={employees} />;
};
```

#### 2. Composition Pattern

Components are composed of smaller, reusable components:
- Complex UI built from simple building blocks
- Props drilling for configuration
- Children composition for flexibility

#### 3. Custom Hooks Pattern

Encapsulate reusable logic:
- `useDebounce`: Debounce user input
- Can be extended for other common patterns

### API Client Architecture

**Centralized API Configuration** (`src/config/api.js`):
- Base URL configuration
- Axios instance setup
- Request/response interceptors
- Error handling

**Service Layer** (`src/services/employeeService.js`):
- Endpoint definitions
- Request/response transformation
- API method organization

**Example**:
```javascript
// API client configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Service layer
export const employeeService = {
  getEmployees: (params) => api.get('/api/employees', { params }),
  createEmployee: (data) => api.post('/api/employees', data),
  // ...
};
```

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐
│    Employee     │
├─────────────────┤
│ id (PK)         │
│ employee_id (UK) │
│ name            │
│ email           │
│ department      │
│ designation     │
│ country         │
│ salary          │
│ currency        │
│ joining_date    │
│ is_active       │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────┴────────┐
│ Salary History  │
├─────────────────┤
│ id (PK)         │
│ employee_id (FK) │
│ salary          │
│ currency        │
│ effective_date  │
│ reason          │
│ created_at      │
└─────────────────┘
```

### Indexing Strategy

**Employee Table**:
- Primary key: `id`
- Unique index: `employee_id`
- Index: `email`
- Index: `country`
- Index: `department`

**Salary History Table**:
- Primary key: `id`
- Foreign key: `employee_id`
- Index: `effective_date`
- Composite index: `(employee_id, effective_date)`

### Data Integrity

**Constraints**:
- `employee_id` must be unique
- `email` must be unique
- `salary` must be greater than 0
- `effective_date` must be a valid date

**Relationships**:
- Employee to Salary History: One-to-Many
- Cascade delete: When employee is deleted, salary history is deleted

## Security Considerations

### Current Implementation

**CORS Configuration**:
- Configured allowed origins
- Credentials support
- Methods and headers whitelist

**Input Validation**:
- Pydantic schema validation
- Type checking
- Required field validation
- Custom validators

**SQL Injection Prevention**:
- SQLAlchemy ORM parameterized queries
- No raw SQL string concatenation

### Future Security Enhancements

- Authentication (JWT)
- Authorization (RBAC)
- Rate limiting
- Request signing
- HTTPS enforcement
- Input sanitization
- XSS prevention
- CSRF protection

## Performance Considerations

### Backend Optimization

**Database**:
- Connection pooling
- Query optimization with indexes
- N+1 query prevention
- Lazy loading relationships

**API**:
- Response compression
- Pagination for large datasets
- Caching frequently accessed data
- Async/await for I/O operations

### Frontend Optimization

**Rendering**:
- React.memo for component memoization
- useCallback for function memoization
- useMemo for expensive calculations
- Code splitting with React.lazy

**Data Fetching**:
- TanStack Query caching
- Optimistic updates
- Background refetching
- Request deduplication

**Bundle Size**:
- Tree shaking
- Dynamic imports
- Lazy loading routes
- Minification

## Scalability Considerations

### Backend Scalability

**Horizontal Scaling**:
- Stateless API design
- Database connection pooling
- Load balancer ready
- Session-less authentication (future)

**Vertical Scaling**:
- Efficient query execution
- Memory optimization
- CPU-bound task optimization

### Frontend Scalability

**Component Scalability**:
- Modular component design
- Clear component boundaries
- Reusable component library

**State Scalability**:
- Centralized state management
- Clear state ownership
- Predictable state updates

## Testing Strategy

### Backend Testing

**Unit Tests**:
- Repository layer tests
- Service layer tests
- Schema validation tests

**Integration Tests**:
- API endpoint tests
- Database operation tests
- Exception handler tests

**Test Tools**:
- pytest
- pytest-asyncio
- pytest-cov

### Frontend Testing (Future)

**Unit Tests**:
- Component tests
- Hook tests
- Utility function tests

**Integration Tests**:
- Page-level tests
- API integration tests

**E2E Tests**:
- User flow tests
- Cross-browser tests

**Test Tools** (Future):
- React Testing Library
- Jest
- Playwright/Cypress

## Deployment Architecture

### Development Environment

**Backend**:
- SQLite database
- FastAPI with auto-reload
- Local development server

**Frontend**:
- Vite dev server
- Hot module replacement
- Source maps

### Production Environment (Future)

**Backend**:
- PostgreSQL database
- Gunicorn/Uvicorn
- Nginx reverse proxy
- Docker containers

**Frontend**:
- Vite production build
- Static file serving
- CDN for assets
- Nginx/Apache

## Monitoring and Logging

### Current Implementation

**Logging**:
- Python logging module
- Console output in development

**Health Checks**:
- `/health` endpoint
- Database connectivity check

### Future Enhancements

**Logging**:
- Structured logging
- Log aggregation (ELK stack)
- Error tracking (Sentry)

**Monitoring**:
- Application performance monitoring
- Database performance monitoring
- API response time tracking
- Error rate monitoring

**Alerting**:
- Error threshold alerts
- Performance degradation alerts
- Availability monitoring

## Technology Rationale

### Backend Technology Choices

**FastAPI**:
- Modern and fast
- Built-in API documentation
- Type hints support
- Async support
- Easy testing

**SQLAlchemy**:
- Mature ORM
- Database agnostic
- Relationship management
- Migration support

**Pydantic**:
- Automatic validation
- Type safety
- Clear API contracts
- IDE support

### Frontend Technology Choices

**React**:
- Component-based architecture
- Large ecosystem
- Strong community
- Performance optimizations

**Material UI**:
- Pre-built components
- Consistent design
- Accessibility features
- Customization options

**TanStack Query**:
- Server state management
- Automatic caching
- Optimistic updates
- DevTools support

## Conclusion

This architecture provides a solid foundation for the Salary Management System with clear separation of concerns, testability, and scalability. The design patterns and technology choices support maintainability and future growth.
