"""
Tests for employee API routes.
"""

import pytest
from fastapi import status


class TestEmployeeRoutes:
    """Test employee API endpoints."""
    
    def test_create_employee_success(self, client, sample_employee_data):
        """Test creating an employee successfully."""
        response = client.post("/api/employees/", json=sample_employee_data)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["employee_id"] == sample_employee_data["employee_id"]
        assert data["name"] == sample_employee_data["name"]
        assert data["email"] == sample_employee_data["email"]
    
    def test_create_employee_duplicate_id(self, client, sample_employee, sample_employee_data):
        """Test creating an employee with duplicate employee_id returns error."""
        response = client.post("/api/employees/", json=sample_employee_data)
        assert response.status_code == status.HTTP_409_CONFLICT
        assert "already exists" in response.json()["detail"].lower()
    
    def test_create_employee_duplicate_email(self, client, sample_employee):
        """Test creating an employee with duplicate email returns error."""
        duplicate_data = {
            "employee_id": "EMP00002",
            "name": "Jane Doe",
            "email": sample_employee.email,
            "department": "HR",
            "designation": "HR Executive",
            "country": "USA",
            "salary": 80000.00,
            "currency": "USD",
            "joining_date": "2021-01-15",
            "is_active": True
        }
        response = client.post("/api/employees/", json=duplicate_data)
        assert response.status_code == status.HTTP_409_CONFLICT
        assert "already exists" in response.json()["detail"].lower()
    
    def test_get_employee_by_id_success(self, client, sample_employee):
        """Test getting an employee by ID successfully."""
        response = client.get(f"/api/employees/{sample_employee.id}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_employee.id
        assert data["employee_id"] == sample_employee.employee_id
    
    def test_get_employee_by_id_not_found(self, client):
        """Test getting a non-existent employee returns 404."""
        response = client.get("/api/employees/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_update_employee_success(self, client, sample_employee):
        """Test updating an employee successfully."""
        update_data = {
            "name": "John Updated",
            "email": "john.updated@example.com",
            "department": "Finance",
            "designation": "Financial Analyst",
            "country": "UK",
            "salary": 120000.00,
            "currency": "GBP",
            "joining_date": "2020-01-15",
            "is_active": True
        }
        response = client.put(f"/api/employees/{sample_employee.id}", json=update_data)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "John Updated"
        assert data["department"] == "Finance"
    
    def test_update_employee_not_found(self, client):
        """Test updating a non-existent employee returns 404."""
        update_data = {
            "name": "John Updated",
            "email": "john.updated@example.com",
            "department": "Finance",
            "designation": "Financial Analyst",
            "country": "UK",
            "salary": 120000.00,
            "currency": "GBP",
            "joining_date": "2020-01-15",
            "is_active": True
        }
        response = client.put("/api/employees/99999", json=update_data)
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_list_employees_success(self, client, multiple_employees):
        """Test listing employees successfully."""
        response = client.get("/api/employees/?page_size=100")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "items" in data
        assert "page" in data
        assert "page_size" in data
        assert "total" in data
        assert "total_pages" in data
        assert len(data["items"]) == 20
    
    def test_search_employees(self, client, multiple_employees):
        """Test searching employees by name or employee_id."""
        response = client.get("/api/employees/?search=Employee")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data["items"]) > 0
    
    def test_filter_employees_by_department(self, client, multiple_employees):
        """Test filtering employees by department."""
        response = client.get("/api/employees/?department=Engineering")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert all(emp["department"] == "Engineering" for emp in data["items"])
    
    def test_filter_employees_by_country(self, client, multiple_employees):
        """Test filtering employees by country."""
        response = client.get("/api/employees/?country=USA")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert all(emp["country"] == "USA" for emp in data["items"])
    
    def test_pagination_response(self, client, multiple_employees):
        """Test pagination works correctly."""
        response = client.get("/api/employees/?page=1&page_size=5")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["page"] == 1
        assert data["page_size"] == 5
        assert len(data["items"]) == 5
    
    def test_invalid_email_validation(self, client):
        """Test creating employee with invalid email returns error."""
        invalid_data = {
            "employee_id": "EMP00003",
            "name": "Test User",
            "email": "invalid-email",
            "department": "Engineering",
            "designation": "Software Engineer",
            "country": "USA",
            "salary": 100000.00,
            "currency": "USD",
            "joining_date": "2020-01-15",
            "is_active": True
        }
        response = client.post("/api/employees/", json=invalid_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_salary_less_than_zero_validation(self, client):
        """Test creating employee with salary <= 0 returns error."""
        invalid_data = {
            "employee_id": "EMP00004",
            "name": "Test User",
            "email": "test@example.com",
            "department": "Engineering",
            "designation": "Software Engineer",
            "country": "USA",
            "salary": -1000.00,
            "currency": "USD",
            "joining_date": "2020-01-15",
            "is_active": True
        }
        response = client.post("/api/employees/", json=invalid_data)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
