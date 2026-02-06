import React from 'react';
import { View } from '../App';

interface UserListProps {
  onNavigate: (view: View) => void;
  type: 'likes' | 'following' | 'followers';
}

const UserList: React.FC<UserListProps> = ({ onNavigate, type }) => {
  const getTitle = () => {
    switch (type) {
      case 'likes': return '收到的赞';
      case 'following': return '我的关注';
      case 'followers': return '我的粉丝';
      default: return '用户列表';
    }
  };

  return (
    <div className="bg-white dark:bg-black h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 px-2 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50">
        <button 
          onClick={() => onNavigate(View.PROFILE)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-900 dark:text-white">arrow_back</span>
        </button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white flex-1 text-center pr-10">{getTitle()}</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {type === 'likes' && (
             <div className="px-4 py-2">
                <div className="text-xs text-gray-400 mb-2 px-1">最近收到的赞</div>
                <UserItem 
                    name="王大力" 
                    desc="赞了你的评论：二食堂的麻辣香锅确实变少了..." 
                    time="30分钟前"
                    avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAia8A_pRivOPVFIwY5Yfuo6ha3zItU_fEFF7BwWT4lazx0u4EdXDu37cFuBAfMqjGVA5sJBWVnQQdNRr1CtofLKj6mPTFeOxwiBmYxfwa87-CzFVzPP6tjVIL7OQinXPBFWvUQuTrWfz_f8EF_SBgUIWlSbgGsnhhrtUbAhv9uq_4TMctGnLitlCglfVcxi-PGaw4r36rz53C7wJSVyK--cDX-mPBgq1__utNUHz9Zj1RjV5IrdbtvBml2UeipoOlH-zjaFHQdRjU"
                    actionIcon="favorite"
                />
                <UserItem 
                    name="李子明" 
                    desc="赞了你的帖子：求助：有没有上过《人工智能导论》的同学？" 
                    time="2小时前"
                    avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuB5FR5n28KxgCeH503hpDnrpzG138tpjeVIDOxEcbb5PBHl2X317gHEfLeJZ9takAGhN1wxVw6y84QH3Y-5xwet3h66IoayrcgqdlGB3AV4VTh71Bo3t5cgyggV7yLuG5tVRewqYAXBalZh8VO8rrasRbAf8LyajtLbl653kMdCKNM-S4xzMyTTKZxvDqkzvl2yo1QjoCUZxduVt4ThBl-c1Lc8rYLvt8qTFBO5wpQd9LurFrVygdtcqXZxMjC4rMl5F9vO63pbDCo"
                    actionIcon="favorite"
                />
             </div>
        )}

        {type === 'following' && (
            <div className="flex flex-col">
                 <UserItem 
                    name="张同学" 
                    desc="软件工程 2023级" 
                    avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCgUhR1Sm9JyWl5vFd0_nTKSarCQ5tE2ZrXEazBeJyD19ZMTMNyiEWEsZurr4cxsGDrXJeTSvwXPzEqTOeU5HyLe2vbLQ34zkGuIPsBP86kjGmR0SQZYWaHghyD_ZGLkrhHRGB_DeWeij8QKbhoaaWaFjjLSJPj8CLmUqtqv4xeUcIR_U-Zy4GKpzXA9x0TfkeeFcq6iw2yAGyL9W_esibpeQXLNWubaYBj-TMxtB6yrGt4KocH39YBs5uZI6lbMOwACwF-VLe6n3o"
                    isFollowing
                />
                <UserItem 
                    name="互联网应用协会" 
                    desc="官方账号" 
                    avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuC1O9wWRafvrH1m6tswBbcS7H2fHuX49dM8S1gf_C0kDH_gO8aT2laRMQd4jpTaM2fd6EozdaxEOmVIhUQxxydgzS6zNbNNiInZQNKHOxuIuacQPy2o16nsfp6itKfISFpWVfO2zpnqX9cJlqKuju1DhDYXuW467LbqKk1ywRtKt3iKrqgzDyELBtZDySSI-rdAfGvCJ8fLwI_exD7Y5NHPopoKqU1tBWYN2Nz2WAS21A3NDfbiGZb7YWgQWgaAASwegMTtktkHX20"
                    isFollowing
                />
            </div>
        )}

        {type === 'followers' && (
            <div className="flex flex-col">
                 <UserItem 
                    name="陈小雨" 
                    desc="数字媒体 2024级" 
                    avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuBn5elqN4VArAaG9ZrYN9ep9ljMvpuucFWKmaI8jX5ebvgzVwr5z1dYbBXnrothDJoZ6EEoUYIyqUeDSuZSXB9ezlOa3FLJe91fHR40psNPdRPokSRrvxrC4EIZ21vDFQFl59gvW1TmGghb0FDAHf-0IQ25mu-4T93vr2ZFW6aej-JO9o12pvlrY3mNxPSnMQMG0TwbinjrOsHxCSSP64Eaaue5nfnKCkfmavzj8LC-I_YEDeDq2xc0qWOwaRKCqhmzf3B5W1sk0HA"
                />
                <UserItem 
                    name="路人甲" 
                    desc="计算机科学 2022级" 
                    avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuBRzd23eUAeSSi8fV5BoMXTf1_8XW7--_IbNFBim2nRZiE3awx9MwLjSCr-lcD03dkF1SdUR4PpYEQJLHtu-yS2PaThSEdYmHncP5dm_iFWwzRDS9PXuERFwCGounRSrfH4qb8Kr_IMuliAfLzGqEazU6oIB84Of82Klmb4Z5oB83IBqFC3YjXN5xYJSVu_yJtfUP8vCLhZVg_G5JXSIUQPyS6Y5Tm9v1G7iPm17dV_6y7xFcR1LoS_g-S7qE8PNGGU2fqoIUqHi0I"
                    isFollowing
                />
            </div>
        )}
      </main>
    </div>
  );
};

const UserItem = ({ name, desc, avatar, time, actionIcon, isFollowing }: any) => (
    <div className="flex items-center gap-3 p-4 border-b border-gray-50 dark:border-zinc-800 active:bg-gray-50 dark:active:bg-zinc-800/50 transition-colors cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-cover bg-center border border-gray-100 dark:border-zinc-700 relative" style={{ backgroundImage: `url('${avatar}')` }}>
             {actionIcon && (
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-800 rounded-full p-0.5 border border-gray-50 dark:border-zinc-700">
                    <span className="material-symbols-outlined text-[14px] text-pink-500">{actionIcon}</span>
                </div>
            )}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{name}</h4>
                {time && <span className="text-xs text-gray-400">{time}</span>}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{desc}</p>
        </div>
        {!actionIcon && (
            <button className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isFollowing ? 'bg-gray-100 dark:bg-zinc-800 text-gray-500' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'}`}>
                {isFollowing ? '已关注' : '关注'}
            </button>
        )}
    </div>
);

export default UserList;