"""
签到数据模型
定义每日签到相关的 Pydantic 模型
"""
from datetime import datetime, date
from typing import List
from pydantic import BaseModel, Field


class CheckInCreate(BaseModel):
    """创建签到记录"""
    pass  # 签到不需要额外参数


class CheckInInDB(BaseModel):
    """数据库中的签到记录"""
    id: str
    user_id: str
    check_date: date
    points_earned: int
    streak_days: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class CheckInStatus(BaseModel):
    """签到状态模型"""
    is_checked_today: bool = False
    current_points: int = 0
    streak_days: int = 0
    today_points: int = 0


class CheckInWeek(BaseModel):
    """一周签到情况"""
    day: int  # 1-7
    is_checked: bool
    points: int
    is_today: bool


class CheckInResponse(BaseModel):
    """签到响应模型"""
    success: bool
    points_earned: int
    total_points: int
    streak_days: int
    message: str


class TaskItem(BaseModel):
    """任务项模型"""
    id: str
    icon: str
    title: str
    description: str
    reward: int
    is_completed: bool = False
    progress: int = 0
    target: int = 1
