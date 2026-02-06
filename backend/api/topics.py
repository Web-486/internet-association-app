"""
话题 API 路由
处理话题分类相关请求
"""
from typing import Optional
from fastapi import APIRouter, Query
from database import get_supabase_client
from models import TopicWithStats, TopicList, TopicCategory, ApiResponse


router = APIRouter(prefix="/topics", tags=["话题"])


@router.get("", response_model=ApiResponse[TopicList])
async def api_get_topics(
    category: Optional[str] = Query(None, description="分类筛选")
):
    """获取话题列表"""
    client = get_supabase_client()
    
    query = client.table("topics").select("*")
    
    if category:
        query = query.eq("category", category)
    
    result = query.order("post_count", desc=True).execute()
    
    topics = [TopicWithStats(**topic, new_post_count=0, is_followed=False) for topic in result.data]
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=TopicList(items=topics, total=len(topics))
    )


@router.get("/categories", response_model=ApiResponse[list[TopicCategory]])
async def api_get_topic_categories():
    """获取话题分类"""
    client = get_supabase_client()
    
    result = client.table("topics").select("*").order("post_count", desc=True).execute()
    
    # 按分类分组
    categories_map = {}
    for topic in result.data:
        category = topic.get("category", "其他")
        if category not in categories_map:
            categories_map[category] = {
                "name": category,
                "icon": "category",
                "topics": []
            }
        categories_map[category]["topics"].append(
            TopicWithStats(**topic, new_post_count=0, is_followed=False)
        )
    
    categories = [TopicCategory(**cat) for cat in categories_map.values()]
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=categories
    )


@router.get("/{topic_id}", response_model=ApiResponse[TopicWithStats])
async def api_get_topic(topic_id: str):
    """获取话题详情"""
    client = get_supabase_client()
    
    result = client.table("topics").select("*").eq("id", topic_id).execute()
    
    if not result.data:
        return ApiResponse(
            success=False,
            message="话题不存在",
            data=None
        )
    
    topic = result.data[0]
    
    return ApiResponse(
        success=True,
        message="获取成功",
        data=TopicWithStats(**topic, new_post_count=0, is_followed=False)
    )
