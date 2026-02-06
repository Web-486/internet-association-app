"""
话题数据模型
定义话题分类相关的 Pydantic 模型
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class TopicBase(BaseModel):
    """话题基础模型"""
    name: str = Field(..., min_length=1, max_length=50, description="话题名称")
    icon: str = Field(..., description="图标名称")
    color: str = Field(..., description="主题色")
    description: Optional[str] = Field(None, description="话题描述")
    category: str = Field(..., description="分类：技术交流/校园生活/求职发展")


class TopicCreate(TopicBase):
    """创建话题模型"""
    pass


class TopicInDB(TopicBase):
    """数据库中的话题模型"""
    id: str
    post_count: int = 0
    created_at: datetime
    
    class Config:
        from_attributes = True


class TopicWithStats(TopicInDB):
    """包含统计信息的话题模型"""
    new_post_count: int = 0  # 今日新帖数
    is_followed: bool = False  # 当前用户是否关注


class TopicList(BaseModel):
    """话题列表响应模型"""
    items: List[TopicWithStats]
    total: int


class TopicCategory(BaseModel):
    """话题分类模型"""
    name: str
    icon: str
    topics: List[TopicWithStats]
