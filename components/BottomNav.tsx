import React from 'react';
import { View } from '../App';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  // Determine active color based on the current view context
  // Home uses Blue, others use Gold/Beige theme mostly, but let's stick to a unified primary color for the nav active state 
  // or switch dynamically.
  // Based on screenshots: Home uses Blue, others use Gold. 
  // Let's use logic to switch active color class.
  
  const isHome = currentView === View.HOME;
  const activeColorClass = isHome ? 'text-blue-600' : 'text-gold';
  const inactiveColorClass = 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300';

  const NavItem = ({ view, icon, label, filledIcon }: { view: View; icon: string; label: string; filledIcon?: string }) => {
    const isActive = currentView === view;
    // Special handling for topic detail to keep 'Topics' or 'Home' active? 
    // Usually Detail hides nav or keeps parent active. For simplicity, if Detail is active, we might highlight Home or Topics.
    // But View.TOPIC_DETAIL is excluded from showBottomNav in App.tsx? 
    // Wait, the screenshot for Topic Detail shows it has NO bottom nav in the full view usually, 
    // OR it sits on top.
    // The screenshot for Topic Detail provided does NOT show a bottom nav. 
    // The screenshot for Topic Browsing DOES. 
    
    return (
      <button
        onClick={() => onNavigate(view)}
        className={`flex flex-col items-center justify-center w-full h-full gap-1 group ${isActive ? activeColorClass : inactiveColorClass}`}
      >
        <span 
          className={`material-symbols-outlined text-[24px] transition-transform group-active:scale-95 ${isActive && filledIcon ? 'filled' : ''}`}
        >
          {isActive && filledIcon ? filledIcon : icon}
        </span>
        <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav className="sticky bottom-0 w-full bg-white dark:bg-bg-dark border-t border-gray-100 dark:border-white/5 flex justify-around items-center h-[70px] pb-safe z-50">
      <NavItem view={View.HOME} icon="home" label="首页" filledIcon="home" />
      <NavItem view={View.TOPICS} icon="grid_view" label="话题" filledIcon="grid_view" />
      <NavItem view={View.EVENTS} icon="calendar_month" label="活动" filledIcon="calendar_month" />
      <NavItem view={View.NOTIFICATIONS} icon="chat_bubble" label="消息" filledIcon="chat_bubble" />
      <NavItem view={View.PROFILE} icon="person" label="我的" filledIcon="person" />
    </nav>
  );
};

export default BottomNav;