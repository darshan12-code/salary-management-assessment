"""
Tests for EmployeeService.
"""

import pytest
from datetime import date
from decimal import Decimal

from app.services.employee_service import EmployeeService
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.salary_history_repository import SalaryHistoryRepository
from app.core.exceptions import (
    EmployeeNotFoundException,
    DuplicateEmployeeIdException,
    DuplicateEmailException,
    InvalidSalaryException
)


class TestEmployeeService:
    """Test EmployeeService methods."""
    
    @pytest.fixture
    def employee_service(self, test_db):
        """Create an EmployeeService instance for testing."""
        employee_repository = EmployeeRepository(test_db)
        salary_history_repository = SalaryHistoryRepository(test_db)
        return EmployeeService(test_db, employee_repository, salary_history_repository)
    
    def test_create_employee_success(self, employee_service, test_db):
        """Test creating an employee successfully."""
        employee = employee_service.create_employee(
            employee_id="EMP00001",
            name="John Doe",
            email="john.doe@example.com",
            department="Engineering",
            designation="Software Engineer",
            country="USA",
            salary=Decimal("100000.00"),
            currency="USD",
            joining_date=date(2020, 1, 15),
            is_active=True
        )
        assert employee.id is not None
        assert employee.employee_id == "EMP00001"
        assert employee.name == "John Doe"
    
    def test_create_employee_duplicate_id(self, employee_service, sample_employee):
        """Test creating an employee with duplicate employee_id raises exception."""
        with pytest.raises(DuplicateEmployeeIdException):
            employee_service.create_employee(
                employee_id=sample_employee.employee_id,
                name="Jane Doe",
                email="jane.doe@example.com",
                department="HR",
                designation="HR Executive",
                country="USA",
                salary=Decimal("80000.00"),
                currency="USD",
                joining_date=date(2021, 1, 15),
                is_active=True
            )
    
    def test_create_employee_duplicate_email(self, employee_service, sample_employee):
        """Test creating an employee with duplicate email raises exception."""
        with pytest.raises(DuplicateEmailException):
            employee_service.create_employee(
                employee_id="EMP00002",
                name="Jane Doe",
                email=sample_employee.email,
                department="HR",
                designation="HR Executive",
                country="USA",
                salary=Decimal("80000.00"),
                currency="USD",
                joining_date=date(2021, 1, 15),
                is_active=True
            )
    
    def test_create_employee_invalid_salary(self, employee_service):
        """Test creating an employee with invalid salary raises exception."""
        with pytest.raises(InvalidSalaryException):
            employee_service.create_employee(
                employee_id="EMP00003",
                name="Test User",
                email="test@example.com",
                department="Engineering",
                designation="Software Engineer",
                country="USA",
                salary=Decimal("-1000.00"),
                currency="USD",
                joining_date=date(2020, 1, 15),
                is_active=True
            )
    
    def test_get_employee_by_id_success(self, employee_service, sample_employee):
        """Test getting an employee by ID successfully."""
        employee = employee_service.get_employee_by_id(sample_employee.id)
        assert employee is not None
        assert employee.id == sample_employee.id
    
    def test_get_employee_by_id_not_found(self, employee_service):
        """Test getting a non-existent employee raises exception."""
        with pytest.raises(EmployeeNotFoundException):
            employee_service.get_employee_by_id(99999)
    
    def test_get_employees_with_filters(self, employee_service, multiple_employees):
        """Test getting employees with filters."""
        employees = employee_service.get_employees(
            department="Engineering",
            country="USA",
            page=1,
            page_size=10
        )
        assert len(employees) > 0
        for emp in employees:
            assert emp.department == "Engineering"
            assert emp.country == "USA"
    
    def test_update_employee_success(self, employee_service, sample_employee):
        """Test updating an employee successfully."""
        updated = employee_service.update_employee(
            employee_id=sample_employee.id,
            name="John Updated",
            email="john.updated@example.com",
            department="Finance",
            designation="Financial Analyst",
            country="UK",
            salary=Decimal("120000.00"),
            currency="GBP",
            joining_date=date(2020, 1, 15),
            is_active=True
        )
        assert updated.name == "John Updated"
        assert updated.department == "Finance"
    
    def test_update_employee_not_found(self, employee_service):
        """Test updating a non-existent employee raises exception."""
        with pytest.raises(EmployeeNotFoundException):
            employee_service.update_employee(
                employee_id=99999,
                name="John Updated",
                email="john.updated@example.com",
                department="Finance",
                designation="Financial Analyst",
                country="UK",
                salary=Decimal("120000.00"),
                currency="GBP",
                joining_date=date(2020, 1, 15),
                is_active=True
            )
    
    def test_update_salary_success(self, employee_service, sample_employee):
        """Test updating salary successfully."""
        updated = employee_service.update_salary(
            employee_id=sample_employee.id,
            new_salary=Decimal("150000.00")
        )
        assert float(updated.salary) == 150000.00
    
    def test_update_salary_not_found(self, employee_service):
        """Test updating salary for non-existent employee raises exception."""
        with pytest.raises(EmployeeNotFoundException):
            employee_service.update_salary(
                employee_id=99999,
                new_salary=Decimal("150000.00")
            )
    
    def test_update_salary_invalid_value(self, employee_service, sample_employee):
        """Test updating salary with invalid value raises exception."""
        with pytest.raises(InvalidSalaryException):
            employee_service.update_salary(
                employee_id=sample_employee.id,
                new_salary=Decimal("-1000.00")
            )
    
    def test_get_employee_salary_history(self, employee_service, sample_employee):
        """Test getting employee salary history."""
        # First update salary to create history
        employee_service.update_salary(
            employee_id=sample_employee.id,
            new_salary=Decimal("150000.00")
        )
        
        history = employee_service.get_employee_salary_history(sample_employee.id)
        assert len(history) > 0
    
    def test_get_employee_salary_history_not_found(self, employee_service):
        """Test getting salary history for non-existent employee raises exception."""
        with pytest.raises(EmployeeNotFoundException):
            employee_service.get_employee_salary_history(99999)
