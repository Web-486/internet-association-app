"""
活动数据模型
定义校园活动相关的 Pydantic 模型
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class EventBase(BaseModel):
    """活动基础模型"""
    title: str = Field(..., min_length=1, max_length=200, description="活动标题")
    description: str = Field(..., description="活动描述")
    image_url: Optional[str] = Field(None, description="封面图片")
    location: str = Field(..., max_length=200, description="活动地点")
    start_time: datetime = Field(..., description="开始时间")
    end_time: Optional[datetime] = Field(None, description="结束时间")
    category: str = Field(..., description="分类")
    tags: List[str] = Field(default_factory=list, description="标签")


class EventCreate(EventBase):
    """创建活动模型"""
    pass


class EventUpdate(BaseModel):
    """更新活动模型"""
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    image_url: Optional[str] = None
    location: Optional[str] = Field(None, max_length=200)
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None


class EventInDB(EventBase):
    """数据库中的活动模型"""
    id: str
    status: str = "upcoming"  # upcoming/ongoing/ended
    created_at: datetime
    
    class Config:
        from_attributes = True


class EventWithDetails(EventInDB):
    """包含详细信息的活动模型"""
    participant_count: int = 0
    is_registered: bool = False


class EventList(BaseModel):
    """活动列表响应模型"""
    items: List[EventWithDetails]
    total: int
    page: int
    page_size: int
