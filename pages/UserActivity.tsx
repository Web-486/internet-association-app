import React from 'react';
import { View } from '../App';

interface UserActivityProps {
  onNavigate: (view: View) => void;
  type: 'posts' | 'bookmarks' | 'history';
}

const UserActivity: React.FC<UserActivityProps> = ({ onNavigate, type }) => {
  const getTitle = () => {
    switch (type) {
      case 'posts': return '我的发布';
      case 'bookmarks': return '我的收藏';
      case 'history': return '浏览历史';
      default: return '列表';
    }
  };

  const renderContent = () => {
    if (type === 'posts') {
      return (
        <>
            <div className="mb-4 flex gap-2">
                <TabPill label="全部动态" active />
                <TabPill label="话题讨论" />
                <TabPill label="二手交易" />
            </div>
            <div className="flex flex-col gap-3">
                <PostCard 
                  avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuC1O9wWRafvrH1m6tswBbcS7H2fHuX49dM8S1gf_C0kDH_gO8aT2laRMQd4jpTaM2fd6EozdaxEOmVIhUQxxydgzS6zNbNNiInZQNKHOxuIuacQPy2o16nsfp6itKfISFpWVfO2zpnqX9cJlqKuju1DhDYXuW467LbqKk1ywRtKt3iKrqgzDyELBtZDySSI-rdAfGvCJ8fLwI_exD7Y5NHPopoKqU1tBWYN2Nz2WAS21A3NDfbiGZb7YWgQWgaAASwegMTtktkHX20"
                  name="林晓"
                  role="今天 09:30"
                  title="求助：有没有上过《人工智能导论》的同学？"
                  content="想问一下这门课期末考试的难度如何？需不需要提前很久复习？有没有往年真题可以分享一下，有偿求！"
                  tags={['#课程咨询', '#人工智能']}
                  likes={3}
                  comments={12}
                  isLiked={false}
                  onClick={() => onNavigate(View.TOPIC_DETAIL)}
                />
                <PostCard 
                  avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuC1O9wWRafvrH1m6tswBbcS7H2fHuX49dM8S1gf_C0kDH_gO8aT2laRMQd4jpTaM2fd6EozdaxEOmVIhUQxxydgzS6zNbNNiInZQNKHOxuIuacQPy2o16nsfp6itKfISFpWVfO2zpnqX9cJlqKuju1DhDYXuW467LbqKk1ywRtKt3iKrqgzDyELBtZDySSI-rdAfGvCJ8fLwI_exD7Y5NHPopoKqU1tBWYN2Nz2WAS21A3NDfbiGZb7YWgQWgaAASwegMTtktkHX20"
                  name="林晓"
                  role="3天前"
                  title="出几个闲置的机械键盘，99新"
                  content="Keychron K2，红轴，原包装还在。因为换了 HHKB 所以闲置了，校内面交，价格好商量。"
                  tags={['#二手交易', '#数码']}
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuD-pZsi-bU4yUHxnSYm8kbjdn8hD8xqiZJYHjoeKKZIffOAEQwuxRxyYG3n7hMGNtykpBClFJKT8RTRx4h5YGxUBdjeXKUzIk33knnXSRUsjLjyCqXQ-k5zddWcDBiraYdF96BSmwPjLPtdNBlOtaDo32Ux4BTihHyc6Nbns0kTvxeTLAZ1D7S_bo5UrOa7Li-C_4FhjmIwnfHigYi9Rg3vLEJ6w4MQhpRg6KBLoVj2MGtPfcbAqf5m5KuYg0hAHTacJJ2X6qys9oU"
                  likes={8}
                  comments={4}
                  isLiked={false}
                  onClick={() => onNavigate(View.TOPIC_DETAIL)}
                />
            </div>
        </>
      );
    }

    if (type === 'bookmarks') {
      return (
        <div className="flex flex-col gap-3">
             <PostCard 
                avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuB8fuJdhhX0BPB57Qsw-PfTxaz6_bY0YRR07pKnP6cX9JpAn2oMSpZeUQBYwAHvAY6e8wDae5IRbJSOzY5cNOl3OaLHHwNflP-065k5QTapdFBhsGAE9yTXbPyTpBeWLhP5xqBiAEVIzpq9J84rhajNbkfhpNElNR3KjrBVb4K7r4JyqRCPKiGTb4c9DT8H6fXm4ZRiMo1iELKCpn-pdedV743OMDOC060LDIswhLXDfhaQcudJ-HYxDBJuKKF86rlkPHDvr1N0zjc"
                name="李老师"
                role="教务处 • 昨天"
                title="关于2025年寒假放假安排的通知"
                content="各位同学：根据校历安排，今年寒假放假时间为1月15日至2月20日。请大家合理安排离校时间，注意..."
                tags={['#通知', '#放假']}
                likes={245}
                comments={12}
                isLiked={false}
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
                isLiked={true}
                onClick={() => onNavigate(View.TOPIC_DETAIL)}
            />
        </div>
      );
    }

    if (type === 'history') {
      return (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="text-xs font-bold text-gray-400 mb-3 ml-1 uppercase">今天</h3>
                <div className="flex flex-col gap-3">
                    <HistoryItem 
                        title="React 19 的新特性尝鲜，useActionState 太好用了"
                        author="技术宅小王"
                        time="10分钟前"
                        onClick={() => onNavigate(View.TOPIC_DETAIL)}
                    />
                    <HistoryItem 
                        title="有人一起组队做大作业吗？缺前端！"
                        author="张同学"
                        time="30分钟前"
                        onClick={() => onNavigate(View.TOPIC_DETAIL)}
                    />
                </div>
            </div>
            <div>
                <h3 className="text-xs font-bold text-gray-400 mb-3 ml-1 uppercase">昨天</h3>
                <div className="flex flex-col gap-3">
                    <HistoryItem 
                        title="2024 春季代码马拉松报名入口"
                        author="学生会"
                        time="昨天 14:20"
                        onClick={() => onNavigate(View.EVENTS)}
                    />
                     <HistoryItem 
                        title="指尖绘意：弹幕狂想网页教学活动"
                        author="创艺杯"
                        time="昨天 09:15"
                        onClick={() => onNavigate(View.EVENTS)}
                    />
                </div>
            </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-black h-full flex flex-col">
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

      <main className="flex-1 overflow-y-auto no-scrollbar p-4">
        {renderContent()}
      </main>
    </div>
  );
};

const TabPill = ({ label, active }: { label: string, active?: boolean }) => (
    <button className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${active ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-zinc-700'}`}>
        {label}
    </button>
);

const HistoryItem = ({ title, author, time, onClick }: any) => (
    <div onClick={onClick} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between active:scale-[0.99] transition-transform cursor-pointer shadow-sm">
        <div className="flex-1 min-w-0 mr-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 truncate">{title}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{author}</span>
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                <span>{time}</span>
            </div>
        </div>
        <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
    </div>
);

// Copied generic PostCard for standalone usage in this view
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

export default UserActivity;