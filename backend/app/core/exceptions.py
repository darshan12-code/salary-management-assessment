"""Custom exceptions for the service layer."""


class EmployeeNotFoundException(Exception):
    """Raised when an employee is not found."""
    pass


class DuplicateEmployeeIdException(Exception):
    """Raised when trying to create an employee with a duplicate employee_id."""
    pass


class DuplicateEmailException(Exception):
    """Raised when trying to create an employee with a duplicate email."""
    pass


class InvalidSalaryException(Exception):
    """Raised when salary is invalid (e.g., not greater than zero)."""
    pass
