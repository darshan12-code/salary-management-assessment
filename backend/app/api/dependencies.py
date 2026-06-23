from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.salary_history_repository import SalaryHistoryRepository
from app.services.employee_service import EmployeeService
from app.services.analytics_service import AnalyticsService


def get_employee_service(db: Session = Depends(get_db)) -> EmployeeService:
    """
    Dependency injection for EmployeeService.
    Instantiates repositories and injects them into EmployeeService.
    """
    employee_repository = EmployeeRepository(db)
    salary_history_repository = SalaryHistoryRepository(db)
    return EmployeeService(db, employee_repository, salary_history_repository)


def get_analytics_service(employee_service: EmployeeService = Depends(get_employee_service)) -> AnalyticsService:
    """
    Dependency injection for AnalyticsService.
    Uses EmployeeService's database session and repository.
    """
    return AnalyticsService(employee_service.db, employee_service.employee_repository)

