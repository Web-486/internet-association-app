import React, { useState } from 'react';
import { View } from '../App';

interface HelpAndFeedbackProps {
  onNavigate: (view: View) => void;
}

const HelpAndFeedback: React.FC<HelpAndFeedbackProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'feedback'>('faq');

  return (
    <div className="bg-gray-50 dark:bg-black h-full flex flex-col z-50 relative">
      {/* Header */}
      <header className="flex items-center gap-2 px-2 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50">
        <button 
          onClick={() => onNavigate(View.PROFILE)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-900 dark:text-white">arrow_back</span>
        </button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white flex-1 text-center pr-10">帮助与反馈</h1>
      </header>

      {/* Tabs */}
      <div className="flex p-4 gap-4 bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-50 dark:border-zinc-800/50">
        <button 
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'faq' ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900' : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400'}`}
        >
            常见问题
        </button>
        <button 
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'feedback' ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900' : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400'}`}
        >
            意见反馈
        </button>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-10">
        {activeTab === 'faq' ? (
            <div className="flex flex-col gap-3">
                <FAQItem question="如何修改个人资料？" answer="在「我的」页面点击右上角设置图标，进入「个人信息」即可修改头像、昵称、专业等资料。" />
                <FAQItem question="积分有什么用？" answer="您可以通过每日签到、发布帖子、评论互动等方式获取积分。积分可用于兑换协会周边纪念品或参与特定活动。" />
                <FAQItem question="帖子发布后可以修改吗？" answer="目前暂不支持修改已发布的帖子内容，建议您删除原贴后重新发布，或在评论区补充说明。" />
                <FAQItem question="如何申请加入社团干事？" answer="请留意首页「社团公告」栏目的招新通知，通常在每学期初会有统一招新面试，欢迎踊跃报名！" />
                <FAQItem question="账号密码忘记了怎么办？" answer="在登录页面点击「忘记密码」，通过绑定的手机号或邮箱验证后即可重置密码。" />
            </div>
        ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">问题描述</h3>
                <textarea 
                    className="w-full h-32 bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none resize-none border-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 mb-5"
                    placeholder="请详细描述您遇到的问题或建议，我们会认真倾听..."
                ></textarea>
                
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">联系方式 (选填)</h3>
                <input 
                    type="text" 
                    className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none border-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 mb-6"
                    placeholder="手机号 / 邮箱 / 微信号"
                />
                
                <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all">
                    提交反馈
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                    感谢您的反馈，我们通常会在 3 个工作日内回复。
                </p>
            </div>
        )}
      </main>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 transition-all">
            <button 
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">Q</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{question}</span>
                </div>
                <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            <div className={`px-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed overflow-hidden transition-all duration-300 ${expanded ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
                <div className="pl-9">{answer}</div>
            </div>
        </div>
    );
};

export default HelpAndFeedback;