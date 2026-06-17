from typing import List
from sqlalchemy.orm import Session

from app.models.salary_history import SalaryHistory


class SalaryHistoryRepository:
    """Repository for SalaryHistory database operations."""
    
    def __init__(self, db: Session) -> None:
        """Initialize repository with database session."""
        self.db = db
    
    def create_history(self, employee_id: int, old_salary: float, new_salary: float) -> SalaryHistory:
        """Create a new salary history record."""
        salary_history = SalaryHistory(
            employee_id=employee_id,
            old_salary=old_salary,
            new_salary=new_salary
        )
        self.db.add(salary_history)
        self.db.flush()
        self.db.refresh(salary_history)
        return salary_history
    
    def get_employee_history(self, employee_id: int) -> List[SalaryHistory]:
        """Get all salary history records for an employee."""
        return self.db.query(SalaryHistory).filter(
            SalaryHistory.employee_id == employee_id
        ).order_by(SalaryHistory.changed_at.desc()).all()
