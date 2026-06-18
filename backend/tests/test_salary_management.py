"""
Tests for salary management API routes.
"""

import pytest
from fastapi import status


class TestSalaryManagement:
    """Test salary management endpoints."""
    
    def test_update_salary_success(self, client, sample_employee):
        """Test updating employee salary successfully."""
        salary_data = {"salary": 120000.00}
        response = client.put(f"/api/employees/{sample_employee.id}/salary", json=salary_data)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert float(data["salary"]) == 120000.00
    
    def test_update_salary_not_found(self, client):
        """Test updating salary for non-existent employee returns 404."""
        salary_data = {"salary": 120000.00}
        response = client.put("/api/employees/99999/salary", json=salary_data)
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_salary_invalid_value(self, client, sample_employee):
        """Test updating salary with invalid value returns error."""
        salary_data = {"salary": -1000.00}
        response = client.put(f"/api/employees/{sample_employee.id}/salary", json=salary_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_salary_history_created_after_update(self, client, sample_employee, test_db):
        """Test that salary history record is created after salary update."""
        from app.models.salary_history import SalaryHistory
        
        initial_history_count = test_db.query(SalaryHistory).filter(
            SalaryHistory.employee_id == sample_employee.id
        ).count()
        
        salary_data = {"salary": 150000.00}
        response = client.put(f"/api/employees/{sample_employee.id}/salary", json=salary_data)
        assert response.status_code == status.HTTP_200_OK
        
        final_history_count = test_db.query(SalaryHistory).filter(
            SalaryHistory.employee_id == sample_employee.id
        ).count()
        
        assert final_history_count == initial_history_count + 1
    
    def test_multiple_salary_updates_create_multiple_history_records(self, client, sample_employee, test_db):
        """Test that multiple salary updates create multiple history records."""
        from app.models.salary_history import SalaryHistory
        
        # Perform multiple salary updates
        salaries = [110000.00, 120000.00, 130000.00]
        for salary in salaries:
            salary_data = {"salary": salary}
            response = client.put(f"/api/employees/{sample_employee.id}/salary", json=salary_data)
            assert response.status_code == status.HTTP_200_OK
        
        # Check history records
        history_records = test_db.query(SalaryHistory).filter(
            SalaryHistory.employee_id == sample_employee.id
        ).all()
        
        assert len(history_records) == len(salaries)
    
    def test_get_salary_history_success(self, client, sample_employee):
        """Test getting employee salary history successfully."""
        # First update salary to create history
        salary_data = {"salary": 150000.00}
        client.put(f"/api/employees/{sample_employee.id}/salary", json=salary_data)
        
        # Get salary history
        response = client.get(f"/api/employees/{sample_employee.id}/salary-history")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
    
    def test_get_salary_history_not_found(self, client):
        """Test getting salary history for non-existent employee returns 404."""
        response = client.get("/api/employees/99999/salary-history")
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_salary_history_contains_correct_data(self, client, sample_employee, test_db):
        """Test that salary history contains correct data."""
        from app.models.salary_history import SalaryHistory
        
        new_salary = 150000.00
        salary_data = {"salary": new_salary}
        client.put(f"/api/employees/{sample_employee.id}/salary", json=salary_data)
        
        response = client.get(f"/api/employees/{sample_employee.id}/salary-history")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Check the most recent history record
        history = test_db.query(SalaryHistory).filter(
            SalaryHistory.employee_id == sample_employee.id
        ).order_by(SalaryHistory.changed_at.desc()).first()
        
        assert history is not None
        assert float(history.old_salary) == float(sample_employee.salary)
        assert float(history.new_salary) == new_salary
