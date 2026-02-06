import os
import sys

# 将 backend 目录添加到系统路径
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, '..', 'backend')
sys.path.insert(0, backend_dir)

try:
    from main import app
except Exception as e:
    # 如果导入失败，创建一个临时的 FastAPI 应用并返回错误信息
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    import traceback

    app = FastAPI()
    
    error_msg = str(e)
    trace_info = traceback.format_exc()
    
    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE"])
    async def catch_all(path_name: str):
        return JSONResponse(
            status_code=500,
            content={
                "error": "Backend Startup Error",
                "message": error_msg,
                "traceback": trace_info,
                "sys_path": sys.path[:5],
                "cwd": os.getcwd(),
                "backend_dir": backend_dir,
                "backend_exists": os.path.exists(backend_dir),
                "backend_files": os.listdir(backend_dir) if os.path.exists(backend_dir) else []
            }
        )
