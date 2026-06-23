"""
Tests for EmployeeRepository.
"""

import pytest
from datetime import date
from decimal import Decimal

from app.repositories.employee_repository import EmployeeRepository
from app.models.employee import Employee


class TestEmployeeRepository:
    """Test EmployeeRepository methods."""
    
    def test_create_employee(self, test_db):
        """Test creating an employee in the repository."""
        repo = EmployeeRepository(test_db)
        employee = Employee(
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
        created_employee = repo.create(employee)
        assert created_employee.id is not None
        assert created_employee.employee_id == "EMP00001"
        assert created_employee.name == "John Doe"
    
    def test_get_employee_by_id(self, test_db, sample_employee):
        """Test getting an employee by ID."""
        repo = EmployeeRepository(test_db)
        employee = repo.get_by_id(sample_employee.id)
        assert employee is not None
        assert employee.id == sample_employee.id
    
    def test_get_employee_by_id_not_found(self, test_db):
        """Test getting a non-existent employee by ID."""
        repo = EmployeeRepository(test_db)
        employee = repo.get_by_id(99999)
        assert employee is None
    
    def test_get_employee_by_employee_id(self, test_db, sample_employee):
        """Test getting an employee by employee_id."""
        repo = EmployeeRepository(test_db)
        employee = repo.get_by_employee_id(sample_employee.employee_id)
        assert employee is not None
        assert employee.employee_id == sample_employee.employee_id
    
    def test_get_employee_by_employee_id_not_found(self, test_db):
        """Test getting a non-existent employee by employee_id."""
        repo = EmployeeRepository(test_db)
        employee = repo.get_by_employee_id("EMP99999")
        assert employee is None
    
    def test_get_employee_by_email(self, test_db, sample_employee):
        """Test getting an employee by email."""
        repo = EmployeeRepository(test_db)
        employee = repo.get_by_email(sample_employee.email)
        assert employee is not None
        assert employee.email == sample_employee.email
    
    def test_get_employee_by_email_not_found(self, test_db):
        """Test getting a non-existent employee by email."""
        repo = EmployeeRepository(test_db)
        employee = repo.get_by_email("nonexistent@example.com")
        assert employee is None
    
    def test_get_all_employees(self, test_db, multiple_employees):
        """Test getting all employees."""
        repo = EmployeeRepository(test_db)
        employees = repo.get_paginated(page=1, page_size=100)
        assert len(employees) == 20
    
    def test_get_employees_with_filters(self, test_db, multiple_employees):
        """Test getting employees with filters."""
        repo = EmployeeRepository(test_db)
        employees = repo.filter_by_department(department="Engineering", page=1, page_size=10)
        assert len(employees) > 0
        for emp in employees:
            assert emp.department == "Engineering"
    
    def test_get_employees_with_search(self, test_db, multiple_employees):
        """Test getting employees with search."""
        repo = EmployeeRepository(test_db)
        employees = repo.search("Employee")
        assert len(employees) > 0
    
    def test_get_employees_with_pagination(self, test_db, multiple_employees):
        """Test getting employees with pagination."""
        repo = EmployeeRepository(test_db)
        page1 = repo.get_paginated(page=1, page_size=5)
        page2 = repo.get_paginated(page=2, page_size=5)
        assert len(page1) == 5
        assert len(page2) == 5
        # Ensure different employees on different pages
        assert page1[0].id != page2[0].id
    
    def test_update_employee(self, test_db, sample_employee):
        """Test updating an employee."""
        repo = EmployeeRepository(test_db)
        sample_employee.name = "John Updated"
        sample_employee.email = "john.updated@example.com"
        sample_employee.department = "Finance"
        sample_employee.designation = "Financial Analyst"
        sample_employee.country = "UK"
        sample_employee.salary = Decimal("120000.00")
        sample_employee.currency = "GBP"
        updated = repo.update(sample_employee)
        assert updated.name == "John Updated"
        assert updated.department == "Finance"
    
    def test_delete_employee(self, test_db, sample_employee):
        """Test deleting an employee."""
        repo = EmployeeRepository(test_db)
        test_db.delete(sample_employee)
        test_db.commit()
        employee = repo.get_by_id(sample_employee.id)
        assert employee is None
    
    def test_get_total_count(self, test_db, multiple_employees):
        """Test getting total employee count."""
        repo = EmployeeRepository(test_db)
        count = repo.get_total_count()
        assert count == 20
    
    def test_check_employee_id_exists(self, test_db, sample_employee):
        """Test checking if employee_id exists."""
        repo = EmployeeRepository(test_db)
        employee = repo.get_by_employee_id(sample_employee.employee_id)
        assert employee is not None
        employee = repo.get_by_employee_id("EMP99999")
        assert employee is None
    
    def test_check_email_exists(self, test_db, sample_employee):
        """Test checking if email exists."""
        repo = EmployeeRepository(test_db)
        employee = repo.get_by_email(sample_employee.email)
        assert employee is not None
        employee = repo.get_by_email("nonexistent@example.com")
        assert employee is None
