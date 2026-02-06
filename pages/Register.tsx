import React, { useState } from 'react';
import { View } from '../App';
import { useAuth } from '../src/contexts/AuthContext';

interface RegisterProps {
  onNavigate: (view: View) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [form, setForm] = useState({
    name: '',
    studentId: '',
    grade: '',
    major: '',
    phone: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // 表单验证
    if (!form.name.trim()) {
      setError('请输入姓名');
      return;
    }
    if (!form.studentId.trim()) {
      setError('请输入学号');
      return;
    }
    if (!form.email.trim()) {
      setError('请输入邮箱');
      return;
    }
    if (!form.password) {
      setError('请设置密码');
      return;
    }
    if (form.password.length < 6) {
      setError('密码至少6位');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await register({
        studentId: form.studentId,
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        grade: form.grade || undefined,
        major: form.major || undefined,
      });
      onNavigate(View.HOME);
    } catch (err: any) {
      const message = err?.message || '注册失败，请稍后重试';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-white dark:bg-zinc-900 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-50/50 to-transparent dark:from-yellow-900/10 dark:to-transparent pointer-events-none z-0"></div>

      <div className="relative z-10 px-8 pt-8 pb-2 flex-none">
        <button
          onClick={() => onNavigate(View.LOGIN)}
          className="group flex items-center justify-center w-10 h-10 -ml-3 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors mb-4 text-gray-800 dark:text-gray-200"
        >
          <span className="material-icons-round text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
        </button>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">会员注册</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-4 z-10">
        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form className="space-y-5 pb-4" onSubmit={(e) => e.preventDefault()}>
          <InputGroup
            label="姓名"
            placeholder="请输入姓名"
            value={form.name}
            onChange={(v) => handleChange('name', v)}
            required
          />
          <InputGroup
            label="学号"
            placeholder="请输入学号"
            value={form.studentId}
            onChange={(v) => handleChange('studentId', v)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="年级"
              placeholder="如：2023级"
              value={form.grade}
              onChange={(v) => handleChange('grade', v)}
            />
            <InputGroup
              label="专业"
              placeholder="请输入专业"
              value={form.major}
              onChange={(v) => handleChange('major', v)}
            />
          </div>
          <InputGroup
            label="手机号码"
            placeholder="请输入手机号码"
            type="tel"
            value={form.phone}
            onChange={(v) => handleChange('phone', v)}
          />
          <InputGroup
            label="邮箱"
            placeholder="请输入邮箱地址"
            type="email"
            value={form.email}
            onChange={(v) => handleChange('email', v)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
              密码 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="设置登录密码（至少6位）"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full rounded-2xl border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 focus:border-yellow-DEFAULT focus:ring-yellow-DEFAULT transition-all py-3.5 px-5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-icons-round text-xl">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          <div className="h-4"></div>
        </form>
      </div>

      <div className="p-8 pt-4 bg-white dark:bg-zinc-900 z-20 flex-none border-t border-gray-100 dark:border-zinc-800/50">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-yellow-DEFAULT hover:bg-yellow-hover disabled:bg-gray-300 text-black font-bold py-4 rounded-2xl shadow-glow transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="material-icons-round animate-spin">refresh</span>
              <span>注册中...</span>
            </>
          ) : (
            <span>完成注册</span>
          )}
        </button>
      </div>
    </div>
  );
};

interface InputGroupProps {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required
}) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-800 focus:border-yellow-DEFAULT focus:ring-yellow-DEFAULT transition-all py-3.5 px-5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
    />
  </div>
);

export default Register;