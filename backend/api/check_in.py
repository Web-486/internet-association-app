"""
签到 API 路由
处理每日签到相关请求
"""
from fastapi import APIRouter, HTTPException, Depends

from models import CheckInStatus, CheckInResponse, CheckInWeek, ApiResponse
from services import get_check_in_status, do_check_in, get_week_check_ins
from api.auth import get_current_user


router = APIRouter(prefix="/check-in", tags=["签到"])


@router.get("/status", response_model=ApiResponse[CheckInStatus])
async def api_get_check_in_status(current_user: dict = Depends(get_current_user)):
    """获取当前用户签到状态"""
    status = await get_check_in_status(current_user["id"])
    return ApiResponse(
        success=True,
        message="获取成功",
        data=CheckInStatus(**status)
    )


@router.post("", response_model=ApiResponse[CheckInResponse])
async def api_do_check_in(current_user: dict = Depends(get_current_user)):
    """
    执行签到
    
    - 每日只能签到一次
    - 连续签到可获得额外积分奖励
    """
    try:
        result = await do_check_in(current_user["id"])
        return ApiResponse(
            success=True,
            message=result["message"],
            data=CheckInResponse(**result)
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/week", response_model=ApiResponse[list[CheckInWeek]])
async def api_get_week_check_ins(current_user: dict = Depends(get_current_user)):
    """获取本周签到情况"""
    week_data = await get_week_check_ins(current_user["id"])
    return ApiResponse(
        success=True,
        message="获取成功",
        data=[CheckInWeek(**item) for item in week_data]
    )
