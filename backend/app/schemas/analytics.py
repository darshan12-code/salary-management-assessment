from typing import Dict, List
from decimal import Decimal
from pydantic import BaseModel, Field


class DepartmentAnalytics(BaseModel):
    """Analytics data for a specific department within a currency group."""
    
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
    country: str = Field(..., description="Employee country")


class CurrencyAnalytics(BaseModel):
    """Analytics data grouped by currency to avoid mixing different currencies."""
    
    currency: str = Field(..., description="Currency code (e.g., USD, EUR)")
    total_employees: int = Field(..., description="Number of employees with this currency")
    total_payroll: Decimal = Field(..., description="Total payroll in this currency")
    average_salary: Decimal = Field(..., description="Average salary in this currency")
    payroll_by_department: List[DepartmentAnalytics] = Field(
        ...,
        description="Payroll breakdown by department for this currency"
    )
    highest_paid_employees: List[EmployeeSalaryInfo] = Field(
        ...,
        description="Top 10 highest paid employees in this currency"
    )
    lowest_paid_employees: List[EmployeeSalaryInfo] = Field(
        ...,
        description="Top 10 lowest paid employees in this currency"
    )


class AnalyticsResponse(BaseModel):
    """Complete analytics response for the salary management system.
    
    Business Rule: Analytics are grouped by currency to avoid mixing different currencies.
    Total payroll and average salary are not aggregated across currencies.
    Instead, use currency_analytics to see breakdowns per currency.
    """
    
    total_employees: int = Field(..., description="Total number of active employees across all currencies")
    average_salary_by_department: List[DepartmentAnalytics] = Field(
        ...,
        description="Average salary breakdown by department (aggregated across currencies)"
    )
    average_salary_by_country: List[CountryAnalytics] = Field(
        ...,
        description="Average salary breakdown by country (aggregated across currencies)"
    )
    employees_by_department: List[DepartmentAnalytics] = Field(
        ...,
        description="Employee count and payroll by department (aggregated across currencies)"
    )
    employees_by_country: List[CountryAnalytics] = Field(
        ...,
        description="Employee count by country"
    )
    currency_analytics: List[CurrencyAnalytics] = Field(
        ...,
        description="Analytics grouped by currency - use this for payroll and salary data"
    )
