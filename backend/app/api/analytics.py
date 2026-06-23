from fastapi import APIRouter, Depends, status, Query

from app.api.dependencies import get_analytics_service
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import AnalyticsResponse, EmployeeSalaryInfo


router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get(
    "/",
    response_model=AnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get salary management analytics",
    description="Get comprehensive analytics including employee counts, payroll statistics, and salary distributions"
)
def get_analytics(
    analytics_service: AnalyticsService = Depends(get_analytics_service)
) -> AnalyticsResponse:
    """Get complete analytics for the salary management system."""
    analytics_data = analytics_service.get_analytics()
    return AnalyticsResponse(**analytics_data)


@router.get(
    "/top-paid",
    response_model=list[EmployeeSalaryInfo],
    status_code=status.HTTP_200_OK,
    summary="Get top paid employees",
    description="Get top N highest paid employees, optionally filtered by country"
)
def get_top_paid_employees(
    limit: int = Query(10, ge=1, le=50, description="Number of employees to return"),
    country: str = Query(None, description="Filter by country (optional)"),
    analytics_service: AnalyticsService = Depends(get_analytics_service)
) -> list[EmployeeSalaryInfo]:
    """Get top N highest paid employees, optionally filtered by country."""
    employees = analytics_service.get_top_paid_employees(limit=limit, country=country)
    return [EmployeeSalaryInfo(**emp) for emp in employees]


@router.get(
    "/lowest-paid",
    response_model=list[EmployeeSalaryInfo],
    status_code=status.HTTP_200_OK,
    summary="Get lowest paid employees",
    description="Get top N lowest paid employees, optionally filtered by country"
)
def get_lowest_paid_employees(
    limit: int = Query(10, ge=1, le=50, description="Number of employees to return"),
    country: str = Query(None, description="Filter by country (optional)"),
    analytics_service: AnalyticsService = Depends(get_analytics_service)
) -> list[EmployeeSalaryInfo]:
    """Get top N lowest paid employees, optionally filtered by country."""
    employees = analytics_service.get_lowest_paid_employees(limit=limit, country=country)
    return [EmployeeSalaryInfo(**emp) for emp in employees]
