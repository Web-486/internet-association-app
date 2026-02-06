from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# 创建一个简单的测试应用来验证 Vercel 是否能运行
app = FastAPI()

# 添加 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 尝试导入后端
try:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(current_dir, '..', 'backend')
    sys.path.insert(0, backend_dir)
    
    from main import app as backend_app
    from api.router import router as api_router
    
    # 挂载后端路由
    app.include_router(api_router, prefix="")
    
    startup_status = "Backend loaded successfully"
    startup_error = None
except Exception as e:
    import traceback
    startup_status = "Backend import failed"
    startup_error = {
        "error": str(e),
        "traceback": traceback.format_exc(),
        "cwd": os.getcwd(),
        "backend_dir": backend_dir if 'backend_dir' in dir() else "not defined",
    }

@app.get("/")
async def root():
    return {"status": startup_status, "error": startup_error}

@app.post("/auth/login")
async def login_debug():
    if startup_error:
        return JSONResponse(status_code=500, content=startup_error)
    return {"message": "Login endpoint reached but backend not fully configured"}
