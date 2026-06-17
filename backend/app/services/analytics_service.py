from typing import List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc

from app.models.employee import Employee
from app.repositories.employee_repository import EmployeeRepository


class AnalyticsService:
    """Service layer for analytics business logic."""
    
    def __init__(self, db: Session, employee_repository: EmployeeRepository) -> None:
        """Initialize service with dependencies."""
        self.db = db
        self.employee_repository = employee_repository
    
    def get_analytics(self) -> Dict:
        """
        Get complete analytics for the salary management system.
        All calculations are performed in the database using aggregate functions.
        Only includes active employees.
        """
        # Base query for active employees only
        base_query = self.db.query(Employee).filter(Employee.is_active == True)
        
        # 1. Total employees
        total_employees = base_query.count()
        
        # 2. Total payroll expenditure
        total_payroll_result = base_query.with_entities(
            func.sum(Employee.salary)
        ).scalar()
        total_payroll = total_payroll_result if total_payroll_result else 0
        
        # 3. Average salary
        average_salary_result = base_query.with_entities(
            func.avg(Employee.salary)
        ).scalar()
        average_salary = average_salary_result if average_salary_result else 0
        
        # 4. Average salary by department
        avg_salary_by_dept = self.db.query(
            Employee.department,
            func.avg(Employee.salary).label('avg_salary')
        ).filter(Employee.is_active == True).group_by(Employee.department).all()
        
        average_salary_by_department = [
            {
                "department": dept,
                "average_salary": round(float(avg_salary), 2)
            }
            for dept, avg_salary in avg_salary_by_dept
        ]
        
        # 5. Average salary by country
        avg_salary_by_country = self.db.query(
            Employee.country,
            func.avg(Employee.salary).label('avg_salary')
        ).filter(Employee.is_active == True).group_by(Employee.country).all()
        
        average_salary_by_country = [
            {
                "country": country,
                "average_salary": round(float(avg_salary), 2)
            }
            for country, avg_salary in avg_salary_by_country
        ]
        
        # 6. Employee distribution by department (count and payroll)
        employees_by_dept = self.db.query(
            Employee.department,
            func.count(Employee.id).label('count'),
            func.sum(Employee.salary).label('total_payroll'),
            func.avg(Employee.salary).label('average_salary')
        ).filter(Employee.is_active == True).group_by(Employee.department).all()
        
        employees_by_department = [
            {
                "department": dept,
                "count": count,
                "average_salary": round(float(avg_salary), 2),
                "total_payroll": round(float(total_payroll), 2)
            }
            for dept, count, total_payroll, avg_salary in employees_by_dept
        ]
        
        # 7. Employee distribution by country
        employees_by_country = self.db.query(
            Employee.country,
            func.count(Employee.id).label('count'),
            func.avg(Employee.salary).label('avg_salary')
        ).filter(Employee.is_active == True).group_by(Employee.country).all()
        
        employees_by_country_list = [
            {
                "country": country,
                "count": count,
                "average_salary": round(float(avg_salary), 2)
            }
            for country, count, avg_salary in employees_by_country
        ]
        
        # 8. Payroll expenditure by department
        payroll_by_dept = self.db.query(
            Employee.department,
            func.sum(Employee.salary).label('total_payroll'),
            func.count(Employee.id).label('count'),
            func.avg(Employee.salary).label('average_salary')
        ).filter(Employee.is_active == True).group_by(Employee.department).all()
        
        payroll_by_department = [
            {
                "department": dept,
                "count": count,
                "average_salary": round(float(avg_salary), 2),
                "total_payroll": round(float(total_payroll), 2)
            }
            for dept, total_payroll, count, avg_salary in payroll_by_dept
        ]
        
        # 9. Top 10 highest paid employees
        highest_paid = base_query.order_by(desc(Employee.salary)).limit(10).all()
        
        highest_paid_employees = [
            {
                "id": emp.id,
                "employee_id": emp.employee_id,
                "name": emp.name,
                "department": emp.department,
                "salary": float(emp.salary),
                "currency": emp.currency
            }
            for emp in highest_paid
        ]
        
        # 10. Top 10 lowest paid employees
        lowest_paid = base_query.order_by(asc(Employee.salary)).limit(10).all()
        
        lowest_paid_employees = [
            {
                "id": emp.id,
                "employee_id": emp.employee_id,
                "name": emp.name,
                "department": emp.department,
                "salary": float(emp.salary),
                "currency": emp.currency
            }
            for emp in lowest_paid
        ]
        
        return {
            "total_employees": total_employees,
            "total_payroll": round(float(total_payroll), 2),
            "average_salary": round(float(average_salary), 2),
            "average_salary_by_department": average_salary_by_department,
            "average_salary_by_country": average_salary_by_country,
            "employees_by_department": employees_by_department,
            "employees_by_country": employees_by_country_list,
            "payroll_by_department": payroll_by_department,
            "highest_paid_employees": highest_paid_employees,
            "lowest_paid_employees": lowest_paid_employees
        }
