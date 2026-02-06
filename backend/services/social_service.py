"""
社交服务模块
处理用户关注相关的业务逻辑
"""
from datetime import datetime
from typing import Optional
from database import get_supabase_client


async def follow_user(follower_id: str, following_id: str) -> bool:
    """关注/取消关注用户"""
    client = get_supabase_client()
    
    if follower_id == following_id:
        raise ValueError("不能关注自己")
    
    # 检查是否已关注
    existing = client.table("follows").select("id").eq("follower_id", follower_id).eq("following_id", following_id).execute()
    
    if existing.data:
        # 取消关注
        client.table("follows").delete().eq("id", existing.data[0]["id"]).execute()
        return False
    else:
        # 添加关注
        client.table("follows").insert({
            "follower_id": follower_id,
            "following_id": following_id,
            "created_at": datetime.utcnow().isoformat(),
        }).execute()
        return True


async def get_followers(
    user_id: str,
    page: int = 1,
    page_size: int = 20,
    current_user_id: Optional[str] = None
) -> dict:
    """获取粉丝列表"""
    client = get_supabase_client()
    
    offset = (page - 1) * page_size
    result = client.table("follows").select(
        "*, follower:users!follower_id(id, name, avatar_url, grade, major)", 
        count="exact"
    ).eq("following_id", user_id).order(
        "created_at", desc=True
    ).range(offset, offset + page_size - 1).execute()
    
    followers = []
    for follow in result.data:
        user_data = follow.get("follower", {}) or {}
        
        # 检查当前用户是否关注了这个粉丝
        is_following = False
        if current_user_id and current_user_id != user_data.get("id"):
            check = client.table("follows").select("id").eq("follower_id", current_user_id).eq("following_id", user_data.get("id")).execute()
            is_following = bool(check.data)
        
        followers.append({
            "id": user_data.get("id"),
            "name": user_data.get("name", ""),
            "avatar_url": user_data.get("avatar_url"),
            "grade": user_data.get("grade"),
            "major": user_data.get("major"),
            "is_following": is_following,
        })
    
    total = result.count or 0
    
    return {
        "items": followers,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


async def get_following(
    user_id: str,
    page: int = 1,
    page_size: int = 20,
    current_user_id: Optional[str] = None
) -> dict:
    """获取关注列表"""
    client = get_supabase_client()
    
    offset = (page - 1) * page_size
    result = client.table("follows").select(
        "*, following:users!following_id(id, name, avatar_url, grade, major)", 
        count="exact"
    ).eq("follower_id", user_id).order(
        "created_at", desc=True
    ).range(offset, offset + page_size - 1).execute()
    
    following = []
    for follow in result.data:
        user_data = follow.get("following", {}) or {}
        
        # 当前用户是否关注（如果是自己的列表，全部都是已关注）
        is_following = user_id == current_user_id
        if not is_following and current_user_id:
            check = client.table("follows").select("id").eq("follower_id", current_user_id).eq("following_id", user_data.get("id")).execute()
            is_following = bool(check.data)
        
        following.append({
            "id": user_data.get("id"),
            "name": user_data.get("name", ""),
            "avatar_url": user_data.get("avatar_url"),
            "grade": user_data.get("grade"),
            "major": user_data.get("major"),
            "is_following": is_following,
        })
    
    total = result.count or 0
    
    return {
        "items": following,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


async def check_following(follower_id: str, following_id: str) -> bool:
    """检查是否关注"""
    client = get_supabase_client()
    
    result = client.table("follows").select("id").eq("follower_id", follower_id).eq("following_id", following_id).execute()
    return bool(result.data)


async def get_user_stats(user_id: str) -> dict:
    """获取用户统计信息"""
    client = get_supabase_client()
    
    # 粉丝数
    follower_result = client.table("follows").select("id", count="exact").eq("following_id", user_id).execute()
    follower_count = follower_result.count or 0
    
    # 关注数
    following_result = client.table("follows").select("id", count="exact").eq("follower_id", user_id).execute()
    following_count = following_result.count or 0
    
    # 获赞数（帖子 + 评论）
    post_likes = client.table("likes").select("id", count="exact").eq("target_type", "post").execute()
    comment_likes = client.table("likes").select("id", count="exact").eq("target_type", "comment").execute()
    # NOTE: 这里简化处理，实际应该统计用户的帖子和评论获得的赞
    like_count = 0
    
    # 帖子数
    post_result = client.table("posts").select("id", count="exact").eq("user_id", user_id).execute()
    post_count = post_result.count or 0
    
    return {
        "follower_count": follower_count,
        "following_count": following_count,
        "like_count": like_count,
        "post_count": post_count,
    }
