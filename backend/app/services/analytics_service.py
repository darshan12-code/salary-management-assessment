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
        
        Business Rule: Analytics are grouped by country to provide location-based insights.
        Total payroll and average salary are calculated per country, not aggregated across countries.
        All calculations are performed in the database using aggregate functions.
        Only includes active employees.
        """
        # Base query for active employees only
        base_query = self.db.query(Employee).filter(Employee.is_active == True)
        
        # 1. Total employees (across all countries)
        total_employees = base_query.count()
        
        # 2. Average salary by department (aggregated across countries - for comparison only)
        # Note: This mixes currencies, so it's for informational purposes only
        avg_salary_by_dept = self.db.query(
            Employee.department,
            func.count(Employee.id).label('count'),
            func.sum(Employee.salary).label('total_payroll'),
            func.avg(Employee.salary).label('avg_salary')
        ).filter(Employee.is_active == True).group_by(Employee.department).all()
        
        average_salary_by_department = [
            {
                "department": dept,
                "count": count,
                "average_salary": round(float(avg_salary), 2),
                "total_payroll": round(float(total_payroll), 2)
            }
            for dept, count, total_payroll, avg_salary in avg_salary_by_dept
        ]
        
        # 3. Average salary by country (aggregated across currencies - for comparison only)
        avg_salary_by_country = self.db.query(
            Employee.country,
            func.count(Employee.id).label('count'),
            func.avg(Employee.salary).label('avg_salary')
        ).filter(Employee.is_active == True).group_by(Employee.country).all()
        
        average_salary_by_country = [
            {
                "country": country,
                "count": count,
                "average_salary": round(float(avg_salary), 2)
            }
            for country, count, avg_salary in avg_salary_by_country
        ]
        
        # 4. Employee distribution by department (count and payroll - aggregated across countries)
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
        
        # 5. Employee distribution by country
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
        
        # 6. Get all unique countries
        countries = self.db.query(Employee.country).filter(
            Employee.is_active == True
        ).distinct().all()
        country_list = [c[0] for c in countries]
        
        # 7. Build country-grouped analytics
        country_analytics = []
        for country in country_list:
            # Base query for this country only
            country_query = base_query.filter(Employee.country == country)
            
            # Total employees in this country
            country_employee_count = country_query.count()
            
            # Get the primary currency for this country (most common currency)
            currency_result = country_query.with_entities(
                Employee.currency,
                func.count(Employee.id).label('count')
            ).group_by(Employee.currency).order_by(func.count(Employee.id).desc()).first()
            
            primary_currency = currency_result[0] if currency_result else 'USD'
            
            # Total payroll in this country (in primary currency)
            total_payroll_result = country_query.filter(Employee.currency == primary_currency).with_entities(
                func.sum(Employee.salary)
            ).scalar()
            total_payroll = total_payroll_result if total_payroll_result else 0
            
            # Average salary in this country (in primary currency)
            average_salary_result = country_query.filter(Employee.currency == primary_currency).with_entities(
                func.avg(Employee.salary)
            ).scalar()
            average_salary = average_salary_result if average_salary_result else 0
            
            # Payroll by department for this country (in primary currency)
            payroll_by_dept = self.db.query(
                Employee.department,
                func.sum(Employee.salary).label('total_payroll'),
                func.count(Employee.id).label('count'),
                func.avg(Employee.salary).label('average_salary')
            ).filter(
                Employee.is_active == True,
                Employee.country == country,
                Employee.currency == primary_currency
            ).group_by(Employee.department).all()
            
            payroll_by_department = [
                {
                    "department": dept,
                    "count": count,
                    "average_salary": round(float(avg_salary), 2),
                    "total_payroll": round(float(total_payroll), 2)
                }
                for dept, total_payroll, count, avg_salary in payroll_by_dept
            ]
            
            # Top 10 highest paid employees in this country (in primary currency)
            highest_paid = country_query.filter(Employee.currency == primary_currency).order_by(desc(Employee.salary)).limit(10).all()
            
            highest_paid_employees = [
                {
                    "id": emp.id,
                    "employee_id": emp.employee_id,
                    "name": emp.name,
                    "department": emp.department,
                    "salary": float(emp.salary),
                    "currency": emp.currency,
                    "country": emp.country
                }
                for emp in highest_paid
            ]
            
            # Top 10 lowest paid employees in this country (in primary currency)
            lowest_paid = country_query.filter(Employee.currency == primary_currency).order_by(asc(Employee.salary)).limit(10).all()
            
            lowest_paid_employees = [
                {
                    "id": emp.id,
                    "employee_id": emp.employee_id,
                    "name": emp.name,
                    "department": emp.department,
                    "salary": float(emp.salary),
                    "currency": emp.currency,
                    "country": emp.country
                }
                for emp in lowest_paid
            ]
            
            country_analytics.append({
                "country": country,
                "primary_currency": primary_currency,
                "total_employees": country_employee_count,
                "total_payroll": float(total_payroll) if total_payroll else 0.0,
                "average_salary": float(average_salary) if average_salary else 0.0,
                "payroll_by_department": payroll_by_department,
                "highest_paid_employees": highest_paid_employees,
                "lowest_paid_employees": lowest_paid_employees
            })
        
        # 8. Calculate global payroll (sum of all country payrolls in USD)
        # For simplicity, we'll use the aggregated total from average_salary_by_department
        global_payroll = sum(dept['total_payroll'] for dept in average_salary_by_department) if average_salary_by_department else 0.0
        
        return {
            "total_employees": total_employees,
            "global_payroll": global_payroll,
            "average_salary_by_department": average_salary_by_department,
            "average_salary_by_country": average_salary_by_country,
            "employees_by_department": employees_by_department,
            "employees_by_country": employees_by_country_list,
            "country_analytics": country_analytics
        }
    
    def get_top_paid_employees(self, limit: int = 10, country: str = None) -> List[Dict]:
        """
        Get top N highest paid employees, optionally filtered by country.
        
        Args:
            limit: Number of employees to return (default: 10)
            country: Filter by country (optional)
            
        Returns:
            List of employee salary information
        """
        query = self.db.query(Employee).filter(Employee.is_active == True)
        
        if country:
            query = query.filter(Employee.country == country)
        
        employees = query.order_by(desc(Employee.salary)).limit(limit).all()
        
        return [
            {
                "id": emp.id,
                "employee_id": emp.employee_id,
                "name": emp.name,
                "department": emp.department,
                "salary": float(emp.salary),
                "currency": emp.currency,
                "country": emp.country
            }
            for emp in employees
        ]
    
    def get_lowest_paid_employees(self, limit: int = 10, country: str = None) -> List[Dict]:
        """
        Get top N lowest paid employees, optionally filtered by country.
        
        Args:
            limit: Number of employees to return (default: 10)
            country: Filter by country (optional)
            
        Returns:
            List of employee salary information
        """
        query = self.db.query(Employee).filter(Employee.is_active == True)
        
        if country:
            query = query.filter(Employee.country == country)
        
        employees = query.order_by(asc(Employee.salary)).limit(limit).all()
        
        return [
            {
                "id": emp.id,
                "employee_id": emp.employee_id,
                "name": emp.name,
                "department": emp.department,
                "salary": float(emp.salary),
                "currency": emp.currency,
                "country": emp.country
            }
            for emp in employees
        ]
