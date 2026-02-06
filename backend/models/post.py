"""
帖子数据模型
定义帖子相关的 Pydantic 模型
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class PostBase(BaseModel):
    """帖子基础模型"""
    title: str = Field(..., min_length=1, max_length=200, description="标题")
    content: str = Field(..., min_length=1, description="内容")
    topic_id: Optional[str] = Field(None, description="话题ID")
    tags: List[str] = Field(default_factory=list, description="标签列表")
    images: List[str] = Field(default_factory=list, description="图片URL列表")


class PostCreate(PostBase):
    """创建帖子模型"""
    pass


class PostUpdate(BaseModel):
    """更新帖子模型"""
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[str] = None
    topic_id: Optional[str] = None
    tags: Optional[List[str]] = None
    images: Optional[List[str]] = None


class PostInDB(PostBase):
    """数据库中的帖子模型"""
    id: str
    user_id: str
    like_count: int = 0
    comment_count: int = 0
    view_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PostWithAuthor(PostInDB):
    """包含作者信息的帖子模型"""
    author_name: str
    author_avatar: Optional[str] = None
    author_grade: Optional[str] = None
    author_major: Optional[str] = None
    is_liked: bool = False
    is_bookmarked: bool = False


class PostList(BaseModel):
    """帖子列表响应模型"""
    items: List[PostWithAuthor]
    total: int
    page: int
    page_size: int
    has_more: bool
