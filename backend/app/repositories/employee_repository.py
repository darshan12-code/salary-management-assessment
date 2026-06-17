from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.models.employee import Employee


class EmployeeRepository:
    """Repository for Employee database operations."""
    
    def __init__(self, db: Session) -> None:
        """Initialize repository with database session."""
        self.db = db
    
    def create(self, employee: Employee) -> Employee:
        """Create a new employee."""
        self.db.add(employee)
        self.db.flush()
        self.db.refresh(employee)
        return employee
    
    def update(self, employee: Employee) -> Employee:
        """Update an existing employee."""
        self.db.merge(employee)
        self.db.flush()
        self.db.refresh(employee)
        return employee
    
    def get_by_id(self, employee_id: int) -> Optional[Employee]:
        """Get employee by database ID."""
        return self.db.query(Employee).filter(Employee.id == employee_id).first()
    
    def get_by_employee_id(self, employee_id: str) -> Optional[Employee]:
        """Get employee by employee_id string."""
        return self.db.query(Employee).filter(Employee.employee_id == employee_id).first()
    
    def get_by_email(self, email: str) -> Optional[Employee]:
        """Get employee by email address."""
        return self.db.query(Employee).filter(Employee.email == email).first()
    
    def search(self, search_term: str) -> List[Employee]:
        """Search employees by name or employee_id."""
        return self.db.query(Employee).filter(
            or_(
                Employee.name.ilike(f"%{search_term}%"),
                Employee.employee_id.ilike(f"%{search_term}%")
            )
        ).all()
    
    def get_paginated(self, page: int, page_size: int) -> List[Employee]:
        """Get paginated list of employees."""
        offset = (page - 1) * page_size
        return self.db.query(Employee).offset(offset).limit(page_size).all()
    
    def filter_by_department(self, department: str, page: int, page_size: int) -> List[Employee]:
        """Filter employees by department with pagination."""
        offset = (page - 1) * page_size
        return self.db.query(Employee).filter(
            Employee.department == department
        ).offset(offset).limit(page_size).all()
    
    def filter_by_country(self, country: str, page: int, page_size: int) -> List[Employee]:
        """Filter employees by country with pagination."""
        offset = (page - 1) * page_size
        return self.db.query(Employee).filter(
            Employee.country == country
        ).offset(offset).limit(page_size).all()
    
    def get_filtered_employees(
        self,
        search: Optional[str],
        department: Optional[str],
        country: Optional[str],
        page: int,
        page_size: int
    ) -> List[Employee]:
        """Get filtered employees with search, department, and country filters."""
        query = self.db.query(Employee)
        
        if search:
            query = query.filter(
                or_(
                    Employee.name.ilike(f"%{search}%"),
                    Employee.employee_id.ilike(f"%{search}%")
                )
            )
        
        if department:
            query = query.filter(Employee.department == department)
        
        if country:
            query = query.filter(Employee.country == country)
        
        offset = (page - 1) * page_size
        return query.offset(offset).limit(page_size).all()
    
    def get_total_count(self) -> int:
        """Get total count of employees."""
        return self.db.query(func.count(Employee.id)).scalar()
