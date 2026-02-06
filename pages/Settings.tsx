import React from 'react';
import { View } from '../App';

interface SettingsProps {
  onNavigate: (view: View) => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  return (
    <div className="bg-gray-50 dark:bg-black h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-2 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50">
        <button 
          onClick={() => onNavigate(View.PROFILE)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="material-symbols-outlined text-gray-900 dark:text-white">arrow_back</span>
        </button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white">设置</h1>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4">
        
        {/* Account Section */}
        <section className="mb-6">
            <h3 className="px-1 mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">账号与安全</h3>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800">
                <SettingItem label="个人信息" value="已完善" />
                <SettingItem label="账号绑定" value="手机/微信" />
                <SettingItem label="修改密码" />
            </div>
        </section>

        {/* General Section */}
        <section className="mb-6">
            <h3 className="px-1 mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">通用</h3>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800">
                <SettingItem label="消息通知" toggle />
                <SettingItem label="清除缓存" value="24.5MB" />
                <SettingItem label="关于我们" value="v1.0.2" />
            </div>
        </section>

        {/* Logout Button */}
        <button 
            onClick={() => onNavigate(View.LOGIN)}
            className="w-full bg-white dark:bg-zinc-900 text-red-500 font-bold py-3.5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 active:bg-gray-50 dark:active:bg-zinc-800 transition-colors"
        >
            退出登录
        </button>

      </main>
    </div>
  );
};

const SettingItem = ({ label, value, toggle }: { label: string, value?: string, toggle?: boolean }) => (
    <button className="flex items-center justify-between w-full p-4 border-b border-gray-50 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
        <span className="text-sm font-medium text-slate-900 dark:text-white">{label}</span>
        <div className="flex items-center gap-2">
            {value && <span className="text-xs text-gray-400">{value}</span>}
            {toggle ? (
                <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                    <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
            ) : (
                <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
            )}
        </div>
    </button>
);

export default Settings;