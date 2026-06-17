from fastapi import APIRouter, Depends, status

from app.api.dependencies import get_analytics_service
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import AnalyticsResponse


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
