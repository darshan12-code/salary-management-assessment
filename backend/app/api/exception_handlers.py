from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.core.exceptions import (
    EmployeeNotFoundException,
    DuplicateEmployeeIdException,
    DuplicateEmailException,
    InvalidSalaryException
)


async def employee_not_found_exception_handler(
    request: Request,
    exc: EmployeeNotFoundException
) -> JSONResponse:
    """Handle EmployeeNotFoundException and return 404."""
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": str(exc)}
    )


async def duplicate_employee_id_exception_handler(
    request: Request,
    exc: DuplicateEmployeeIdException
) -> JSONResponse:
    """Handle DuplicateEmployeeIdException and return 409."""
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": str(exc)}
    )


async def duplicate_email_exception_handler(
    request: Request,
    exc: DuplicateEmailException
) -> JSONResponse:
    """Handle DuplicateEmailException and return 409."""
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": str(exc)}
    )


async def invalid_salary_exception_handler(
    request: Request,
    exc: InvalidSalaryException
) -> JSONResponse:
    """Handle InvalidSalaryException and return 400."""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)}
    )


exception_handlers = {
    EmployeeNotFoundException: employee_not_found_exception_handler,
    DuplicateEmployeeIdException: duplicate_employee_id_exception_handler,
    DuplicateEmailException: duplicate_email_exception_handler,
    InvalidSalaryException: invalid_salary_exception_handler,
}
