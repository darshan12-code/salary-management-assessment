from datetime import datetime
from sqlalchemy import DateTime, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class SalaryHistory(Base):
    """SalaryHistory model tracking salary changes for employees."""
    
    __tablename__ = "salary_history"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employees.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    old_salary: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    new_salary: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    changed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now()
    )
    
    # Relationship to Employee - many salary history records belong to one employee
    employee: Mapped["Employee"] = relationship(
        back_populates="salary_history",
        lazy="selectin"
    )
    
    def __repr__(self) -> str:
        return f"<SalaryHistory(id={self.id}, employee_id={self.employee_id}, old_salary={self.old_salary}, new_salary={self.new_salary})>"
