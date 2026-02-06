import React, { useEffect } from 'react';
import { View } from '../App';
import { useAuth } from '../src/contexts/AuthContext';

interface ProfileProps {
  onNavigate: (view: View) => void;
  onViewUsers: (type: 'likes' | 'following' | 'followers') => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, onViewUsers }) => {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black">
        <span className="material-symbols-outlined animate-spin text-gray-400 text-3xl">refresh</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <button
          onClick={() => onNavigate(View.HOME)}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
        </button>
        <button
          onClick={() => onNavigate(View.SETTINGS)}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-900 dark:text-white">settings</span>
        </button>
      </header>

      {/* User Card */}
      <section className="px-4 pt-2 pb-6">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full border-2 border-white dark:border-zinc-800 shadow-md overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('${user.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuC1O9wWRafvrH1m6tswBbcS7H2fHuX49dM8S1gf_C0kDH_gO8aT2laRMQd4jpTaM2fd6EozdaxEOmVIhUQxxydgzS6zNbNNiInZQNKHOxuIuacQPy2o16nsfp6itKfISFpWVfO2zpnqX9cJlqKuju1DhDYXuW467LbqKk1ywRtKt3iKrqgzDyELBtZDySSI-rdAfGvCJ8fLwI_exD7Y5NHPopoKqU1tBWYN2Nz2WAS21A3NDfbiGZb7YWgQWgaAASwegMTtktkHX20"}')` }}></div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                  {user.major || '未设置专业'} · {user.grade || '未设置年级'}
                </p>
                <div className="flex gap-2">
                  {/* Mock roles based on name or ID, or just static for now as roles are not in UserProfile yet */}
                  <Tag label="协会成员" color="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
                  {user.student_id.startsWith('TEST') && <Tag label="测试账号" color="bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-50 dark:border-zinc-800">
            <StatItem value={String(user.like_count || 0)} label="获赞" onClick={() => onViewUsers('likes')} />
            <StatItem value={String(user.following_count || 0)} label="关注" onClick={() => onViewUsers('following')} />
            <StatItem value={String(user.follower_count || 0)} label="粉丝" onClick={() => onViewUsers('followers')} />
          </div>
        </div>
      </section>

      {/* My Activity Grid */}
      <section className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-2 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <ToolItem
            icon="edit_note"
            label="我的发布"
            color="text-blue-500"
            onClick={() => onNavigate(View.MY_POSTS)}
          />
          <ToolItem
            icon="bookmark_border"
            label="我的收藏"
            color="text-purple-500"
            onClick={() => onNavigate(View.MY_BOOKMARKS)}
          />
          <ToolItem
            icon="history"
            label="浏览历史"
            color="text-orange-500"
            onClick={() => onNavigate(View.HISTORY)}
          />
        </div>
      </section>

      {/* Community Menu */}
      <section className="px-4 mb-24 flex-1">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 ml-1">社区中心</h3>
        <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <MenuItem
            icon="help_outline"
            label="帮助与反馈"
            onClick={() => onNavigate(View.HELP_AND_FEEDBACK)}
          />
        </div>

        {/* Student Card */}
        <div className="mt-6 mx-1 h-32 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg relative overflow-hidden flex flex-col p-5 text-white">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            <span className="material-symbols-outlined text-[150px]">verified</span>
          </div>
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-xs opacity-70 uppercase tracking-wider mb-1">Student Member Card</p>
              <p className="font-bold text-lg">互联网应用协会</p>
            </div>
            <span className="material-symbols-outlined text-gold">verified</span>
          </div>
          <div className="mt-auto z-10 flex justify-between items-end">
            <p className="font-mono text-sm opacity-80">NO. {user.student_id}</p>
            <p className="text-xs bg-white/20 px-2 py-1 rounded">有效期至 2025.09</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const Tag = ({ label, color }: { label: string, color: string }) => (
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${color}`}>
    {label}
  </span>
);

const StatItem = ({ value, label, onClick }: { value: string, label: string, onClick?: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center group active:opacity-60 transition-opacity">
    <span className="text-lg font-black text-slate-900 dark:text-white">{value}</span>
    <span className="text-xs text-gray-400 font-medium group-hover:text-blue-600 transition-colors">{label}</span>
  </button>
);

const ToolItem = ({ icon, label, color, onClick }: { icon: string, label: string, color: string, onClick?: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group w-full">
    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center group-active:scale-95 transition-transform">
      <span className={`material-symbols-outlined text-[24px] ${color}`}>{icon}</span>
    </div>
    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{label}</span>
  </button>
);

const MenuItem = ({ icon, label, count, onClick }: { icon: string, label: string, count?: string, onClick?: () => void }) => (
  <button onClick={onClick} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-zinc-800 last:border-0 w-full text-left group">
    <span className="material-symbols-outlined text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{icon}</span>
    <span className="flex-1 text-sm font-medium text-slate-900 dark:text-white">{label}</span>
    {count && <span className="text-xs text-gray-400 mr-1">{count}</span>}
    <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
  </button>
);

export default Profile;