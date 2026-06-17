from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status

from app.api.dependencies import get_employee_service
from app.services.employee_service import EmployeeService
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from app.schemas.salary import SalaryUpdateRequest, SalaryHistoryResponse
from app.schemas.common import PaginatedResponse
from app.core.exceptions import (
    EmployeeNotFoundException,
    DuplicateEmployeeIdException,
    DuplicateEmailException,
    InvalidSalaryException
)


router = APIRouter(prefix="/api/employees", tags=["employees"])


@router.post(
    "/",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new employee",
    description="Create a new employee with the provided details"
)
def create_employee(
    employee_data: EmployeeCreate,
    employee_service: EmployeeService = Depends(get_employee_service)
) -> EmployeeResponse:
    """Create a new employee."""
    try:
        employee = employee_service.create_employee(
            employee_id=employee_data.employee_id,
            name=employee_data.name,
            email=employee_data.email,
            department=employee_data.department,
            designation=employee_data.designation,
            country=employee_data.country,
            salary=float(employee_data.salary),
            currency=employee_data.currency,
            joining_date=employee_data.joining_date,
            is_active=employee_data.is_active
        )
        return EmployeeResponse.model_validate(employee)
    except DuplicateEmployeeIdException as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except DuplicateEmailException as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except InvalidSalaryException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/",
    response_model=PaginatedResponse[EmployeeResponse],
    summary="List employees",
    description="Get a paginated list of employees with optional search and filters"
)
def list_employees(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
    search: Optional[str] = Query(None, description="Search by employee_id or name"),
    department: Optional[str] = Query(None, description="Filter by department"),
    country: Optional[str] = Query(None, description="Filter by country"),
    employee_service: EmployeeService = Depends(get_employee_service)
) -> PaginatedResponse[EmployeeResponse]:
    """Get a paginated list of employees with optional search and filters."""
    employees = employee_service.get_employees(
        search=search,
        department=department,
        country=country,
        page=page,
        page_size=page_size
    )
    
    # Get total count
    total = employee_service.employee_repository.get_total_count()
    
    total_pages = (total + page_size - 1) // page_size
    
    return PaginatedResponse(
        items=[EmployeeResponse.model_validate(emp) for emp in employees],
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages
    )


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
    summary="Get employee by ID",
    description="Get a specific employee by their database ID"
)
def get_employee(
    employee_id: int,
    employee_service: EmployeeService = Depends(get_employee_service)
) -> EmployeeResponse:
    """Get a specific employee by ID."""
    try:
        employee = employee_service.get_employee_by_id(employee_id)
        return EmployeeResponse.model_validate(employee)
    except EmployeeNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse,
    summary="Update employee",
    description="Update an existing employee's details"
)
def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    employee_service: EmployeeService = Depends(get_employee_service)
) -> EmployeeResponse:
    """Update an existing employee."""
    try:
        employee = employee_service.update_employee(
            employee_id=employee_id,
            name=employee_data.name,
            email=employee_data.email,
            department=employee_data.department,
            designation=employee_data.designation,
            country=employee_data.country,
            salary=float(employee_data.salary) if employee_data.salary is not None else None,
            currency=employee_data.currency,
            joining_date=employee_data.joining_date,
            is_active=employee_data.is_active
        )
        return EmployeeResponse.model_validate(employee)
    except EmployeeNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except DuplicateEmailException as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except InvalidSalaryException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put(
    "/{employee_id}/salary",
    response_model=EmployeeResponse,
    summary="Update employee salary",
    description="Update an employee's salary and track the change in history"
)
def update_employee_salary(
    employee_id: int,
    salary_data: SalaryUpdateRequest,
    employee_service: EmployeeService = Depends(get_employee_service)
) -> EmployeeResponse:
    """Update an employee's salary."""
    try:
        employee = employee_service.update_salary(
            employee_id=employee_id,
            new_salary=float(salary_data.salary)
        )
        return EmployeeResponse.model_validate(employee)
    except EmployeeNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except InvalidSalaryException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/{employee_id}/salary-history",
    response_model=list[SalaryHistoryResponse],
    summary="Get employee salary history",
    description="Get the salary change history for a specific employee"
)
def get_employee_salary_history(
    employee_id: int,
    employee_service: EmployeeService = Depends(get_employee_service)
) -> list[SalaryHistoryResponse]:
    """Get the salary history for a specific employee."""
    try:
        history = employee_service.get_employee_salary_history(employee_id)
        return [SalaryHistoryResponse.model_validate(record) for record in history]
    except EmployeeNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
