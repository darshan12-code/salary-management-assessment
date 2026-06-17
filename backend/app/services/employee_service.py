from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.models.salary_history import SalaryHistory
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.salary_history_repository import SalaryHistoryRepository
from app.core.exceptions import (
    EmployeeNotFoundException,
    DuplicateEmployeeIdException,
    DuplicateEmailException,
    InvalidSalaryException
)


class EmployeeService:
    """Service layer for employee business logic."""
    
    def __init__(
        self,
        db: Session,
        employee_repository: EmployeeRepository,
        salary_history_repository: SalaryHistoryRepository
    ) -> None:
        """Initialize service with dependencies."""
        self.db = db
        self.employee_repository = employee_repository
        self.salary_history_repository = salary_history_repository
    
    def create_employee(
        self,
        employee_id: str,
        name: str,
        email: str,
        department: str,
        designation: str,
        country: str,
        salary: float,
        currency: str,
        joining_date,
        is_active: bool = True
    ) -> Employee:
        """Create a new employee with validation."""
        # Check for duplicate employee_id
        existing_by_id = self.employee_repository.get_by_employee_id(employee_id)
        if existing_by_id:
            raise DuplicateEmployeeIdException(f"Employee with employee_id '{employee_id}' already exists")
        
        # Check for duplicate email
        existing_by_email = self.employee_repository.get_by_email(email)
        if existing_by_email:
            raise DuplicateEmailException(f"Employee with email '{email}' already exists")
        
        # Validate salary
        if salary <= 0:
            raise InvalidSalaryException("Salary must be greater than zero")
        
        # Create employee
        employee = Employee(
            employee_id=employee_id,
            name=name,
            email=email,
            department=department,
            designation=designation,
            country=country,
            salary=salary,
            currency=currency,
            joining_date=joining_date,
            is_active=is_active
        )
        
        try:
            self.employee_repository.create(employee)
            self.db.commit()
            self.db.refresh(employee)
            return employee
        except Exception as e:
            self.db.rollback()
            raise e
    
    def update_employee(
        self,
        employee_id: int,
        name: Optional[str] = None,
        email: Optional[str] = None,
        department: Optional[str] = None,
        designation: Optional[str] = None,
        country: Optional[str] = None,
        salary: Optional[float] = None,
        currency: Optional[str] = None,
        joining_date=None,
        is_active: Optional[bool] = None
    ) -> Employee:
        """Update an existing employee with validation."""
        # Fetch employee
        employee = self.employee_repository.get_by_id(employee_id)
        if not employee:
            raise EmployeeNotFoundException(f"Employee with id {employee_id} not found")
        
        # Check for duplicate email if email is being updated
        if email and email != employee.email:
            existing_by_email = self.employee_repository.get_by_email(email)
            if existing_by_email:
                raise DuplicateEmailException(f"Employee with email '{email}' already exists")
        
        # Validate salary if provided
        if salary is not None and salary <= 0:
            raise InvalidSalaryException("Salary must be greater than zero")
        
        # Update fields if provided
        if name is not None:
            employee.name = name
        if email is not None:
            employee.email = email
        if department is not None:
            employee.department = department
        if designation is not None:
            employee.designation = designation
        if country is not None:
            employee.country = country
        if salary is not None:
            employee.salary = salary
        if currency is not None:
            employee.currency = currency
        if joining_date is not None:
            employee.joining_date = joining_date
        if is_active is not None:
            employee.is_active = is_active
        
        try:
            self.employee_repository.update(employee)
            self.db.commit()
            self.db.refresh(employee)
            return employee
        except Exception as e:
            self.db.rollback()
            raise e
    
    def get_employee_by_id(self, employee_id: int) -> Employee:
        """Get employee by database ID."""
        employee = self.employee_repository.get_by_id(employee_id)
        if not employee:
            raise EmployeeNotFoundException(f"Employee with id {employee_id} not found")
        return employee
    
    def get_employee_by_employee_id(self, employee_id: str) -> Employee:
        """Get employee by employee_id string."""
        employee = self.employee_repository.get_by_employee_id(employee_id)
        if not employee:
            raise EmployeeNotFoundException(f"Employee with employee_id '{employee_id}' not found")
        return employee
    
    def search_employees(self, search_term: str) -> List[Employee]:
        """Search employees by name or employee_id."""
        return self.employee_repository.search(search_term)
    
    def get_employees(
        self,
        search: Optional[str] = None,
        department: Optional[str] = None,
        country: Optional[str] = None,
        page: int = 1,
        page_size: int = 10
    ) -> List[Employee]:
        """Get employees with pagination and filters."""
        return self.employee_repository.get_filtered_employees(
            search=search,
            department=department,
            country=country,
            page=page,
            page_size=page_size
        )
    
    def update_salary(self, employee_id: int, new_salary: float) -> Employee:
        """Update employee salary with history tracking."""
        # Validate salary
        if new_salary <= 0:
            raise InvalidSalaryException("Salary must be greater than zero")
        
        # Fetch employee
        employee = self.employee_repository.get_by_id(employee_id)
        if not employee:
            raise EmployeeNotFoundException(f"Employee with id {employee_id} not found")
        
        # Save current salary as old_salary
        old_salary = employee.salary
        
        # Update employee salary
        employee.salary = new_salary
        
        try:
            # Update employee
            self.employee_repository.update(employee)
            
            # Create salary history record
            self.salary_history_repository.create_history(
                employee_id=employee_id,
                old_salary=old_salary,
                new_salary=new_salary
            )
            
            # Commit transaction
            self.db.commit()
            
            # Refresh employee
            self.db.refresh(employee)
            
            return employee
        except Exception as e:
            self.db.rollback()
            raise e
    
    def get_employee_salary_history(self, employee_id: int) -> List[SalaryHistory]:
        """Get salary history for an employee."""
        # Verify employee exists
        employee = self.employee_repository.get_by_id(employee_id)
        if not employee:
            raise EmployeeNotFoundException(f"Employee with id {employee_id} not found")
        
        return self.salary_history_repository.get_employee_history(employee_id)
