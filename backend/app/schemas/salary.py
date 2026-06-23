from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator


class SalaryUpdateRequest(BaseModel):
    """Schema for salary update request."""
    
    salary: Decimal = Field(..., gt=0, description="New salary amount")
    
    @field_validator('salary')
    @classmethod
    def salary_must_be_positive(cls, v: Decimal) -> Decimal:
        """Validate that salary is greater than 0."""
        if v <= 0:
            raise ValueError('Salary must be greater than 0')
        return v


class SalaryHistoryResponse(BaseModel):
    """Schema for salary history response data."""
    
    id: int = Field(..., description="Database ID of the salary history record")
    employee_id: int = Field(..., description="Employee ID reference")
    old_salary: Decimal = Field(..., description="Previous salary amount")
    new_salary: Decimal = Field(..., description="New salary amount")
    changed_at: datetime = Field(..., description="Timestamp when the salary was changed")
    
    model_config = {"from_attributes": True}
