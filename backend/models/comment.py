"""
评论数据模型
定义评论相关的 Pydantic 模型
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class CommentBase(BaseModel):
    """评论基础模型"""
    content: str = Field(..., min_length=1, max_length=1000, description="评论内容")
    parent_id: Optional[str] = Field(None, description="父评论ID，用于嵌套回复")


class CommentCreate(CommentBase):
    """创建评论模型"""
    post_id: str = Field(..., description="帖子ID")


class CommentInDB(CommentBase):
    """数据库中的评论模型"""
    id: str
    post_id: str
    user_id: str
    like_count: int = 0
    created_at: datetime
    
    class Config:
        from_attributes = True


class CommentWithAuthor(CommentInDB):
    """包含作者信息的评论模型"""
    author_name: str
    author_avatar: Optional[str] = None
    author_tag: Optional[str] = None  # 如 "前端大佬"、"楼主" 等
    is_liked: bool = False
    reply_count: int = 0


class CommentList(BaseModel):
    """评论列表响应模型"""
    items: List[CommentWithAuthor]
    total: int
    page: int
    page_size: int
