"""
评论 API 路由
处理评论相关请求
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Query

from models import CommentCreate, CommentWithAuthor, CommentList, ApiResponse
from services.comment_service import (
    create_comment, get_comments_by_post, get_comment_replies,
    delete_comment, like_comment
)
from api.auth import get_current_user, get_current_user_optional


router = APIRouter(prefix="/comments", tags=["评论"])


@router.post("", response_model=ApiResponse[CommentWithAuthor])
async def api_create_comment(
    comment_data: CommentCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    发表评论
    
    - **post_id**: 帖子ID（必填）
    - **content**: 评论内容（必填）
    - **parent_id**: 父评论ID（可选，用于回复）
    """
    try:
        comment = await create_comment(current_user["id"], comment_data)
        return ApiResponse(
            success=True,
            message="评论成功",
            data=comment
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/post/{post_id}", response_model=ApiResponse[CommentList])
async def api_get_comments(
    post_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    current_user: dict = Depends(get_current_user_optional)
):
    """获取帖子的评论列表"""
    current_user_id = current_user["id"] if current_user else None
    result = await get_comments_by_post(post_id, page, page_size, current_user_id)
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=CommentList(**result)
    )


@router.get("/{comment_id}/replies", response_model=ApiResponse[CommentList])
async def api_get_replies(
    comment_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50)
):
    """获取评论的回复列表"""
    result = await get_comment_replies(comment_id, page, page_size)
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=CommentList(**result)
    )


@router.delete("/{comment_id}", response_model=ApiResponse)
async def api_delete_comment(
    comment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """删除评论"""
    try:
        await delete_comment(comment_id, current_user["id"])
        return ApiResponse(
            success=True,
            message="删除成功"
        )
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/{comment_id}/like", response_model=ApiResponse)
async def api_like_comment(
    comment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """点赞/取消点赞评论"""
    is_liked = await like_comment(comment_id, current_user["id"])
    return ApiResponse(
        success=True,
        message="点赞成功" if is_liked else "取消点赞",
        data={"is_liked": is_liked}
    )
