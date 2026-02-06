import React, { useState } from 'react';
import { View } from '../App';

interface DailyCheckInProps {
  onNavigate: (view: View) => void;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onNavigate }) => {
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    setSigned(true);
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen flex flex-col pb-safe relative">
       {/* Background */}
       <div className="absolute top-0 left-0 w-full h-[45vh] bg-gradient-to-b from-yellow-500 to-yellow-400 dark:from-yellow-600 dark:to-yellow-800 rounded-b-[40px] z-0"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3">
        <button 
          onClick={() => onNavigate(View.HOME)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors text-white"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-white">每日签到</h1>
        <button className="text-white text-sm font-medium opacity-90">规则</button>
      </header>

      <main className="flex-1 px-4 z-10 pt-4 pb-10">
        {/* Sign In Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl mb-6 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
             
             <div className="flex flex-col items-center mb-6">
                 <span className="text-gray-500 dark:text-gray-400 text-sm mb-1">当前积分</span>
                 <span className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">2,450</span>
             </div>

             <button 
                onClick={handleSign}
                disabled={signed}
                className={`w-32 h-32 rounded-full mx-auto flex flex-col items-center justify-center shadow-lg transition-all ${signed ? 'bg-gray-100 dark:bg-zinc-800 cursor-default' : 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:scale-105 active:scale-95 shadow-orange-500/30'}`}
             >
                 {signed ? (
                     <>
                        <span className="material-symbols-outlined text-4xl text-green-500 mb-1">check_circle</span>
                        <span className="text-xs text-gray-400 font-bold">已签到</span>
                     </>
                 ) : (
                     <>
                        <span className="text-xl font-bold text-white mb-1">签到</span>
                        <span className="text-xs text-white/80">+10 积分</span>
                     </>
                 )}
             </button>
             
             <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                 已连续签到 <span className="text-orange-500 font-bold">3</span> 天
             </p>

             {/* Week Progress */}
             <div className="flex justify-between items-center mt-6 px-2">
                 {[1, 2, 3, 4, 5, 6, 7].map((day, i) => {
                     const isPast = i < 3;
                     const isToday = i === 3;
                     return (
                         <div key={day} className="flex flex-col items-center gap-2">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                 isPast ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500' :
                                 isToday && signed ? 'bg-yellow-500 text-white shadow-md' :
                                 'bg-gray-100 dark:bg-zinc-800 text-gray-400'
                             }`}>
                                 {isPast || (isToday && signed) ? <span className="material-symbols-outlined text-[16px]">check</span> : `+${(i+1)*5}`}
                             </div>
                             <span className="text-[10px] text-gray-400">{i === 3 ? '今天' : `${day}天`}</span>
                         </div>
                     );
                 })}
             </div>
        </div>

        {/* Tasks */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">做任务 赚积分</h3>
            <div className="flex flex-col gap-4">
                <TaskItem icon="forum" title="每日发帖" desc="发布 1 条话题动态" reward="+20" buttonText="去完成" />
                <TaskItem icon="favorite" title="互动达人" desc="点赞 5 个帖子" reward="+10" buttonText="去完成" />
                <TaskItem icon="share" title="分享内容" desc="分享 1 个优质内容" reward="+15" buttonText="去完成" />
            </div>
        </div>
      </main>
    </div>
  );
};

const TaskItem = ({ icon, title, desc, reward, buttonText }: any) => (
    <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-yellow-600 dark:text-yellow-500">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
            <div className="flex items-center gap-2">
                <span className="text-xs text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded">{reward}</span>
                <span className="text-xs text-gray-400">{desc}</span>
            </div>
        </div>
        <button className="px-3 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold transition-colors shadow-sm shadow-yellow-200 dark:shadow-none">
            {buttonText}
        </button>
    </div>
);

export default DailyCheckIn;