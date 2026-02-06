"""
签到服务模块
处理每日签到相关的业务逻辑
"""
from datetime import datetime, date, timedelta
from typing import Optional
from database import get_supabase_client


async def get_check_in_status(user_id: str) -> dict:
    """获取用户签到状态"""
    client = get_supabase_client()
    today = date.today()
    
    # 获取用户积分
    user = client.table("users").select("points").eq("id", user_id).execute()
    current_points = user.data[0].get("points", 0) if user.data else 0
    
    # 检查今天是否已签到
    today_record = client.table("check_ins").select("*").eq("user_id", user_id).eq("check_date", today.isoformat()).execute()
    is_checked_today = bool(today_record.data)
    
    # 获取连续签到天数
    streak_days = 0
    if today_record.data:
        streak_days = today_record.data[0].get("streak_days", 0)
    else:
        # 检查昨天是否签到
        yesterday = today - timedelta(days=1)
        yesterday_record = client.table("check_ins").select("streak_days").eq("user_id", user_id).eq("check_date", yesterday.isoformat()).execute()
        if yesterday_record.data:
            streak_days = yesterday_record.data[0].get("streak_days", 0)
    
    return {
        "is_checked_today": is_checked_today,
        "current_points": current_points,
        "streak_days": streak_days,
        "today_points": today_record.data[0].get("points_earned", 0) if today_record.data else 0,
    }


async def do_check_in(user_id: str) -> dict:
    """执行签到"""
    client = get_supabase_client()
    today = date.today()
    
    # 检查今天是否已签到
    existing = client.table("check_ins").select("id").eq("user_id", user_id).eq("check_date", today.isoformat()).execute()
    if existing.data:
        raise ValueError("今天已经签到过了")
    
    # 计算连续签到天数
    yesterday = today - timedelta(days=1)
    yesterday_record = client.table("check_ins").select("streak_days").eq("user_id", user_id).eq("check_date", yesterday.isoformat()).execute()
    
    if yesterday_record.data:
        streak_days = yesterday_record.data[0].get("streak_days", 0) + 1
    else:
        streak_days = 1
    
    # 计算积分（连续签到越多积分越高）
    base_points = 10
    bonus = min(streak_days - 1, 6) * 5  # 最多额外30积分
    points_earned = base_points + bonus
    
    # 创建签到记录
    check_in_record = {
        "user_id": user_id,
        "check_date": today.isoformat(),
        "points_earned": points_earned,
        "streak_days": streak_days,
        "created_at": datetime.utcnow().isoformat(),
    }
    
    client.table("check_ins").insert(check_in_record).execute()
    
    # 更新用户积分
    user = client.table("users").select("points").eq("id", user_id).execute()
    current_points = user.data[0].get("points", 0) if user.data else 0
    new_points = current_points + points_earned
    
    client.table("users").update({"points": new_points}).eq("id", user_id).execute()
    
    return {
        "success": True,
        "points_earned": points_earned,
        "total_points": new_points,
        "streak_days": streak_days,
        "message": f"签到成功！获得 {points_earned} 积分，已连续签到 {streak_days} 天",
    }


async def get_week_check_ins(user_id: str) -> list:
    """获取本周签到情况"""
    client = get_supabase_client()
    today = date.today()
    
    # 获取本周的日期范围（周一到周日）
    monday = today - timedelta(days=today.weekday())
    
    week_data = []
    for i in range(7):
        check_date = monday + timedelta(days=i)
        is_today = check_date == today
        
        # 查询这一天的签到记录
        record = client.table("check_ins").select("*").eq("user_id", user_id).eq("check_date", check_date.isoformat()).execute()
        
        is_checked = bool(record.data)
        points = record.data[0].get("points_earned", 0) if record.data else (i + 1) * 5
        
        week_data.append({
            "day": i + 1,
            "is_checked": is_checked,
            "points": points,
            "is_today": is_today,
        })
    
    return week_data
