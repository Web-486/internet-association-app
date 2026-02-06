import React from 'react';
import { View } from '../App';
import PullToRefresh from '../components/PullToRefresh';

interface TopicFeedProps {
  onNavigate: (view: View) => void;
}

const TopicFeed: React.FC<TopicFeedProps> = ({ onNavigate }) => {
  const handleRefresh = async () => {
    // Mock refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="bg-gray-50 dark:bg-black h-full flex flex-col relative">
      {/* Header with Topic Info */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 z-20">
        <div className="flex items-center justify-between px-2 py-2">
            <button 
                onClick={() => onNavigate(View.TOPICS)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <span className="material-symbols-outlined text-gray-900 dark:text-white">arrow_back</span>
            </button>
            <div className="flex flex-col items-center">
                <span className="text-base font-bold text-gray-900 dark:text-white">前端开发</span>
            </div>
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                <span className="material-symbols-outlined text-gray-900 dark:text-white">search</span>
            </button>
        </div>
        
        {/* Topic Stats Banner */}
        <div className="px-4 pb-4 pt-1 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-orange-500 text-3xl">html</span>
            </div>
            <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1">前端开发交流</h1>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>1,256 关注</span>
                    <span>•</span>
                    <span>563 帖子</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 line-clamp-1">探讨 React, Vue, CSS 动效以及前端工程化...</p>
            </div>
            <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm shadow-blue-500/30 active:scale-95 transition-transform">
                已关注
            </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center px-4 border-t border-gray-50 dark:border-zinc-800">
            <TabItem label="最新" active />
            <TabItem label="最热" />
            <TabItem label="精华" />
        </div>
      </header>

      {/* Feed List */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <PullToRefresh onRefresh={handleRefresh}>
            <div className="p-4 flex flex-col gap-3">
                {/* The Main Post (matches Detail View) */}
                <PostCard 
                avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCgUhR1Sm9JyWl5vFd0_nTKSarCQ5tE2ZrXEazBeJyD19ZMTMNyiEWEsZurr4cxsGDrXJeTSvwXPzEqTOeU5HyLe2vbLQ34zkGuIPsBP86kjGmR0SQZYWaHghyD_ZGLkrhHRGB_DeWeij8QKbhoaaWaFjjLSJPj8CLmUqtqv4xeUcIR_U-Zy4GKpzXA9x0TfkeeFcq6iw2yAGyL9W_esibpeQXLNWubaYBj-TMxtB6yrGt4KocH39YBs5uZI6lbMOwACwF-VLe6n3o"
                name="张同学"
                role="软件工程 23级 • 30分钟前"
                title="有人一起组队做大作业吗？缺前端！"
                content="下周的 Web 开发课大作业，目前我们有 2 个后端和 1 个 UI，急缺一个熟悉 React 的前端同学！大佬求带，或者一起学习也行！"
                tags={['#组队', '#React', '#大作业']}
                likes={12}
                comments={8}
                isLiked={false}
                onClick={() => onNavigate(View.TOPIC_DETAIL)}
                />

                <PostCard 
                avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCqbNb536Uhdmyrh2px_-TmtWXvMxrUu4vb7juQ-VnpMX_OGQCV4Tb8JZpdCc1PbUcZQnP-HNFVWFFoBGRjClnr0et4DiaKrH8Nj8nDh6W8yhq_24MZ3cA4CzUH_PuEsVCI1IGLHzho7M0B8-vamEp3uSMaoGgsbBVyXh4oCl2tX3qixqC3n2pZJPP4zjOL80dqVQ7MO1oVynus_uCDaAuvhgoRNjzM8sL99P8zvLxjwuwcm2e_ttUPkoI1PbuGAjCgxMpO9gy_gpw"
                name="技术宅小王"
                role="计算机科学 • 2小时前"
                title="React 19 的新特性尝鲜，useActionState 太好用了"
                content="今天试了一下 React 19 的 beta 版本，表单处理变得异常简单，不需要手动管理 pending 状态了..."
                tags={['#React', '#技术分享']}
                likes={45}
                comments={12}
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuA4hJq2g0k8p7r9s5t2u4v6x8y0z2B4C6D8E0F2G4H6I8J0K2L4M6N8P0Q2R4S6T8U0V2W4X6Y8Z0a2b4c6d8e0f2g4h6i8j0k2"
                onClick={() => onNavigate(View.TOPIC_DETAIL)}
                />

                <PostCard 
                avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCTD_VzBuDmKEcsg_JTj2yWMvdhHkEacF7rJ977XAjBeDrR9dHv-eRLYXhLC8G2Imy4XVJUR4Wkj7gStUkBROxhWIh3XSwP_kSMnPtEgFoqkqaAWthrqMfpUBMoiDqnky9L23Do4xRC9is4CG1WBijoBFVHW7viP4MBOiYPc-RDDCT8y4VquZZUKI11RjXuTEejRfB9lLSVFWXXTDeTcaIv0T2C7gs_wuwe5xMkDEqFDpiR3MB432xseDyZE4ikuZwFAcBuY9C_5Fc"
                name="CSS魔法师"
                role="数字媒体 • 5小时前"
                title="纯 CSS 实现 3D 旋转相册，附源码"
                content="不需要任何 JS，利用 CSS3 的 transform-style: preserve-3d 属性就可以实现..."
                tags={['#CSS', '#特效']}
                likes={89}
                comments={24}
                onClick={() => onNavigate(View.TOPIC_DETAIL)}
                />
                
                <div className="text-center py-4 text-xs text-gray-400">没有更多了</div>
            </div>
        </PullToRefresh>
      </main>

       {/* Floating Post Button */}
       <button 
        onClick={() => onNavigate(View.CREATE_POST)}
        className="absolute bottom-6 right-5 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all z-30"
      >
        <span className="material-symbols-outlined text-3xl">edit</span>
      </button>
    </div>
  );
};

const TabItem = ({ label, active }: { label: string, active?: boolean }) => (
    <button className={`relative px-4 py-3 text-sm font-medium transition-colors ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {label}
        {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>}
    </button>
);

const PostCard = ({ avatar, name, role, title, content, image, tags, likes, comments, isLiked, onClick }: any) => (
  <article 
    className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${avatar}")` }}></div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-[10px] text-gray-400">{role}</p>
        </div>
      </div>
      <button className="text-gray-300 hover:text-gray-600">
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </div>
    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-2">{title}</h3>
    
    {image && (
      <div className="w-full h-36 rounded-xl mb-3 bg-cover bg-center" style={{ backgroundImage: `url("${image}")` }}></div>
    )}

    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-3">{content}</p>
    
    <div className="flex flex-wrap gap-2 mb-3">
      {tags.map((tag: string, i: number) => {
        const color = i % 2 === 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
        return (
          <span key={tag} className={`px-2 py-0.5 rounded-md ${color} text-[10px] font-medium`}>{tag}</span>
        );
      })}
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-zinc-800">
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

export default TopicFeed;