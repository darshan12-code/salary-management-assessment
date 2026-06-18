"""
Pytest configuration and fixtures for testing.
"""

import pytest
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.database.session import get_db
from app.models.base import Base
from app.models.employee import Employee
from app.models.salary_history import SalaryHistory


# Test database URL (in-memory SQLite for testing)
TEST_DATABASE_URL = "sqlite:///:memory:"


@pytest.fixture(scope="function")
def test_engine():
    """
    Create a test database engine.
    Uses in-memory SQLite for isolated test runs.
    """
    engine = create_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    # Create a connection and hold it open to keep the in-memory database alive
    connection = engine.connect()
    Base.metadata.create_all(bind=connection)
    yield engine
    Base.metadata.drop_all(bind=connection)
    connection.close()


@pytest.fixture(scope="function")
def test_db(test_engine):
    """
    Create a test database session.
    Uses the same engine connection to ensure tables are visible.
    """
    connection = test_engine.connect()
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=connection)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        connection.close()


@pytest.fixture(scope="function")
def client(test_engine):
    """
    Create a test client for the FastAPI application.
    Overrides the database dependency to use the test database.
    """
    connection = test_engine.connect()
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=connection)
    
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()
    connection.close()


@pytest.fixture(scope="function")
def fake():
    """
    Provide a Faker instance for generating test data.
    """
    from faker import Faker
    return Faker()


@pytest.fixture(scope="function")
def sample_employee_data():
    """
    Provide sample employee data for testing.
    """
    return {
        "employee_id": "EMP00001",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "department": "Engineering",
        "designation": "Software Engineer",
        "country": "USA",
        "salary": 100000.00,
        "currency": "USD",
        "joining_date": "2020-01-15",
        "is_active": True
    }


@pytest.fixture(scope="function")
def sample_employee(sample_employee_data, test_db):
    """
    Create a sample employee in the database.
    """
    employee = Employee(
        employee_id=sample_employee_data["employee_id"],
        name=sample_employee_data["name"],
        email=sample_employee_data["email"],
        department=sample_employee_data["department"],
        designation=sample_employee_data["designation"],
        country=sample_employee_data["country"],
        salary=Decimal(str(sample_employee_data["salary"])),
        currency=sample_employee_data["currency"],
        joining_date=date.fromisoformat(sample_employee_data["joining_date"]),
        is_active=sample_employee_data["is_active"]
    )
    test_db.add(employee)
    test_db.commit()
    test_db.refresh(employee)
    return employee


@pytest.fixture(scope="function")
def multiple_employees(test_db):
    """
    Create multiple employees in the database for testing.
    """
    employees = [
        Employee(
            employee_id=f"EMP{i:05d}",
            name=f"Employee {i}",
            email=f"employee{i}@example.com",
            department=["Engineering", "HR", "Finance", "Sales", "Marketing", "Operations"][i % 6],
            designation="Software Engineer",
            country=["USA", "India", "UK", "Germany", "Canada", "Australia"][i % 6],
            salary=Decimal(str(50000 + i * 10000)),
            currency="USD",
            joining_date=date(2020, 1, 1),
            is_active=True
        )
        for i in range(1, 21)
    ]
    test_db.add_all(employees)
    test_db.commit()
    for emp in employees:
        test_db.refresh(emp)
    return employees
