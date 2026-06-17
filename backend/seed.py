"""
Seed script for populating the database with sample data using Faker.
Run this script to generate test data for development and testing.
"""

from faker import Faker
from sqlalchemy.orm import Session

from app.database.session import SessionLocal, init_db
from app.models.base import Base


def seed_database():
    """
    Seed the database with sample data.
    This function will be expanded with actual model seeding once business models are defined.
    """
    fake = Faker()
    
    # Initialize database
    init_db()
    
    db: Session = SessionLocal()
    
    try:
        # TODO: Add seeding logic once business models are defined
        # Example structure:
        # from app.models.employee import Employee
        # from app.models.salary import Salary
        #
        # employees = []
        # for _ in range(50):
        #     employee = Employee(
        #         first_name=fake.first_name(),
        #         last_name=fake.last_name(),
        #         email=fake.email(),
        #         # ... other fields
        #     )
        #     employees.append(employee)
        #
        # db.add_all(employees)
        # db.commit()
        
        print("Database seeded successfully!")
        print("Note: Actual seeding logic will be added once business models are defined.")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
