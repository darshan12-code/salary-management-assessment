from datetime import date
from sqlalchemy import String, Numeric, Boolean, Date, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Employee(Base, TimestampMixin):
    """Employee model representing an employee in the salary management system."""
    
    __tablename__ = "employees"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    employee_id: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    department: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    designation: Mapped[str] = mapped_column(String(100), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    salary: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False)
    joining_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    
    # Relationship to SalaryHistory - one employee has many salary history records
    salary_history: Mapped[list["SalaryHistory"]] = relationship(
        back_populates="employee",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
    
    # Indexes
    __table_args__ = (
        Index("ix_employees_employee_id", "employee_id"),
        Index("ix_employees_email", "email"),
        Index("ix_employees_department", "department"),
        Index("ix_employees_country", "country"),
    )
    
    def __repr__(self) -> str:
        return f"<Employee(id={self.id}, employee_id='{self.employee_id}', name='{self.name}')>"
