from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


class EmployeeBase(BaseModel):
    """Base schema for employee data."""
    
    employee_id: str = Field(..., description="Unique employee identifier")
    name: str = Field(..., description="Full name of the employee")
    email: EmailStr = Field(..., description="Email address of the employee")
    department: str = Field(..., description="Department where the employee works")
    designation: str = Field(..., description="Job designation/title of the employee")
    country: str = Field(..., description="Country where the employee is located")
    salary: Decimal = Field(..., gt=0, description="Current salary of the employee")
    currency: str = Field(..., description="Currency code for salary (e.g., USD, EUR)")
    joining_date: date = Field(..., description="Date when the employee joined the company")
    is_active: bool = Field(default=True, description="Whether the employee is currently active")


class EmployeeCreate(EmployeeBase):
    """Schema for creating a new employee."""
    
    @field_validator('salary')
    @classmethod
    def salary_must_be_positive(cls, v: Decimal) -> Decimal:
        """Validate that salary is greater than 0."""
        if v <= 0:
            raise ValueError('Salary must be greater than 0')
        return v


class EmployeeUpdate(BaseModel):
    """Schema for updating an employee (all fields optional)."""
    
    name: Optional[str] = Field(None, description="Full name of the employee")
    email: Optional[EmailStr] = Field(None, description="Email address of the employee")
    department: Optional[str] = Field(None, description="Department where the employee works")
    designation: Optional[str] = Field(None, description="Job designation/title of the employee")
    country: Optional[str] = Field(None, description="Country where the employee is located")
    salary: Optional[Decimal] = Field(None, gt=0, description="Current salary of the employee")
    currency: Optional[str] = Field(None, description="Currency code for salary (e.g., USD, EUR)")
    joining_date: Optional[date] = Field(None, description="Date when the employee joined the company")
    is_active: Optional[bool] = Field(None, description="Whether the employee is currently active")
    
    @field_validator('salary')
    @classmethod
    def salary_must_be_positive(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        """Validate that salary is greater than 0 if provided."""
        if v is not None and v <= 0:
            raise ValueError('Salary must be greater than 0')
        return v


class EmployeeResponse(EmployeeBase):
    """Schema for employee response data."""
    
    id: int = Field(..., description="Database ID of the employee")
    created_at: datetime = Field(..., description="Timestamp when the employee was created")
    updated_at: datetime = Field(..., description="Timestamp when the employee was last updated")
    
    model_config = {"from_attributes": True}
