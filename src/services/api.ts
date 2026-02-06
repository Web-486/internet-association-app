/**
 * API 服务层
 * 封装所有后端接口调用
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * API 请求封装
 */
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // 从 localStorage 恢复 token
    this.token = localStorage.getItem('access_token');
  }

  /**
   * 设置访问令牌
   */
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  /**
   * 获取当前令牌
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '请求失败' }));
      throw new Error(error.detail || error.message || '请求失败');
    }

    return response.json();
  }

  // ============ 认证相关 ============

  /**
   * 用户注册
   */
  async register(data: {
    student_id: string;
    name: string;
    password: string;
    email?: string;
    phone?: string;
    grade?: string;
    major?: string;
  }) {
    const result = await this.request<ApiResponse<any>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result;
  }

  /**
   * 用户登录
   */
  async login(account: string, password: string) {
    const result = await this.request<ApiResponse<{ access_token: string; expires_in: number }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ account, password }),
    });

    if (result.success && result.data) {
      this.setToken(result.data.access_token);
    }

    return result;
  }

  /**
   * 登出
   */
  logout() {
    this.setToken(null);
  }

  /**
   * 获取当前用户信息
   */
  async getMe() {
    return this.request<ApiResponse<UserProfile>>('/auth/me');
  }

  // ============ 帖子相关 ============

  /**
   * 获取帖子列表
   */
  async getPosts(params: {
    page?: number;
    page_size?: number;
    topic_id?: string;
    user_id?: string;
  } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.page_size) query.set('page_size', String(params.page_size));
    if (params.topic_id) query.set('topic_id', params.topic_id);
    if (params.user_id) query.set('user_id', params.user_id);

    return this.request<ApiResponse<PostList>>(`/posts?${query}`);
  }

  /**
   * 获取帖子详情
   */
  async getPost(postId: string) {
    return this.request<ApiResponse<Post>>(`/posts/${postId}`);
  }

  /**
   * 创建帖子
   */
  async createPost(data: {
    title: string;
    content: string;
    topic_id?: string;
    tags?: string[];
    images?: string[];
  }) {
    return this.request<ApiResponse<Post>>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 点赞帖子
   */
  async likePost(postId: string) {
    return this.request<ApiResponse<{ is_liked: boolean }>>(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  /**
   * 收藏帖子
   */
  async bookmarkPost(postId: string) {
    return this.request<ApiResponse<{ is_bookmarked: boolean }>>(`/posts/${postId}/bookmark`, {
      method: 'POST',
    });
  }

  // ============ 话题相关 ============

  /**
   * 获取话题列表
   */
  async getTopics(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<ApiResponse<TopicList>>(`/topics${query}`);
  }

  /**
   * 获取话题分类
   */
  async getTopicCategories() {
    return this.request<ApiResponse<TopicCategory[]>>('/topics/categories');
  }

  // ============ 活动相关 ============

  /**
   * 获取活动列表
   */
  async getEvents(params: {
    page?: number;
    page_size?: number;
    category?: string;
    status?: string;
  } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.page_size) query.set('page_size', String(params.page_size));
    if (params.category) query.set('category', params.category);
    if (params.status) query.set('status', params.status);

    return this.request<ApiResponse<EventList>>(`/events?${query}`);
  }

  /**
   * 获取活动详情
   */
  async getEvent(eventId: string) {
    return this.request<ApiResponse<Event>>(`/events/${eventId}`);
  }

  // ============ 通知相关 ============

  /**
   * 获取通知列表
   */
  async getNotifications(params: {
    page?: number;
    page_size?: number;
    type?: string;
  } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.page_size) query.set('page_size', String(params.page_size));
    if (params.type) query.set('type', params.type);

    return this.request<ApiResponse<NotificationList>>(`/notifications?${query}`);
  }

  /**
   * 获取未读通知数量
   */
  async getNotificationCount() {
    return this.request<ApiResponse<NotificationCount>>('/notifications/count');
  }

  /**
   * 标记所有通知为已读
   */
  async readAllNotifications() {
    return this.request<ApiResponse<null>>('/notifications/read-all', {
      method: 'POST',
    });
  }

  // ============ 签到相关 ============

  /**
   * 获取签到状态
   */
  async getCheckInStatus() {
    return this.request<ApiResponse<CheckInStatus>>('/check-in/status');
  }

  /**
   * 执行签到
   */
  async doCheckIn() {
    return this.request<ApiResponse<CheckInResponse>>('/check-in', {
      method: 'POST',
    });
  }

  /**
   * 获取本周签到情况
   */
  async getWeekCheckIns() {
    return this.request<ApiResponse<CheckInWeek[]>>('/check-in/week');
  }
}

// ============ 类型定义 ============

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

interface UserProfile {
  id: string;
  name: string;
  student_id: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  grade?: string;
  major?: string;
  points: number;
  follower_count: number;
  following_count: number;
  like_count: number;
  post_count: number;
}

interface Post {
  id: string;
  user_id: string;
  topic_id?: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  like_count: number;
  comment_count: number;
  view_count: number;
  created_at: string;
  author_name: string;
  author_avatar?: string;
  author_grade?: string;
  author_major?: string;
  is_liked: boolean;
  is_bookmarked: boolean;
}

interface PostList {
  items: Post[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

interface Topic {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  category: string;
  post_count: number;
  new_post_count: number;
  is_followed: boolean;
}

interface TopicList {
  items: Topic[];
  total: number;
}

interface TopicCategory {
  name: string;
  icon: string;
  topics: Topic[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  location: string;
  start_time: string;
  end_time?: string;
  category: string;
  tags: string[];
  status: string;
  participant_count: number;
  is_registered: boolean;
}

interface EventList {
  items: Event[];
  total: number;
  page: number;
  page_size: number;
}

interface Notification {
  id: string;
  user_id: string;
  sender_id?: string;
  type: string;
  content?: string;
  reference_id?: string;
  reference_type?: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
  source_title?: string;
}

interface NotificationList {
  items: Notification[];
  total: number;
  unread_count: number;
}

interface NotificationCount {
  notification: number;
  message: number;
  mention: number;
  total: number;
}

interface CheckInStatus {
  is_checked_today: boolean;
  current_points: number;
  streak_days: number;
  today_points: number;
}

interface CheckInResponse {
  success: boolean;
  points_earned: number;
  total_points: number;
  streak_days: number;
  message: string;
}

interface CheckInWeek {
  day: number;
  is_checked: boolean;
  points: number;
  is_today: boolean;
}

// 创建并导出 API 客户端实例
export const api = new ApiClient(API_BASE_URL);

// 导出类型
export type {
  ApiResponse,
  UserProfile,
  Post,
  PostList,
  Topic,
  TopicList,
  TopicCategory,
  Event,
  EventList,
  Notification,
  NotificationList,
  NotificationCount,
  CheckInStatus,
  CheckInResponse,
  CheckInWeek,
};
