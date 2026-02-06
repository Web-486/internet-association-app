"""
通知数据模型
定义通知相关的 Pydantic 模型
"""
from datetime import datetime
from typing import Optional, List, Literal
from pydantic import BaseModel, Field


NotificationType = Literal["like", "comment", "follow", "mention", "system"]


class NotificationBase(BaseModel):
    """通知基础模型"""
    type: NotificationType = Field(..., description="通知类型")
    content: Optional[str] = Field(None, description="通知内容")
    reference_id: Optional[str] = Field(None, description="关联对象ID")
    reference_type: Optional[str] = Field(None, description="关联对象类型")


class NotificationCreate(NotificationBase):
    """创建通知模型"""
    user_id: str = Field(..., description="接收者ID")
    sender_id: Optional[str] = Field(None, description="发送者ID")


class NotificationInDB(NotificationBase):
    """数据库中的通知模型"""
    id: str
    user_id: str
    sender_id: Optional[str] = None
    is_read: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True


class NotificationWithSender(NotificationInDB):
    """包含发送者信息的通知模型"""
    sender_name: Optional[str] = None
    sender_avatar: Optional[str] = None
    source_title: Optional[str] = None  # 关联帖子/评论的标题


class NotificationList(BaseModel):
    """通知列表响应模型"""
    items: List[NotificationWithSender]
    total: int
    unread_count: int


class NotificationCount(BaseModel):
    """通知数量统计"""
    notification: int = 0
    message: int = 0
    mention: int = 0
    total: int = 0
