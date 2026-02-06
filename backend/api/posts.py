"""
帖子 API 路由
处理帖子相关请求
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Query

from models import (
    PostCreate, PostUpdate, PostWithAuthor, PostList,
    ApiResponse
)
from services import (
    create_post, get_post_by_id, get_posts,
    update_post, delete_post, like_post, bookmark_post
)
from api.auth import get_current_user, get_current_user_optional


router = APIRouter(prefix="/posts", tags=["帖子"])


@router.post("", response_model=ApiResponse[PostWithAuthor])
async def api_create_post(
    post_data: PostCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    发布帖子
    
    - **title**: 标题（必填）
    - **content**: 内容（必填）
    - **topic_id**: 话题ID（可选）
    - **tags**: 标签列表（可选）
    - **images**: 图片URL列表（可选）
    """
    try:
        post = await create_post(current_user["id"], post_data)
        return ApiResponse(
            success=True,
            message="发布成功",
            data=post
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=ApiResponse[PostList])
async def api_get_posts(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=50, description="每页数量"),
    topic_id: Optional[str] = Query(None, description="话题ID筛选"),
    user_id: Optional[str] = Query(None, description="用户ID筛选"),
    current_user: dict = Depends(get_current_user_optional)
):
    """
    获取帖子列表
    
    支持按话题和用户筛选
    """
    current_user_id = current_user["id"] if current_user else None
    result = await get_posts(
        page=page,
        page_size=page_size,
        topic_id=topic_id,
        user_id=user_id,
        current_user_id=current_user_id
    )
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=PostList(**result)
    )


@router.get("/{post_id}", response_model=ApiResponse[PostWithAuthor])
async def api_get_post(
    post_id: str,
    current_user: dict = Depends(get_current_user_optional)
):
    """获取帖子详情"""
    current_user_id = current_user["id"] if current_user else None
    post = await get_post_by_id(post_id, current_user_id)
    
    if not post:
        raise HTTPException(status_code=404, detail="帖子不存在")
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=post
    )


@router.put("/{post_id}", response_model=ApiResponse[PostWithAuthor])
async def api_update_post(
    post_id: str,
    update_data: PostUpdate,
    current_user: dict = Depends(get_current_user)
):
    """更新帖子"""
    try:
        post = await update_post(post_id, current_user["id"], update_data)
        return ApiResponse(
            success=True,
            message="更新成功",
            data=post
        )
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.delete("/{post_id}", response_model=ApiResponse)
async def api_delete_post(
    post_id: str,
    current_user: dict = Depends(get_current_user)
):
    """删除帖子"""
    try:
        await delete_post(post_id, current_user["id"])
        return ApiResponse(
            success=True,
            message="删除成功"
        )
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/{post_id}/like", response_model=ApiResponse)
async def api_like_post(
    post_id: str,
    current_user: dict = Depends(get_current_user)
):
    """点赞/取消点赞帖子"""
    is_liked = await like_post(post_id, current_user["id"])
    return ApiResponse(
        success=True,
        message="点赞成功" if is_liked else "取消点赞",
        data={"is_liked": is_liked}
    )


@router.post("/{post_id}/bookmark", response_model=ApiResponse)
async def api_bookmark_post(
    post_id: str,
    current_user: dict = Depends(get_current_user)
):
    """收藏/取消收藏帖子"""
    is_bookmarked = await bookmark_post(post_id, current_user["id"])
    return ApiResponse(
        success=True,
        message="收藏成功" if is_bookmarked else "取消收藏",
        data={"is_bookmarked": is_bookmarked}
    )
