import React, { useState } from 'react';
import { View } from '../App';
import { useAuth } from '../src/contexts/AuthContext';

interface LoginProps {
  onNavigate: (view: View) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    // 表单验证
    if (!studentId.trim()) {
      setError('请输入学号');
      return;
    }
    if (!password) {
      setError('请输入密码');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await login(studentId, password);
      onNavigate(View.HOME);
    } catch (err: any) {
      const message = err?.message || '登录失败，请检查账号和密码';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-white dark:bg-zinc-900 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-yellow-50/60 to-transparent dark:from-yellow-900/10 dark:to-transparent pointer-events-none z-0"></div>

      <div className="flex-1 flex flex-col px-8 pt-12 pb-8 z-10">
        <div className="mt-12 mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            欢迎登录
          </h1>
          <p className="mt-3 text-gray-400 dark:text-gray-500 text-sm font-medium">
            请输入您的账号信息
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-5 w-full">
          <div className="group">
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="学号"
              className="w-full bg-gray-50 dark:bg-zinc-800/50 border-0 ring-1 ring-gray-200 dark:ring-gray-700 rounded-2xl px-5 py-4 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-DEFAULT focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="group relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码"
              className="w-full bg-gray-50 dark:bg-zinc-800/50 border-0 ring-1 ring-gray-200 dark:ring-gray-700 rounded-2xl px-5 py-4 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-DEFAULT focus:bg-white dark:focus:bg-zinc-900 outline-none transition-all shadow-sm pr-12"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
              <span className="material-icons-round text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
          <div className="flex justify-end mt-2">
            <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              忘记密码?
            </button>
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="w-full space-y-6 mb-4 mt-8">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-yellow-DEFAULT hover:bg-yellow-hover disabled:bg-gray-300 text-black font-bold py-4 rounded-2xl shadow-glow transform active:scale-[0.98] transition-all duration-200 text-lg flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <span className="material-icons-round animate-spin mr-2">refresh</span>
                登录中...
              </>
            ) : '登录'}
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            没有账号？
            <button
              onClick={() => onNavigate(View.REGISTER)}
              className="text-yellow-DEFAULT font-bold hover:underline decoration-2 underline-offset-2 ml-1"
            >
              立即注册
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;