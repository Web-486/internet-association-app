"""
Supabase 客户端模块
提供数据库连接和操作
"""
from supabase import create_client, Client
from config.settings import get_settings


_supabase_client: Client | None = None


def get_supabase_client() -> Client:
    """
    获取 Supabase 客户端单例
    使用全局变量确保只创建一次连接
    """
    global _supabase_client
    
    if _supabase_client is None:
        settings = get_settings()
        _supabase_client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
    
    return _supabase_client


def get_supabase_admin_client() -> Client:
    """
    获取具有管理员权限的 Supabase 客户端
    使用 service_role_key，仅用于后端服务操作
    """
    settings = get_settings()
    return create_client(
        settings.supabase_url,
        settings.supabase_service_key
    )
