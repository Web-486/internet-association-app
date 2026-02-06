"""
配置管理模块
从环境变量加载应用配置
"""
import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """应用配置类"""
    
    # Supabase 配置
    supabase_url: str = ""
    supabase_key: str = ""
    supabase_service_key: str = ""
    
    # JWT 配置
    jwt_secret_key: str = "dev_secret_key_change_in_production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    
    # 应用配置
    app_name: str = "互联网协会议题讨论"
    debug: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """
    获取配置单例
    使用 lru_cache 确保配置只加载一次
    """
    return Settings()
