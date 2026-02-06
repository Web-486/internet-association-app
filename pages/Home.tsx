import React, { useState, useEffect } from 'react';
import { View } from '../App';
import PullToRefresh from '../components/PullToRefresh';
import { api, Post } from '../src/services/api';
import { useAuth } from '../src/contexts/AuthContext';

interface HomeProps {
  onNavigate: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await api.getPosts({ page: 1, page_size: 10 });
      if (response.success && response.data) {
        setPosts(response.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPosts();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="bg-white min-h-screen pb-24">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center shadow-sm border border-gray-100 cursor-pointer"
                style={{ backgroundImage: `url("${user?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1O9wWRafvrH1m6tswBbcS7H2fHuX49dM8S1gf_C0kDH_gO8aT2laRMQd4jpTaM2fd6EozdaxEOmVIhUQxxydgzS6zNbNNiInZQNKHOxuIuacQPy2o16nsfp6itKfISFpWVfO2zpnqX9cJlqKuju1DhDYXuW467LbqKk1ywRtKt3iKrqgzDyELBtZDySSI-rdAfGvCJ8fLwI_exD7Y5NHPopoKqU1tBWYN2Nz2WAS21A3NDfbiGZb7YWgQWgaAASwegMTtktkHX20'}")` }}
                onClick={() => onNavigate(View.PROFILE)}
              ></div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">早安，同学</span>
              <span className="text-sm font-bold text-gray-900">{user?.name || '用户'}</span>
            </div>
          </div>
          <button
            className="relative p-2 rounded-full hover:bg-gray-50 transition-colors text-gray-500"
            onClick={() => onNavigate(View.NOTIFICATIONS)}
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="px-5 py-2 mt-2">
          <div className="relative flex items-center w-full h-11 bg-gray-50 rounded-xl border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
            <span className="material-symbols-outlined absolute left-3 text-gray-400 text-[20px]">search</span>
            <input
              type="text"
              className="w-full h-full bg-transparent pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none border-none focus:ring-0"
              placeholder="搜课程、找队友、看面经..."
            />
          </div>
        </div>

        {/* Quick Actions (New) */}
        <div className="grid grid-cols-4 gap-2 px-4 mt-4 mb-2">
          <QuickAction
            icon="edit_calendar"
            label="每日签到"
            color="bg-yellow-100 text-yellow-600"
            onClick={() => onNavigate(View.DAILY_CHECKIN)}
          />
          <QuickAction icon="school" label="学习资料" color="bg-blue-100 text-blue-600" />
          <QuickAction icon="diversity_3" label="组队大厅" color="bg-green-100 text-green-600" onClick={() => onNavigate(View.TOPICS)} />
          <QuickAction icon="campaign" label="社团公告" color="bg-purple-100 text-purple-600" />
        </div>

        {/* Announcement Marquee */}
        <div className="mx-5 mb-4 bg-orange-50 border border-orange-100 rounded-xl py-2.5 px-3 flex items-center gap-3 overflow-hidden">
          <span className="material-symbols-outlined text-orange-500 shrink-0" style={{ fontSize: '20px' }}>campaign</span>
          <div className="overflow-hidden relative flex-1 h-5">
            {/* Simple Marquee Animation */}
            <div className="absolute w-full whitespace-nowrap animate-[marquee_15s_linear_infinite] flex items-center">
              <span className="text-xs font-medium text-orange-700">📢 本周五晚 7 点：学长分享会《如何拿到大厂实习 Offer》... &nbsp;&nbsp;•&nbsp;&nbsp; 🏀 协会篮球赛开始报名啦！请各年级积极参与...</span>
            </div>
          </div>
        </div>
        <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

        {/* Stories / Featured */}
        <div className="pl-5 mt-2">
          <div className="flex items-center justify-between pr-5 mb-3">
            <h3 className="font-bold text-gray-900 text-base">校园热点</h3>
            <button className="text-xs text-blue-600 font-medium" onClick={() => onNavigate(View.EVENTS)}>查看全部</button>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 pr-5 no-scrollbar snap-x snap-mandatory">
            <FeaturedCard
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuA7XPxgoevDCgddOcRRm3ybaDwlMOMojB04ph4jYx_X157mvMPQ7pCz5IvsigMlOYbNkShB3zUunX8LzS3RWKqQx38kwnulBkuunXeZQiC0wKXwaQNYu4EhJaua5uapfk2T3lCYtY5cLM11IIwz0KnsapvbBXUra19_zbt7sRO5ZEl-9WUjPj2ZYvz9eJ9_Re95MXZWprFOOr8ac55eYsZMAPKspXwhMoNZXJNILo-XfLPNCIjA03R5x0g1dq2SBdmdYDymj9pbfyE"
              tag="校园黑客松"
              tagColor="bg-blue-600"
              title="2024 春季代码马拉松"
              date="图书馆报告厅 • 4月20日"
              onClick={() => onNavigate(View.EVENTS)}
            />
            <FeaturedCard
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuB8fuJdhhX0BPB57Qsw-PfTxaz6_bY0YRR07pKnP6cX9JpAn2oMSpZeUQBYwAHvAY6e8wDae5IRbJSOzY5cNOl3OaLHHwNflP-065k5QTapdFBhsGAE9yTXbPyTpBeWLhP5xqBiAEVIzpq9J84rhajNbkfhpNElNR3KjrBVb4K7r4JyqRCPKiGTb4c9DT8H6fXm4ZRiMo1iELKCpn-pdedV743OMDOC060LDIswhLXDfhaQcudJ-HYxDBJuKKF86rlkPHDvr1N0zjc"
              tag="新手讲座"
              tagColor="bg-purple-600"
              title="Python 数据分析入门"
              date="线上直播 • 周末晚 8 点"
            />
            <FeaturedCard
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuA4hJq2g0k8p7r9s5t2u4v6x8y0z2B4C6D8E0F2G4H6I8J0K2L4M6N8P0Q2R4S6T8U0V2W4X6Y8Z0a2b4c6d8e0f2g4h6i8j0k2"
              tag="职业发展"
              tagColor="bg-orange-600"
              title="大学生职业规划大赛报名"
              date="大学生活动中心 • 5月12日"
            />
          </div>
        </div>

        {/* Tags Filter */}
        <div className="sticky top-[73px] z-30 bg-white/95 backdrop-blur-sm pt-2 pb-2 pl-5 border-b border-gray-50">
          <div className="flex gap-2 overflow-x-auto pr-5 no-scrollbar pb-2">
            <FilterTag label="🔥 热门" active />
            <FilterTag label="求职/实习" />
            <FilterTag label="技术问答" />
            <FilterTag label="校园生活" />
            <FilterTag label="二手交易" />
          </div>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-3 px-5 pt-4">
          {isLoading && !isRefreshing ? (
            <div className="flex justify-center py-10">
              <span className="material-symbols-outlined animate-spin text-gray-300 text-3xl">refresh</span>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                avatar={post.author_avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCgUhR1Sm9JyWl5vFd0_nTKSarCQ5tE2ZrXEazBeJyD19ZMTMNyiEWEsZurr4cxsGDrXJeTSvwXPzEqTOeU5HyLe2vbLQ34zkGuIPsBP86kjGmR0SQZYWaHghyD_ZGLkrhHRGB_DeWeij8QKbhoaaWaFjjLSJPj8CLmUqtqv4xeUcIR_U-Zy4GKpzXA9x0TfkeeFcq6iw2yAGyL9W_esibpeQXLNWubaYBj-TMxtB6yrGt4KocH39YBs5uZI6lbMOwACwF-VLe6n3o"}
                name={post.author_name}
                role={`${post.author_major || '学生'} • ${new Date(post.created_at).toLocaleDateString()}`}
                title={post.title}
                content={post.content}
                image={post.images && post.images.length > 0 ? post.images[0] : undefined}
                tags={post.tags || []}
                likes={post.like_count}
                comments={post.comment_count}
                isLiked={post.is_liked}
                onTitleClick={() => onNavigate(View.TOPIC_DETAIL)}
                onClick={() => onNavigate(View.TOPIC_DETAIL)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
              <p>暂无帖子</p>
            </div>
          )}
        </div>

        {/* FAB */}
        <button
          onClick={() => onNavigate(View.CREATE_POST)}
          className="fixed bottom-24 right-5 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all z-30"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </PullToRefresh>
  );
};

const QuickAction = ({ icon, label, color, onClick }: { icon: string, label: string, color: string, onClick?: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 p-2 rounded-xl active:bg-gray-50 transition-colors">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      <span className="material-symbols-outlined text-[24px]">{icon}</span>
    </div>
    <span className="text-xs font-medium text-gray-700">{label}</span>
  </button>
);

const FeaturedCard = ({ image, tag, tagColor, title, date, onClick }: any) => (
  <div onClick={onClick} className="snap-center shrink-0 w-[85%] relative rounded-2xl overflow-hidden aspect-[2/1] group cursor-pointer shadow-md">
    <div
      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
      style={{ backgroundImage: `url("${image}")` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
    </div>
    <div className="absolute bottom-0 left-0 p-4 w-full">
      <span className={`inline-block px-2 py-0.5 mb-2 text-[10px] font-bold text-white ${tagColor} rounded-full`}>{tag}</span>
      <h3 className="text-base font-bold text-white leading-tight mb-0.5">{title}</h3>
      <p className="text-[10px] text-gray-300">{date}</p>
    </div>
  </div>
);

const FilterTag = ({ label, active }: { label: string, active?: boolean }) => (
  <button className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${active ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
    {label}
  </button>
);

const PostCard = ({ avatar, name, role, title, content, image, tags, likes, comments, isLiked, onTitleClick, onClick }: any) => (
  <article
    className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${avatar}")` }}></div>
        <div>
          <h4 className="text-xs font-bold text-gray-900">{name}</h4>
          <p className="text-[10px] text-gray-400">{role}</p>
        </div>
      </div>
      <button className="text-gray-300 hover:text-gray-600">
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </div>
    <h3 onClick={(e) => { e.stopPropagation(); onTitleClick && onTitleClick(); }} className="text-sm font-bold text-gray-900 mb-1.5 cursor-pointer hover:text-blue-600 transition-colors">{title}</h3>

    {image && (
      <div className="w-full h-36 rounded-xl mb-3 bg-cover bg-center" style={{ backgroundImage: `url("${image}")` }}></div>
    )}

    <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{content}</p>

    <div className="flex flex-wrap gap-2 mb-3">
      {tags.map((tag: string, i: number) => {
        const color = i % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600';
        return (
          <span key={tag} className={`px-2 py-0.5 rounded-md ${color} text-[10px] font-medium`}>{tag}</span>
        );
      })}
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
      <div className="flex gap-4">
        <button className={`flex items-center gap-1 transition-colors group ${isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}>
          <span className={`material-symbols-outlined text-[18px] ${isLiked ? 'filled' : 'group-hover:text-pink-500'}`}>favorite</span>
          <span className="text-[10px] font-medium">{likes}</span>
        </button>
        <button className="flex items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors group">
          <span className="material-symbols-outlined text-[18px] group-hover:text-blue-600">mode_comment</span>
          <span className="text-[10px] font-medium">{comments}</span>
        </button>
      </div>
      <button className="flex items-center text-gray-400 hover:text-blue-600 transition-colors">
        <span className="material-symbols-outlined text-[18px]">share</span>
      </button>
    </div>
  </article>
);

export default Home;