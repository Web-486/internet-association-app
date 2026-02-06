"""
互联网协会议题讨论 App - 后端服务
FastAPI 主入口文件
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from api import (
    auth_router, posts_router, check_in_router,
    topics_router, events_router, notifications_router,
    comments_router, social_router
)


# 创建 FastAPI 应用
settings = get_settings()
app = FastAPI(
    title=settings.app_name,
    description="校园互联网协会议题讨论平台后端 API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite 开发服务器
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 注册路由
app.include_router(auth_router, prefix="/api")
app.include_router(posts_router, prefix="/api")
app.include_router(check_in_router, prefix="/api")
app.include_router(topics_router, prefix="/api")
app.include_router(events_router, prefix="/api")
app.include_router(notifications_router, prefix="/api")
app.include_router(comments_router, prefix="/api")
app.include_router(social_router, prefix="/api")


@app.get("/")
async def root():
    """根路径"""
    return {
        "name": settings.app_name,
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
