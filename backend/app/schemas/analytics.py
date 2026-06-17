from typing import Dict, List
from decimal import Decimal
from pydantic import BaseModel, Field


class DepartmentAnalytics(BaseModel):
    """Analytics data for a specific department."""
    
    department: str = Field(..., description="Department name")
    count: int = Field(..., description="Number of employees in department")
    average_salary: Decimal = Field(..., description="Average salary in department")
    total_payroll: Decimal = Field(..., description="Total payroll expenditure for department")


class CountryAnalytics(BaseModel):
    """Analytics data for a specific country."""
    
    country: str = Field(..., description="Country name")
    count: int = Field(..., description="Number of employees in country")
    average_salary: Decimal = Field(..., description="Average salary in country")


class EmployeeSalaryInfo(BaseModel):
    """Employee salary information for top/bottom lists."""
    
    id: int = Field(..., description="Employee database ID")
    employee_id: str = Field(..., description="Employee ID")
    name: str = Field(..., description="Employee name")
    department: str = Field(..., description="Employee department")
    salary: Decimal = Field(..., description="Employee salary")
    currency: str = Field(..., description="Salary currency")


class AnalyticsResponse(BaseModel):
    """Complete analytics response for the salary management system."""
    
    total_employees: int = Field(..., description="Total number of active employees")
    total_payroll: Decimal = Field(..., description="Total payroll expenditure across all employees")
    average_salary: Decimal = Field(..., description="Average salary across all employees")
    average_salary_by_department: List[DepartmentAnalytics] = Field(
        ...,
        description="Average salary breakdown by department"
    )
    average_salary_by_country: List[CountryAnalytics] = Field(
        ...,
        description="Average salary breakdown by country"
    )
    employees_by_department: List[DepartmentAnalytics] = Field(
        ...,
        description="Employee count and payroll by department"
    )
    employees_by_country: List[CountryAnalytics] = Field(
        ...,
        description="Employee count by country"
    )
    payroll_by_department: List[DepartmentAnalytics] = Field(
        ...,
        description="Payroll expenditure by department"
    )
    highest_paid_employees: List[EmployeeSalaryInfo] = Field(
        ...,
        description="Top 10 highest paid employees"
    )
    lowest_paid_employees: List[EmployeeSalaryInfo] = Field(
        ...,
        description="Top 10 lowest paid employees"
    )
