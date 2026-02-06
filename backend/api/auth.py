"""
认证 API 路由
处理用户注册、登录等请求
"""
from datetime import timedelta
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from models import (
    UserCreate, UserLogin, UserPublic, UserProfile,
    ApiResponse, TokenResponse, ErrorResponse
)
from services import (
    register_user, authenticate_user, create_access_token,
    decode_access_token, get_user_by_id
)
from config import get_settings


router = APIRouter(prefix="/auth", tags=["认证"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """获取当前登录用户"""
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="无效的访问令牌")
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="无效的访问令牌")
    
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="用户不存在")
    
    return user


async def get_current_user_optional(token: str = Depends(oauth2_scheme)) -> dict | None:
    """获取当前用户（可选）"""
    try:
        return await get_current_user(token)
    except HTTPException:
        return None


@router.post("/register", response_model=ApiResponse[UserPublic])
async def api_register(user_data: UserCreate):
    """
    用户注册
    
    - **student_id**: 学号（必填）
    - **name**: 姓名（必填）
    - **password**: 密码（必填，至少6位）
    - **email**: 邮箱（可选）
    - **phone**: 手机号（可选）
    - **grade**: 年级（可选）
    - **major**: 专业（可选）
    """
    try:
        user = await register_user(user_data)
        return ApiResponse(
            success=True,
            message="注册成功",
            data=UserPublic(**user)
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=ApiResponse[TokenResponse])
async def api_login(login_data: UserLogin):
    """
    用户登录
    
    - **account**: 学号/手机号/邮箱
    - **password**: 密码
    """
    user = await authenticate_user(login_data)
    if not user:
        raise HTTPException(status_code=401, detail="账号或密码错误")
    
    settings = get_settings()
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
    )
    
    return ApiResponse(
        success=True,
        message="登录成功",
        data=TokenResponse(
            access_token=access_token,
            expires_in=settings.access_token_expire_minutes * 60
        )
    )


@router.get("/me", response_model=ApiResponse[UserProfile])
async def api_get_me(current_user: dict = Depends(get_current_user)):
    """获取当前用户信息"""
    return ApiResponse(
        success=True,
        message="获取成功",
        data=UserProfile(**current_user)
    )
