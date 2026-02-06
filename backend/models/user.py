"""
用户数据模型
定义用户相关的 Pydantic 模型
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """用户基础模型"""
    student_id: str = Field(..., min_length=1, max_length=20, description="学号")
    name: str = Field(..., min_length=1, max_length=50, description="姓名")
    email: Optional[EmailStr] = Field(None, description="邮箱")
    phone: Optional[str] = Field(None, max_length=20, description="手机号")
    grade: Optional[str] = Field(None, max_length=10, description="年级")
    major: Optional[str] = Field(None, max_length=100, description="专业")


class UserCreate(UserBase):
    """用户注册模型"""
    password: str = Field(..., min_length=6, max_length=100, description="密码")


class UserLogin(BaseModel):
    """用户登录模型"""
    account: str = Field(..., description="学号/手机号/邮箱")
    password: str = Field(..., description="密码")


class UserUpdate(BaseModel):
    """用户信息更新模型"""
    name: Optional[str] = Field(None, max_length=50)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    avatar_url: Optional[str] = None
    grade: Optional[str] = Field(None, max_length=10)
    major: Optional[str] = Field(None, max_length=100)


class UserInDB(UserBase):
    """数据库中的用户模型"""
    id: str
    avatar_url: Optional[str] = None
    points: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserPublic(BaseModel):
    """公开的用户信息模型"""
    id: str
    name: str
    avatar_url: Optional[str] = None
    grade: Optional[str] = None
    major: Optional[str] = None
    points: int = 0


class UserProfile(UserPublic):
    """用户详细资料模型"""
    student_id: str
    email: Optional[str] = None
    phone: Optional[str] = None
    follower_count: int = 0
    following_count: int = 0
    like_count: int = 0
    post_count: int = 0
    created_at: datetime


class UserStats(BaseModel):
    """用户统计信息"""
    follower_count: int = 0
    following_count: int = 0
    like_count: int = 0
    post_count: int = 0
