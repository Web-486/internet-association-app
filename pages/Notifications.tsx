import React, { useState, useEffect } from 'react';
import { api, Notification } from '../src/services/api';

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notification' | 'message' | 'mention'>('notification');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.getNotifications({ page: 1, page_size: 20 });
      if (response.success && response.data) {
        setNotifications(response.data.items);
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.readAllNotifications();
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Filter notifications for current tab (Since backend might return mixed types or we just show 'notification' type for general)
  // For now, assuming all API notifications go to 'notification' tab unless we have specific types for others
  const currentTabNotifications = notifications.filter(n => {
    if (activeTab === 'notification') return ['like', 'comment', 'follow'].includes(n.type);
    if (activeTab === 'mention') return n.type === 'mention';
    if (activeTab === 'message') return n.type === 'message';
    return false;
  });

  return (
    <div className="bg-bg-light dark:bg-bg-dark min-h-screen flex flex-col pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-bg-dark/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">消息中心</h2>
          <button
            onClick={handleMarkAllRead}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-500 dark:text-gray-400 active:scale-95"
            title="全部已读"
          >
            <span className="material-symbols-outlined text-xl">checklist</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 pb-0 flex border-b border-gray-100 dark:border-gray-800">
          <TabItem
            label="通知"
            active={activeTab === 'notification'}
            count={unreadCount > 0 && activeTab !== 'notification' ? unreadCount : undefined}
            onClick={() => setActiveTab('notification')}
          />
          <TabItem
            label="私信"
            active={activeTab === 'message'}
            onClick={() => setActiveTab('message')}
          />
          <TabItem
            label="@我"
            active={activeTab === 'mention'}
            onClick={() => setActiveTab('mention')}
          />
        </div>
      </header>

      {/* List */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-gray-400 text-3xl">refresh</span>
          </div>
        ) : (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            {currentTabNotifications.length > 0 ? (
              currentTabNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  data={notification}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                <p>暂无消息</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const TabItem = ({ label, active, count, onClick }: { label: string, active?: boolean, count?: number, onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`relative px-4 py-3 cursor-pointer flex items-center gap-1 transition-colors ${active ? 'border-b-2 border-slate-900 dark:border-white' : 'border-b-2 border-transparent'}`}
  >
    <span className={`text-sm font-bold ${active ? 'text-slate-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>{label}</span>
    {count && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full h-4 flex items-center justify-center">{count}</span>}
  </div>
);

const NotificationItem = ({ data }: { data: Notification }) => {
  // Helper to determine icon and action text
  const getMeta = (type: string) => {
    switch (type) {
      case 'like':
        return { icon: 'favorite', iconColor: 'text-red-500', action: '赞了你' };
      case 'comment':
        return { icon: 'chat_bubble', iconColor: 'text-green-500', action: '评论了你' };
      case 'follow':
        return { icon: 'person_add', iconColor: 'text-blue-500', action: '关注了你' };
      case 'mention':
        return { icon: 'alternate_email', iconColor: 'text-orange-500', action: '提到了你' };
      default:
        return { icon: 'notifications', iconColor: 'text-gray-500', action: '通知' };
    }
  };

  const { icon, iconColor, action } = getMeta(data.type);

  // Use fallback avatar if sender_avatar is missing
  const avatar = data.sender_avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCgUhR1Sm9JyWl5vFd0_nTKSarCQ5tE2ZrXEazBeJyD19ZMTMNyiEWEsZurr4cxsGDrXJeTSvwXPzEqTOeU5HyLe2vbLQ34zkGuIPsBP86kjGmR0SQZYWaHghyD_ZGLkrhHRGB_DeWeij8QKbhoaaWaFjjLSJPj8CLmUqtqv4xeUcIR_U-Zy4GKpzXA9x0TfkeeFcq6iw2yAGyL9W_esibpeQXLNWubaYBj-TMxtB6yrGt4KocH39YBs5uZI6lbMOwACwF-VLe6n3o";

  return (
    <div className={`flex gap-3 p-4 border-b border-gray-50 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors ${!data.is_read ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}`}>
      <div className="shrink-0 relative">
        <div className="w-10 h-10 rounded-full bg-cover bg-center border border-gray-100 dark:border-gray-700" style={{ backgroundImage: `url("${avatar}")` }}></div>
        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5">
          <span className={`material-symbols-outlined text-[14px] ${iconColor}`}>{icon}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <p className="text-sm text-gray-900 dark:text-white">
            <span className="font-bold">{data.sender_name || '用户'}</span> <span className="text-gray-500 font-normal">{action}</span>
          </p>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{new Date(data.created_at).toLocaleDateString()}</span>
        </div>

        {data.content && (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 mb-1.5">{data.content}</p>
        )}

        {data.reference_type === 'post' && (
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-md px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1 border border-gray-100 dark:border-gray-700">
            {data.source_title || '查看详情'}
          </div>
        )}

        {data.type === 'follow' && (
          <button className="mt-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full">
            回关
          </button>
        )}
      </div>

      {!data.is_read && <div className="self-center w-2 h-2 bg-red-500 rounded-full shrink-0"></div>}
    </div>
  );
};

export default Notifications;