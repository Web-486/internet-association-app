"""
Vercel Serverless Function 入口
将所有 /api/* 请求转发到 FastAPI 后端路由
"""
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# 将 backend 目录加入 Python 路径
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, '..', 'backend')
sys.path.insert(0, backend_dir)

app = FastAPI()

# 添加 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 导入并挂载后端路由
try:
    from api import (
        auth_router, posts_router, check_in_router,
        topics_router, events_router, notifications_router,
        comments_router, social_router
    )

    # NOTE: Vercel rewrite 已将 /api/* 映射到此函数，
    # 所以 FastAPI 收到的路径是 /api/auth/login 等，
    # 需要用 /api 前缀挂载路由才能匹配
    app.include_router(auth_router, prefix="/api")
    app.include_router(posts_router, prefix="/api")
    app.include_router(check_in_router, prefix="/api")
    app.include_router(topics_router, prefix="/api")
    app.include_router(events_router, prefix="/api")
    app.include_router(notifications_router, prefix="/api")
    app.include_router(comments_router, prefix="/api")
    app.include_router(social_router, prefix="/api")

    startup_status = "Backend loaded successfully"
    startup_error = None
except Exception as e:
    import traceback
    startup_status = "Backend import failed"
    startup_error = {
        "error": str(e),
        "traceback": traceback.format_exc(),
        "cwd": os.getcwd(),
        "backend_dir": backend_dir,
        "sys_path": sys.path[:5],
    }


@app.get("/")
async def root():
    """根路径 - 显示启动状态"""
    return {"status": startup_status, "error": startup_error}


@app.get("/api/health")
async def health():
    """健康检查"""
    if startup_error:
        return JSONResponse(status_code=500, content=startup_error)
    return {"status": "ok"}
