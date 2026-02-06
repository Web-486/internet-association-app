"""
认证服务模块
处理用户认证相关的业务逻辑
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
import bcrypt
from database import get_supabase_client
from config import get_settings
from models import UserCreate, UserInDB, UserLogin


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    try:
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False


def get_password_hash(password: str) -> str:
    """生成密码哈希"""
    try:
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode('utf-8')
    except Exception as e:
        print(f"Password hashing error: {e}")
        raise ValueError("密码处理失败")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """创建 JWT 访问令牌"""
    settings = get_settings()
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.jwt_secret_key, 
        algorithm=settings.jwt_algorithm
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """解码 JWT 令牌"""
    settings = get_settings()
    try:
        payload = jwt.decode(
            token, 
            settings.jwt_secret_key, 
            algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        return None


async def register_user(user_data: UserCreate) -> dict:
    """
    用户注册
    返回创建的用户信息
    """
    client = get_supabase_client()
    
    # 检查学号是否已存在
    existing = client.table("users").select("id").eq("student_id", user_data.student_id).execute()
    if existing.data:
        raise ValueError("该学号已注册")
    
    # 检查邮箱是否已存在
    if user_data.email:
        existing_email = client.table("users").select("id").eq("email", user_data.email).execute()
        if existing_email.data:
            raise ValueError("该邮箱已注册")
    
    # 创建用户
    hashed_password = get_password_hash(user_data.password)
    new_user = {
        "student_id": user_data.student_id,
        "name": user_data.name,
        "email": user_data.email,
        "phone": user_data.phone,
        "password_hash": hashed_password,
        "grade": user_data.grade,
        "major": user_data.major,
        "points": 0,
        "created_at": datetime.utcnow().isoformat(),
    }
    
    result = client.table("users").insert(new_user).execute()
    
    if result.data:
        return result.data[0]
    else:
        raise ValueError("注册失败，请稍后重试")


async def authenticate_user(login_data: UserLogin) -> Optional[dict]:
    """
    用户认证
    支持学号/手机号/邮箱登录
    """
    client = get_supabase_client()
    account = login_data.account
    
    # 尝试通过学号、邮箱或手机号查找用户
    user = None
    
    # 查询用户
    result = client.table("users").select("*").or_(
        f"student_id.eq.{account},email.eq.{account},phone.eq.{account}"
    ).execute()
    
    if result.data:
        user = result.data[0]
    
    if not user:
        return None
    
    # 验证密码
    if not verify_password(login_data.password, user.get("password_hash", "")):
        return None
    
    return user


async def get_user_by_id(user_id: str) -> Optional[dict]:
    """根据 ID 获取用户信息"""
    client = get_supabase_client()
    result = client.table("users").select("*").eq("id", user_id).execute()
    
    if result.data:
        return result.data[0]
    return None
