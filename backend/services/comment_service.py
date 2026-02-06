"""
评论服务模块
处理评论相关的业务逻辑
"""
from datetime import datetime
from typing import Optional
from database import get_supabase_client
from models import CommentCreate


async def create_comment(user_id: str, comment_data: CommentCreate) -> dict:
    """创建评论"""
    client = get_supabase_client()
    
    new_comment = {
        "post_id": comment_data.post_id,
        "user_id": user_id,
        "parent_id": comment_data.parent_id,
        "content": comment_data.content,
        "like_count": 0,
        "created_at": datetime.utcnow().isoformat(),
    }
    
    result = client.table("comments").insert(new_comment).execute()
    
    if result.data:
        # 更新帖子评论数
        post = client.table("posts").select("comment_count").eq("id", comment_data.post_id).execute()
        if post.data:
            new_count = post.data[0].get("comment_count", 0) + 1
            client.table("posts").update({"comment_count": new_count}).eq("id", comment_data.post_id).execute()
        
        return result.data[0]
    raise ValueError("评论失败")


async def get_comments_by_post(
    post_id: str,
    page: int = 1,
    page_size: int = 20,
    current_user_id: Optional[str] = None
) -> dict:
    """获取帖子的评论列表"""
    client = get_supabase_client()
    
    # 获取帖子作者 ID（用于标记楼主）
    post = client.table("posts").select("user_id").eq("id", post_id).execute()
    post_author_id = post.data[0]["user_id"] if post.data else None
    
    # 获取评论
    offset = (page - 1) * page_size
    result = client.table("comments").select(
        "*, users(id, name, avatar_url)", 
        count="exact"
    ).eq("post_id", post_id).is_("parent_id", "null").order(
        "created_at", desc=False
    ).range(offset, offset + page_size - 1).execute()
    
    comments = []
    for comment in result.data:
        user_data = comment.get("users", {}) or {}
        is_author = comment.get("user_id") == post_author_id
        
        # 获取回复数
        reply_result = client.table("comments").select("id", count="exact").eq("parent_id", comment["id"]).execute()
        reply_count = reply_result.count or 0
        
        comments.append({
            **{k: v for k, v in comment.items() if k != "users"},
            "author_name": user_data.get("name", ""),
            "author_avatar": user_data.get("avatar_url"),
            "author_tag": "楼主" if is_author else None,
            "is_liked": False,
            "reply_count": reply_count,
        })
    
    total = result.count or 0
    
    return {
        "items": comments,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


async def get_comment_replies(
    comment_id: str,
    page: int = 1,
    page_size: int = 10
) -> dict:
    """获取评论的回复列表"""
    client = get_supabase_client()
    
    offset = (page - 1) * page_size
    result = client.table("comments").select(
        "*, users(id, name, avatar_url)", 
        count="exact"
    ).eq("parent_id", comment_id).order(
        "created_at", desc=False
    ).range(offset, offset + page_size - 1).execute()
    
    replies = []
    for reply in result.data:
        user_data = reply.get("users", {}) or {}
        replies.append({
            **{k: v for k, v in reply.items() if k != "users"},
            "author_name": user_data.get("name", ""),
            "author_avatar": user_data.get("avatar_url"),
            "author_tag": None,
            "is_liked": False,
            "reply_count": 0,
        })
    
    total = result.count or 0
    
    return {
        "items": replies,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


async def delete_comment(comment_id: str, user_id: str) -> bool:
    """删除评论"""
    client = get_supabase_client()
    
    # 检查评论是否属于当前用户
    existing = client.table("comments").select("id, post_id").eq("id", comment_id).eq("user_id", user_id).execute()
    if not existing.data:
        raise ValueError("无权删除此评论")
    
    post_id = existing.data[0]["post_id"]
    
    # 删除评论
    client.table("comments").delete().eq("id", comment_id).execute()
    
    # 更新帖子评论数
    post = client.table("posts").select("comment_count").eq("id", post_id).execute()
    if post.data:
        new_count = max(0, post.data[0].get("comment_count", 0) - 1)
        client.table("posts").update({"comment_count": new_count}).eq("id", post_id).execute()
    
    return True


async def like_comment(comment_id: str, user_id: str) -> bool:
    """点赞/取消点赞评论"""
    client = get_supabase_client()
    
    # 检查是否已点赞
    existing = client.table("likes").select("id").eq("user_id", user_id).eq("target_id", comment_id).eq("target_type", "comment").execute()
    
    if existing.data:
        # 取消点赞
        client.table("likes").delete().eq("id", existing.data[0]["id"]).execute()
        # 减少点赞数
        comment = client.table("comments").select("like_count").eq("id", comment_id).execute()
        if comment.data:
            new_count = max(0, comment.data[0].get("like_count", 0) - 1)
            client.table("comments").update({"like_count": new_count}).eq("id", comment_id).execute()
        return False
    else:
        # 添加点赞
        client.table("likes").insert({
            "user_id": user_id,
            "target_id": comment_id,
            "target_type": "comment",
            "created_at": datetime.utcnow().isoformat(),
        }).execute()
        # 增加点赞数
        comment = client.table("comments").select("like_count").eq("id", comment_id).execute()
        if comment.data:
            new_count = comment.data[0].get("like_count", 0) + 1
            client.table("comments").update({"like_count": new_count}).eq("id", comment_id).execute()
        return True
