"""
Seed script for populating the database with sample data using Faker.
Run this script to generate test data for development and testing.
"""

import random
from datetime import datetime, timedelta
from decimal import Decimal
from faker import Faker
from sqlalchemy.orm import Session

from app.database.session import SessionLocal, init_db
from app.models.employee import Employee


# Configuration
TOTAL_EMPLOYEES = 10000
BATCH_SIZE = 1000
FAKER_SEED = 12345

# Data structures
DEPARTMENTS = [
    "Engineering",
    "HR",
    "Finance",
    "Sales",
    "Marketing",
    "Operations"
]

DESIGNATIONS = [
    "Software Engineer",
    "Senior Software Engineer",
    "Engineering Manager",
    "HR Executive",
    "HR Manager",
    "Financial Analyst",
    "Finance Manager",
    "Sales Executive",
    "Sales Manager",
    "Marketing Executive",
    "Marketing Manager",
    "Operations Executive",
    "Operations Manager"
]

COUNTRY_CURRENCY_MAP = {
    "India": "INR",
    "USA": "USD",
    "UK": "GBP",
    "Germany": "EUR",
    "Canada": "CAD",
    "Australia": "AUD"
}

SALARY_RANGES = {
    "Engineering": (80000, 250000),
    "HR": (40000, 120000),
    "Finance": (50000, 180000),
    "Sales": (45000, 200000),
    "Marketing": (45000, 150000),
    "Operations": (40000, 130000)
}


def get_salary_for_department(department: str) -> Decimal:
    """Generate a realistic salary based on department."""
    min_salary, max_salary = SALARY_RANGES[department]
    salary = random.uniform(min_salary, max_salary)
    return Decimal(str(round(salary, 2)))


def seed_database():
    """
    Seed the database with 10,000 employee records using Faker.
    Uses batch inserts for performance and displays progress.
    """
    # Set Faker seed for reproducibility
    Faker.seed(FAKER_SEED)
    fake = Faker()
    
    # Initialize database
    print("Initializing database...")
    init_db()
    
    db: Session = SessionLocal()
    
    # Track statistics
    employees_by_department = {dept: 0 for dept in DEPARTMENTS}
    employees_by_country = {country: 0 for country in COUNTRY_CURRENCY_MAP.keys()}
    
    try:
        print(f"Seeding {TOTAL_EMPLOYEES} employees in batches of {BATCH_SIZE}...")
        
        batch = []
        employee_id_counter = 1
        
        for i in range(TOTAL_EMPLOYEES):
            # Generate employee data
            department = random.choice(DEPARTMENTS)
            country = random.choice(list(COUNTRY_CURRENCY_MAP.keys()))
            currency = COUNTRY_CURRENCY_MAP[country]
            
            # Generate employee_id in EMP00001 format
            employee_id_str = f"EMP{employee_id_counter:05d}"
            employee_id_counter += 1
            
            # Generate name and email
            first_name = fake.first_name()
            last_name = fake.last_name()
            name = f"{first_name} {last_name}"
            email = f"{first_name.lower()}.{last_name.lower()}{fake.random_int(1, 999)}@{fake.free_email_domain()}"
            
            # Generate designation (filter by department for realism)
            if department == "Engineering":
                designation = random.choice(["Software Engineer", "Senior Software Engineer", "Engineering Manager"])
            elif department == "HR":
                designation = random.choice(["HR Executive", "HR Manager"])
            elif department == "Finance":
                designation = random.choice(["Financial Analyst", "Finance Manager"])
            elif department == "Sales":
                designation = random.choice(["Sales Executive", "Sales Manager"])
            elif department == "Marketing":
                designation = random.choice(["Marketing Executive", "Marketing Manager"])
            else:  # Operations
                designation = random.choice(["Operations Executive", "Operations Manager"])
            
            # Generate salary based on department
            salary = get_salary_for_department(department)
            
            # Generate random joining date within last 10 years
            days_ago = random.randint(0, 3650)
            joining_date = datetime.now() - timedelta(days=days_ago)
            
            # 95% active, 5% inactive
            is_active = random.random() < 0.95
            
            # Create employee
            employee = Employee(
                employee_id=employee_id_str,
                name=name,
                email=email,
                department=department,
                designation=designation,
                country=country,
                salary=salary,
                currency=currency,
                joining_date=joining_date.date(),
                is_active=is_active
            )
            
            batch.append(employee)
            
            # Update statistics
            employees_by_department[department] += 1
            employees_by_country[country] += 1
            
            # Insert in batches
            if len(batch) >= BATCH_SIZE:
                db.add_all(batch)
                db.commit()
                print(f"Progress: {i + 1}/{TOTAL_EMPLOYEES} employees seeded")
                batch = []
        
        # Insert remaining records
        if batch:
            db.add_all(batch)
            db.commit()
            print(f"Progress: {TOTAL_EMPLOYEES}/{TOTAL_EMPLOYEES} employees seeded")
        
        print("\n" + "=" * 50)
        print("Database seeded successfully!")
        print("=" * 50)
        print(f"\nTotal employees created: {TOTAL_EMPLOYEES}")
        
        print("\nEmployees by department:")
        for dept, count in employees_by_department.items():
            percentage = (count / TOTAL_EMPLOYEES) * 100
            print(f"  {dept}: {count} ({percentage:.1f}%)")
        
        print("\nEmployees by country:")
        for country, count in employees_by_country.items():
            percentage = (count / TOTAL_EMPLOYEES) * 100
            print(f"  {country}: {count} ({percentage:.1f}%)")
        
        print("\nActive employees:", sum(1 for emp in db.query(Employee).filter(Employee.is_active == True).all()))
        print("Inactive employees:", sum(1 for emp in db.query(Employee).filter(Employee.is_active == False).all()))
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
