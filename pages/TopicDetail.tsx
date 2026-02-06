import React from 'react';
import { View } from '../App';

interface TopicDetailProps {
  onNavigate: (view: View) => void;
}

const TopicDetail: React.FC<TopicDetailProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white dark:bg-black h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-2 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50">
        <button 
          onClick={() => onNavigate(View.TOPIC_FEED)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-900 dark:text-white">arrow_back</span>
        </button>
        
        <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                 <span className="material-symbols-outlined text-green-600 text-lg">diversity_3</span>
             </div>
             <span className="text-sm font-bold text-gray-900 dark:text-white">组队大厅</span>
        </div>

        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <span className="material-symbols-outlined text-gray-900 dark:text-white">more_horiz</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto w-full pb-24">
        {/* Post Container */}
        <article className="px-5 pt-4 pb-6 border-b border-gray-100 dark:border-zinc-800">
            {/* Author */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div 
                        className="w-10 h-10 rounded-full bg-cover bg-center border border-gray-100 dark:border-zinc-700" 
                        style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCgUhR1Sm9JyWl5vFd0_nTKSarCQ5tE2ZrXEazBeJyD19ZMTMNyiEWEsZurr4cxsGDrXJeTSvwXPzEqTOeU5HyLe2vbLQ34zkGuIPsBP86kjGmR0SQZYWaHghyD_ZGLkrhHRGB_DeWeij8QKbhoaaWaFjjLSJPj8CLmUqtqv4xeUcIR_U-Zy4GKpzXA9x0TfkeeFcq6iw2yAGyL9W_esibpeQXLNWubaYBj-TMxtB6yrGt4KocH39YBs5uZI6lbMOwACwF-VLe6n3o')` }}
                    ></div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">张同学</span>
                        <span className="text-xs text-gray-400">软件工程 23级 · 30分钟前</span>
                    </div>
                </div>
                <button className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                    + 关注
                </button>
            </div>

            {/* Title & Body */}
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-3">
                有人一起组队做大作业吗？缺前端！
            </h1>
            <div className="text-[16px] leading-relaxed text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                    下周的 Web 开发课大作业，目前我们有 2 个后端和 1 个 UI，急缺一个熟悉 React 的前端同学！大佬求带，或者一起学习也行！
                </p>
                <p>
                    项目计划做一个校园二手交易平台，技术栈是 Spring Boot + React。已经有初步的需求文档和 UI 设计稿了，就差前端实现了。
                </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-xs font-medium text-gray-600 dark:text-gray-400">#组队</span>
                <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-xs font-medium text-gray-600 dark:text-gray-400">#React</span>
                <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-xs font-medium text-gray-600 dark:text-gray-400">#大作业</span>
            </div>

             {/* Actions */}
             <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-zinc-800/50">
                <div className="flex gap-6">
                    <ActionBtn icon="favorite" count="12" />
                    <ActionBtn icon="chat_bubble" count="8" />
                    <ActionBtn icon="share" label="分享" />
                </div>
                <button className="text-gray-400">
                    <span className="material-symbols-outlined">bookmark</span>
                </button>
             </div>
        </article>

        {/* Filter/Sort for Comments */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50/50 dark:bg-zinc-900/50">
            <span className="text-sm font-bold text-gray-900 dark:text-white">全部评论 (8)</span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="font-bold text-gray-900 dark:text-gray-300">按热度</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </div>
        </div>

        {/* Comments List */}
        <div className="px-5">
            <Comment 
              avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCqbNb536Uhdmyrh2px_-TmtWXvMxrUu4vb7juQ-VnpMX_OGQCV4Tb8JZpdCc1PbUcZQnP-HNFVWFFoBGRjClnr0et4DiaKrH8Nj8nDh6W8yhq_24MZ3cA4CzUH_PuEsVCI1IGLHzho7M0B8-vamEp3uSMaoGgsbBVyXh4oCl2tX3qixqC3n2pZJPP4zjOL80dqVQ7MO1oVynus_uCDaAuvhgoRNjzM8sL99P8zvLxjwuwcm2e_ttUPkoI1PbuGAjCgxMpO9gy_gpw"
              name="技术宅小王"
              tag="前端大佬"
              time="10分钟前"
              content="正好我想练练手，熟悉 React，可以加我聊聊吗？"
              likes={5}
              replies={1}
            />
            <Comment 
              avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCTD_VzBuDmKEcsg_JTj2yWMvdhHkEacF7rJ977XAjBeDrR9dHv-eRLYXhLC8G2Imy4XVJUR4Wkj7gStUkBROxhWIh3XSwP_kSMnPtEgFoqkqaAWthrqMfpUBMoiDqnky9L23Do4xRC9is4CG1WBijoBFVHW7viP4MBOiYPc-RDDCT8y4VquZZUKI11RjXuTEejRfB9lLSVFWXXTDeTcaIv0T2C7gs_wuwe5xMkDEqFDpiR3MB432xseDyZE4ikuZwFAcBuY9C_5Fc"
              name="萌新求带"
              time="15分钟前"
              content="我只会一点 Vue，React 还在学，可以吗？"
              likes={2}
            />
             <Comment 
              avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuBRzd23eUAeSSi8fV5BoMXTf1_8XW7--_IbNFBim2nRZiE3awx9MwLjSCr-lcD03dkF1SdUR4PpYEQJLHtu-yS2PaThSEdYmHncP5dm_iFWwzRDS9PXuERFwCGounRSrfH4qb8Kr_IMuliAfLzGqEazU6oIB84Of82Klmb4Z5oB83IBqFC3YjXN5xYJSVu_yJtfUP8vCLhZVg_G5JXSIUQPyS6Y5Tm9v1G7iPm17dV_6y7xFcR1LoS_g-S7qE8PNGGU2fqoIUqHi0I"
              name="路人甲"
              time="20分钟前"
              content="帮顶，祝早日找到队友！"
              likes={1}
            />
        </div>
      </main>
      
      {/* Input Area */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 px-4 py-3 pb-safe z-50 flex items-center gap-3">
          <div className="flex-1 bg-gray-100 dark:bg-zinc-800 rounded-full px-4 py-2 text-sm text-gray-500">
            说点什么帮助他...
          </div>
          <button className="text-gray-400 hover:text-blue-600 transition-colors">
            <span className="material-symbols-outlined text-[28px]">send</span>
          </button>
      </div>
    </div>
  );
};

const ActionBtn = ({ icon, count, label }: any) => (
    <button className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors group">
        <span className="material-symbols-outlined text-[20px] group-active:scale-90 transition-transform">{icon}</span>
        <span className="text-xs font-medium">{count || label}</span>
    </button>
);

const Comment = ({ avatar, name, tag, time, content, likes, replies }: any) => (
  <div className="flex gap-3 py-4 border-b border-gray-50 dark:border-zinc-800/50 last:border-0">
    <div className="shrink-0 w-9 h-9 rounded-full bg-cover bg-center border border-gray-100 dark:border-zinc-700" style={{ backgroundImage: `url('${avatar}')` }}></div>
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
             <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{name}</span>
             {tag && <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-[10px] text-blue-600 dark:text-blue-400 font-medium">{tag}</span>}
        </div>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
      <p className="text-sm leading-normal text-gray-700 dark:text-gray-300">
        {content}
      </p>
      
      {replies && (
          <div className="mt-2 bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-bold text-blue-600 dark:text-blue-400">张同学</span> 等 {replies} 人回复了
          </div>
      )}

      <div className="flex items-center gap-5 mt-2">
        <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
          <span className="material-symbols-outlined text-[16px]">favorite</span>
          <span className="text-xs font-medium">{likes}</span>
        </button>
        <button className="text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors">回复</button>
      </div>
    </div>
  </div>
);

export default TopicDetail;