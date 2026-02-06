"""
活动 API 路由
处理校园活动相关请求
"""
from typing import Optional
from fastapi import APIRouter, Query
from database import get_supabase_client
from models import EventWithDetails, EventList, ApiResponse


router = APIRouter(prefix="/events", tags=["活动"])


@router.get("", response_model=ApiResponse[EventList])
async def api_get_events(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    category: Optional[str] = Query(None, description="分类筛选"),
    status: Optional[str] = Query(None, description="状态筛选")
):
    """获取活动列表"""
    client = get_supabase_client()
    
    query = client.table("events").select("*", count="exact")
    
    if category:
        query = query.eq("category", category)
    
    if status:
        query = query.eq("status", status)
    
    offset = (page - 1) * page_size
    query = query.order("start_time", desc=True).range(offset, offset + page_size - 1)
    
    result = query.execute()
    
    events = [
        EventWithDetails(**event, participant_count=0, is_registered=False) 
        for event in result.data
    ]
    
    total = result.count or 0
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=EventList(
            items=events,
            total=total,
            page=page,
            page_size=page_size
        )
    )


@router.get("/{event_id}", response_model=ApiResponse[EventWithDetails])
async def api_get_event(event_id: str):
    """获取活动详情"""
    client = get_supabase_client()
    
    result = client.table("events").select("*").eq("id", event_id).execute()
    
    if not result.data:
        return ApiResponse(
            success=False,
            message="活动不存在",
            data=None
        )
    
    event = result.data[0]
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=EventWithDetails(**event, participant_count=0, is_registered=False)
    )
