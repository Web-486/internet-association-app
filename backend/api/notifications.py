"""
通知 API 路由
处理通知相关请求
"""
from fastapi import APIRouter, Depends, Query
from database import get_supabase_client
from models import NotificationWithSender, NotificationList, NotificationCount, ApiResponse
from api.auth import get_current_user


router = APIRouter(prefix="/notifications", tags=["通知"])


@router.get("", response_model=ApiResponse[NotificationList])
async def api_get_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    type: str = Query(None, description="通知类型筛选"),
    current_user: dict = Depends(get_current_user)
):
    """获取通知列表"""
    client = get_supabase_client()
    
    query = client.table("notifications").select("*, sender:users!sender_id(id, name, avatar_url)", count="exact")
    query = query.eq("user_id", current_user["id"])
    
    if type:
        query = query.eq("type", type)
    
    offset = (page - 1) * page_size
    query = query.order("created_at", desc=True).range(offset, offset + page_size - 1)
    
    result = query.execute()
    
    notifications = []
    unread_count = 0
    
    for notif in result.data:
        sender_data = notif.get("sender", {}) or {}
        notifications.append(NotificationWithSender(
            **{k: v for k, v in notif.items() if k != "sender"},
            sender_name=sender_data.get("name"),
            sender_avatar=sender_data.get("avatar_url"),
            source_title=None
        ))
        if not notif.get("is_read"):
            unread_count += 1
    
    total = result.count or 0
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=NotificationList(
            items=notifications,
            total=total,
            unread_count=unread_count
        )
    )


@router.get("/count", response_model=ApiResponse[NotificationCount])
async def api_get_notification_count(current_user: dict = Depends(get_current_user)):
    """获取未读通知数量"""
    client = get_supabase_client()
    
    result = client.table("notifications").select("type", count="exact").eq("user_id", current_user["id"]).eq("is_read", False).execute()
    
    # 按类型统计
    type_counts = {"notification": 0, "message": 0, "mention": 0}
    for notif in result.data:
        notif_type = notif.get("type", "notification")
        if notif_type in type_counts:
            type_counts[notif_type] += 1
        else:
            type_counts["notification"] += 1
    
    total = sum(type_counts.values())
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=NotificationCount(**type_counts, total=total)
    )


@router.post("/read-all", response_model=ApiResponse)
async def api_read_all_notifications(current_user: dict = Depends(get_current_user)):
    """标记所有通知为已读"""
    client = get_supabase_client()
    
    client.table("notifications").update({"is_read": True}).eq("user_id", current_user["id"]).eq("is_read", False).execute()
    
    return ApiResponse(
        success=True,
        message="全部标记为已读"
    )


@router.post("/{notification_id}/read", response_model=ApiResponse)
async def api_read_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """标记单个通知为已读"""
    client = get_supabase_client()
    
    client.table("notifications").update({"is_read": True}).eq("id", notification_id).eq("user_id", current_user["id"]).execute()
    
    return ApiResponse(
        success=True,
        message="标记为已读"
    )
