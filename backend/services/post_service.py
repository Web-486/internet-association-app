"""
帖子服务模块
处理帖子相关的业务逻辑
"""
from datetime import datetime
from typing import Optional, List
from database import get_supabase_client
from models import PostCreate, PostUpdate, PostWithAuthor


async def create_post(user_id: str, post_data: PostCreate) -> dict:
    """创建帖子"""
    client = get_supabase_client()
    
    new_post = {
        "user_id": user_id,
        "topic_id": post_data.topic_id,
        "title": post_data.title,
        "content": post_data.content,
        "images": post_data.images,
        "tags": post_data.tags,
        "like_count": 0,
        "comment_count": 0,
        "view_count": 0,
        "created_at": datetime.utcnow().isoformat(),
    }
    
    result = client.table("posts").insert(new_post).execute()
    
    if result.data:
        return result.data[0]
    raise ValueError("发布失败")


async def get_post_by_id(post_id: str, current_user_id: Optional[str] = None) -> Optional[dict]:
    """获取帖子详情"""
    client = get_supabase_client()
    
    # 获取帖子
    result = client.table("posts").select("*, users(id, name, avatar_url, grade, major)").eq("id", post_id).execute()
    
    if not result.data:
        return None
    
    post = result.data[0]
    
    # 增加浏览量
    client.table("posts").update({"view_count": post.get("view_count", 0) + 1}).eq("id", post_id).execute()
    
    # 检查当前用户是否点赞/收藏
    is_liked = False
    is_bookmarked = False
    
    if current_user_id:
        # 检查点赞
        like_result = client.table("likes").select("id").eq("user_id", current_user_id).eq("target_id", post_id).eq("target_type", "post").execute()
        is_liked = bool(like_result.data)
        
        # 检查收藏
        bookmark_result = client.table("bookmarks").select("id").eq("user_id", current_user_id).eq("post_id", post_id).execute()
        is_bookmarked = bool(bookmark_result.data)
    
    # 格式化返回数据
    user_data = post.get("users", {})
    return {
        **post,
        "author_name": user_data.get("name", ""),
        "author_avatar": user_data.get("avatar_url"),
        "author_grade": user_data.get("grade"),
        "author_major": user_data.get("major"),
        "is_liked": is_liked,
        "is_bookmarked": is_bookmarked,
    }


async def get_posts(
    page: int = 1,
    page_size: int = 20,
    topic_id: Optional[str] = None,
    user_id: Optional[str] = None,
    current_user_id: Optional[str] = None,
) -> dict:
    """获取帖子列表"""
    client = get_supabase_client()
    
    # 构建查询
    query = client.table("posts").select("*, users(id, name, avatar_url, grade, major)", count="exact")
    
    if topic_id:
        query = query.eq("topic_id", topic_id)
    
    if user_id:
        query = query.eq("user_id", user_id)
    
    # 分页
    offset = (page - 1) * page_size
    query = query.order("created_at", desc=True).range(offset, offset + page_size - 1)
    
    result = query.execute()
    
    posts = []
    for post in result.data:
        user_data = post.get("users", {})
        posts.append({
            **post,
            "author_name": user_data.get("name", ""),
            "author_avatar": user_data.get("avatar_url"),
            "author_grade": user_data.get("grade"),
            "author_major": user_data.get("major"),
            "is_liked": False,
            "is_bookmarked": False,
        })
    
    total = result.count or 0
    
    return {
        "items": posts,
        "total": total,
        "page": page,
        "page_size": page_size,
        "has_more": offset + len(posts) < total,
    }


async def update_post(post_id: str, user_id: str, update_data: PostUpdate) -> dict:
    """更新帖子"""
    client = get_supabase_client()
    
    # 检查帖子是否属于当前用户
    existing = client.table("posts").select("id").eq("id", post_id).eq("user_id", user_id).execute()
    if not existing.data:
        raise ValueError("无权修改此帖子")
    
    # 构建更新数据
    update_dict = update_data.model_dump(exclude_unset=True)
    update_dict["updated_at"] = datetime.utcnow().isoformat()
    
    result = client.table("posts").update(update_dict).eq("id", post_id).execute()
    
    if result.data:
        return result.data[0]
    raise ValueError("更新失败")


async def delete_post(post_id: str, user_id: str) -> bool:
    """删除帖子"""
    client = get_supabase_client()
    
    # 检查帖子是否属于当前用户
    existing = client.table("posts").select("id").eq("id", post_id).eq("user_id", user_id).execute()
    if not existing.data:
        raise ValueError("无权删除此帖子")
    
    client.table("posts").delete().eq("id", post_id).execute()
    return True


async def like_post(post_id: str, user_id: str) -> bool:
    """点赞帖子"""
    client = get_supabase_client()
    
    # 检查是否已点赞
    existing = client.table("likes").select("id").eq("user_id", user_id).eq("target_id", post_id).eq("target_type", "post").execute()
    
    if existing.data:
        # 取消点赞
        client.table("likes").delete().eq("id", existing.data[0]["id"]).execute()
        # 减少点赞数
        post = client.table("posts").select("like_count").eq("id", post_id).execute()
        if post.data:
            new_count = max(0, post.data[0].get("like_count", 0) - 1)
            client.table("posts").update({"like_count": new_count}).eq("id", post_id).execute()
        return False
    else:
        # 添加点赞
        client.table("likes").insert({
            "user_id": user_id,
            "target_id": post_id,
            "target_type": "post",
            "created_at": datetime.utcnow().isoformat(),
        }).execute()
        # 增加点赞数
        post = client.table("posts").select("like_count").eq("id", post_id).execute()
        if post.data:
            new_count = post.data[0].get("like_count", 0) + 1
            client.table("posts").update({"like_count": new_count}).eq("id", post_id).execute()
        return True


async def bookmark_post(post_id: str, user_id: str) -> bool:
    """收藏帖子"""
    client = get_supabase_client()
    
    # 检查是否已收藏
    existing = client.table("bookmarks").select("id").eq("user_id", user_id).eq("post_id", post_id).execute()
    
    if existing.data:
        # 取消收藏
        client.table("bookmarks").delete().eq("id", existing.data[0]["id"]).execute()
        return False
    else:
        # 添加收藏
        client.table("bookmarks").insert({
            "user_id": user_id,
            "post_id": post_id,
            "created_at": datetime.utcnow().isoformat(),
        }).execute()
        return True
