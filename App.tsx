import React, { useState } from 'react';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import TopicFeed from './pages/TopicFeed';
import Events from './pages/Events';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import DailyCheckIn from './pages/DailyCheckIn';
import UserActivity from './pages/UserActivity';
import Settings from './pages/Settings';
import UserList from './pages/UserList';
import CreatePost from './pages/CreatePost';
import HelpAndFeedback from './pages/HelpAndFeedback';
import BottomNav from './components/BottomNav';

export enum View {
  WELCOME = 'WELCOME',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  HOME = 'HOME',
  TOPICS = 'TOPICS',
  TOPIC_FEED = 'TOPIC_FEED',
  TOPIC_DETAIL = 'TOPIC_DETAIL',
  EVENTS = 'EVENTS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  PROFILE = 'PROFILE',
  DAILY_CHECKIN = 'DAILY_CHECKIN',
  MY_POSTS = 'MY_POSTS',
  MY_BOOKMARKS = 'MY_BOOKMARKS',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS',
  USER_LIST = 'USER_LIST',
  CREATE_POST = 'CREATE_POST',
  HELP_AND_FEEDBACK = 'HELP_AND_FEEDBACK',
}

/**
 * 主应用内容组件
 * 使用 useAuth 钩子获取用户状态
 */
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<View>(View.WELCOME);
  const [userListType, setUserListType] = useState<'likes' | 'following' | 'followers'>('followers');

  // 如果用户已登录且当前在登录/注册/欢迎页面，自动跳转到首页
  React.useEffect(() => {
    if (isAuthenticated && [View.WELCOME, View.LOGIN, View.REGISTER].includes(currentView)) {
      setCurrentView(View.HOME);
    }
  }, [isAuthenticated, currentView]);

  // 加载中显示
  if (isLoading) {
    return (
      <div className="w-full h-full min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <span className="material-icons-round text-4xl text-yellow-DEFAULT animate-spin">refresh</span>
          <p className="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  // Helper to check if we should show the bottom navigation
  const showBottomNav = [
    View.HOME,
    View.TOPICS,
    View.EVENTS,
    View.NOTIFICATIONS,
    View.PROFILE,
  ].includes(currentView);

  const handleUserListNavigate = (type: 'likes' | 'following' | 'followers') => {
    setUserListType(type);
    setCurrentView(View.USER_LIST);
  };

  const renderView = () => {
    switch (currentView) {
      case View.WELCOME:
        return <Welcome onNavigate={setCurrentView} />;
      case View.LOGIN:
        return <Login onNavigate={setCurrentView} />;
      case View.REGISTER:
        return <Register onNavigate={setCurrentView} />;
      case View.HOME:
        return <Home onNavigate={setCurrentView} />;
      case View.TOPICS:
        return <Topics onNavigate={setCurrentView} />;
      case View.TOPIC_FEED:
        return <TopicFeed onNavigate={setCurrentView} />;
      case View.TOPIC_DETAIL:
        return <TopicDetail onNavigate={setCurrentView} />;
      case View.EVENTS:
        return <Events />;
      case View.NOTIFICATIONS:
        return <Notifications />;
      case View.PROFILE:
        return <Profile onNavigate={setCurrentView} onViewUsers={handleUserListNavigate} />;
      case View.DAILY_CHECKIN:
        return <DailyCheckIn onNavigate={setCurrentView} />;
      case View.MY_POSTS:
        return <UserActivity type="posts" onNavigate={setCurrentView} />;
      case View.MY_BOOKMARKS:
        return <UserActivity type="bookmarks" onNavigate={setCurrentView} />;
      case View.HISTORY:
        return <UserActivity type="history" onNavigate={setCurrentView} />;
      case View.SETTINGS:
        return <Settings onNavigate={setCurrentView} />;
      case View.USER_LIST:
        return <UserList type={userListType} onNavigate={setCurrentView} />;
      case View.CREATE_POST:
        return <CreatePost onNavigate={setCurrentView} />;
      case View.HELP_AND_FEEDBACK:
        return <HelpAndFeedback onNavigate={setCurrentView} />;
      default:
        return <Welcome onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="w-full max-w-md h-full min-h-screen bg-white dark:bg-bg-dark relative shadow-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {renderView()}
        </div>

        {showBottomNav && (
          <BottomNav currentView={currentView} onNavigate={setCurrentView} />
        )}
      </div>
    </div>
  );
};

/**
 * 根应用组件
 * 包裹 AuthProvider 提供用户状态
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;