"""
社交 API 路由
处理用户关注相关请求
"""
from fastapi import APIRouter, HTTPException, Depends, Query

from models import ApiResponse, UserPublic
from services.social_service import (
    follow_user, get_followers, get_following, check_following, get_user_stats
)
from api.auth import get_current_user, get_current_user_optional


router = APIRouter(prefix="/social", tags=["社交"])


@router.post("/follow/{user_id}", response_model=ApiResponse)
async def api_follow_user(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """关注/取关用户"""
    try:
        is_following = await follow_user(current_user["id"], user_id)
        return ApiResponse(
            success=True,
            message="关注成功" if is_following else "取消关注",
            data={"is_following": is_following}
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/followers/{user_id}", response_model=ApiResponse)
async def api_get_followers(
    user_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    current_user: dict = Depends(get_current_user_optional)
):
    """获取用户的粉丝列表"""
    current_user_id = current_user["id"] if current_user else None
    result = await get_followers(user_id, page, page_size, current_user_id)
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=result
    )


@router.get("/following/{user_id}", response_model=ApiResponse)
async def api_get_following(
    user_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    current_user: dict = Depends(get_current_user_optional)
):
    """获取用户的关注列表"""
    current_user_id = current_user["id"] if current_user else None
    result = await get_following(user_id, page, page_size, current_user_id)
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=result
    )


@router.get("/check/{user_id}", response_model=ApiResponse)
async def api_check_following(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """检查是否关注了某用户"""
    is_following = await check_following(current_user["id"], user_id)
    return ApiResponse(
        success=True,
        message="获取成功",
        data={"is_following": is_following}
    )


@router.get("/stats/{user_id}", response_model=ApiResponse)
async def api_get_user_stats(user_id: str):
    """获取用户统计信息"""
    stats = await get_user_stats(user_id)
    return ApiResponse(
        success=True,
        message="获取成功",
        data=stats
    )
