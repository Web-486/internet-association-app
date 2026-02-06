/**
 * 用户认证 Context
 * 管理用户登录状态、用户信息
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, UserProfile } from '../services/api';

// 认证状态类型
interface AuthState {
    user: UserProfile | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// Context 类型
interface AuthContextType extends AuthState {
    login: (studentId: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

// 注册数据类型
interface RegisterData {
    studentId: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    grade?: string;
    major?: string;
}

// 创建 Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token 存储键名
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * 认证 Provider 组件
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: true,
        isAuthenticated: false,
    });

    // 初始化时检查本地存储的 token
    useEffect(() => {
        const initAuth = async () => {
            try {
                const savedToken = localStorage.getItem(TOKEN_KEY);
                const savedUser = localStorage.getItem(USER_KEY);

                if (savedToken && savedUser) {
                    // 设置 API token
                    api.setToken(savedToken);

                    // 验证 token 是否有效
                    try {
                        const response = await api.getMe();
                        if (response.success && response.data) {
                            setState({
                                user: response.data,
                                token: savedToken,
                                isLoading: false,
                                isAuthenticated: true,
                            });
                        } else {
                            throw new Error('Token invalid');
                        }
                    } catch {
                        // Token 无效，清除本地存储
                        localStorage.removeItem(TOKEN_KEY);
                        localStorage.removeItem(USER_KEY);
                        api.setToken(null);
                        setState({
                            user: null,
                            token: null,
                            isLoading: false,
                            isAuthenticated: false,
                        });
                    }
                } else {
                    setState(prev => ({ ...prev, isLoading: false }));
                }
            } catch {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        initAuth();
    }, []);

    /**
     * 登录
     */
    const login = async (studentId: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await api.login(studentId, password);

            if (response.success && response.data) {
                const { access_token } = response.data;

                // 设置 token 并获取用户信息
                api.setToken(access_token);

                const userResponse = await api.getMe();
                if (userResponse.success && userResponse.data) {
                    // 保存到本地存储
                    localStorage.setItem(TOKEN_KEY, access_token);
                    localStorage.setItem(USER_KEY, JSON.stringify(userResponse.data));

                    setState({
                        user: userResponse.data,
                        token: access_token,
                        isLoading: false,
                        isAuthenticated: true,
                    });
                } else {
                    throw new Error('获取用户信息失败');
                }
            } else {
                throw new Error(response.message || '登录失败');
            }
        } catch (error: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    /**
     * 注册
     */
    const register = async (data: RegisterData) => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await api.register({
                student_id: data.studentId,
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone,
                grade: data.grade,
                major: data.major,
            });

            if (response.success && response.data) {
                // 注册成功后自动登录
                await login(data.studentId, data.password);
            } else {
                throw new Error(response.message || '注册失败');
            }
        } catch (error: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    };

    /**
     * 登出
     */
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        api.logout();

        setState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
        });
    };

    /**
     * 刷新用户信息
     */
    const refreshUser = async () => {
        if (!state.token) return;

        try {
            const response = await api.getMe();
            if (response.success && response.data) {
                localStorage.setItem(USER_KEY, JSON.stringify(response.data));
                setState(prev => ({ ...prev, user: response.data }));
            }
        } catch {
            // Token 可能已失效
            logout();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/**
 * 使用认证 Context 的 Hook
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

/**
 * 检查是否已认证的 Hook
 */
export function useRequireAuth() {
    const auth = useAuth();

    if (!auth.isLoading && !auth.isAuthenticated) {
        console.warn('User is not authenticated');
    }

    return auth;
}

export default AuthContext;
