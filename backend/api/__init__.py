"""API 路由模块"""
from .auth import router as auth_router, get_current_user, get_current_user_optional
from .posts import router as posts_router
from .check_in import router as check_in_router
from .topics import router as topics_router
from .events import router as events_router
from .notifications import router as notifications_router
from .comments import router as comments_router
from .social import router as social_router

__all__ = [
    "auth_router",
    "posts_router",
    "check_in_router",
    "topics_router",
    "events_router",
    "notifications_router",
    "comments_router",
    "social_router",
    "get_current_user",
    "get_current_user_optional",
]
