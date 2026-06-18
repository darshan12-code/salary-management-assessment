"""
Tests for analytics API routes.
"""

import pytest
from fastapi import status


class TestAnalyticsRoutes:
    """Test analytics API endpoints."""
    
    def test_analytics_endpoint_returns_success(self, client, multiple_employees):
        """Test that analytics endpoint returns success."""
        response = client.get("/api/analytics/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "total_employees" in data
        assert "total_payroll" in data
        assert "average_salary" in data
    
    def test_total_employees_calculation(self, client, multiple_employees):
        """Test that total employees calculation is correct."""
        response = client.get("/api/analytics/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total_employees"] == 20
    
    def test_total_payroll_calculation(self, client, multiple_employees):
        """Test that total payroll calculation is correct."""
        response = client.get("/api/analytics/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert float(data["total_payroll"]) > 0
        # Expected total: sum of 60000 + 70000 + ... + 250000 (20 employees, i from 1 to 20)
        expected_total = sum(50000 + i * 10000 for i in range(1, 21))
        assert float(data["total_payroll"]) == expected_total
    
    def test_average_salary_calculation(self, client, multiple_employees):
        """Test that average salary calculation is correct."""
        response = client.get("/api/analytics/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert float(data["average_salary"]) > 0
        # Average should be total_payroll / total_employees
        expected_avg = float(data["total_payroll"]) / data["total_employees"]
        assert abs(float(data["average_salary"]) - expected_avg) < 0.01
    
    def test_highest_paid_employees_returned(self, client, multiple_employees):
        """Test that highest paid employees are returned correctly."""
        response = client.get("/api/analytics/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "highest_paid_employees" in data
        assert len(data["highest_paid_employees"]) <= 10
        # Check that salaries are in descending order
        salaries = [float(emp["salary"]) for emp in data["highest_paid_employees"]]
        assert salaries == sorted(salaries, reverse=True)
    
    def test_lowest_paid_employees_returned(self, client, multiple_employees):
        """Test that lowest paid employees are returned correctly."""
        response = client.get("/api/analytics/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "lowest_paid_employees" in data
        assert len(data["lowest_paid_employees"]) <= 10
        # Check that salaries are in ascending order
        salaries = [float(emp["salary"]) for emp in data["lowest_paid_employees"]]
        assert salaries == sorted(salaries)
    
    def test_average_salary_by_department(self, client, multiple_employees):
        """Test that average salary by department is calculated correctly."""
        response = client.get("/api/analytics/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "average_salary_by_department" in data
        assert len(data["average_salary_by_department"]) > 0
        # Check that each entry has required fields
        for dept_data in data["average_salary_by_department"]:
            assert "department" in dept_data
            assert "average_salary" in dept_data
    
    def test_employees_by_department(self, client, multiple_employees):
        """Test that employee distribution by department is calculated correctly."""
        response = client.get("/api/analytics/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "employees_by_department" in data
        assert len(data["employees_by_department"]) > 0
        # Check that each entry has required fields
        for dept_data in data["employees_by_department"]:
            assert "department" in dept_data
            assert "count" in dept_data
            assert "total_payroll" in dept_data
    
    def test_employees_by_country(self, client, multiple_employees):
        """Test that employee distribution by country is calculated correctly."""
        response = client.get("/api/analytics/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "employees_by_country" in data
        assert len(data["employees_by_country"]) > 0
        # Check that each entry has required fields
        for country_data in data["employees_by_country"]:
            assert "country" in country_data
            assert "count" in country_data
    
    def test_payroll_by_department(self, client, multiple_employees):
        """Test that payroll by department is calculated correctly."""
        response = client.get("/api/analytics/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "payroll_by_department" in data
        assert len(data["payroll_by_department"]) > 0
        # Check that each entry has required fields
        for dept_data in data["payroll_by_department"]:
            assert "department" in dept_data
            assert "total_payroll" in dept_data
            assert "count" in dept_data
    
    def test_analytics_with_no_employees(self, client):
        """Test analytics endpoint with no employees in database."""
        response = client.get("/api/analytics/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total_employees"] == 0
        assert float(data["total_payroll"]) == 0
        assert float(data["average_salary"]) == 0
        assert len(data["highest_paid_employees"]) == 0
        assert len(data["lowest_paid_employees"]) == 0
