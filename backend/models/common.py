"""
通用响应模型
定义 API 响应格式
"""
from typing import Optional, Generic, TypeVar, Any
from pydantic import BaseModel


T = TypeVar('T')


class ApiResponse(BaseModel, Generic[T]):
    """统一 API 响应格式"""
    success: bool = True
    message: str = "操作成功"
    data: Optional[T] = None


class ErrorResponse(BaseModel):
    """错误响应格式"""
    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[Any] = None


class TokenResponse(BaseModel):
    """令牌响应格式"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class PaginatedResponse(BaseModel, Generic[T]):
    """分页响应格式"""
    items: list[T]
    total: int
    page: int
    page_size: int
    has_more: bool
