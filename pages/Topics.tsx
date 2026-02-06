import React, { useState, useEffect } from 'react';
import { View } from '../App';
import PullToRefresh from '../components/PullToRefresh';
import { api, Topic } from '../src/services/api';

interface TopicsProps {
    onNavigate: (view: View) => void;
}

const Topics: React.FC<TopicsProps> = ({ onNavigate }) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchTopics = async () => {
        try {
            const response = await api.getTopics();
            if (response.success && response.data) {
                setTopics(response.data.items);
            }
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchTopics();
    };

    // Group topics by category
    const groupedTopics = topics.reduce((acc, topic) => {
        const category = topic.category || '其他';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(topic);
        return acc;
    }, {} as Record<string, Topic[]>);

    // Get followed topics
    const followedTopics = topics.filter(t => t.is_followed);

    return (
        <div className="bg-gray-50 dark:bg-black h-full flex flex-col">
            {/* Header */}
            <header className="flex flex-col bg-white dark:bg-zinc-900 shadow-sm z-10 relative">
                <div className="flex items-center justify-between px-4 py-3">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">话题广场</h1>
                    <button className="p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">add_circle</span>
                    </button>
                </div>
                <div className="px-4 pb-3">
                    <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 group-focus-within:text-blue-500 transition-colors text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="搜索感兴趣的话题、课程或社团..."
                            className="w-full h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-zinc-800 transition-all dark:text-white placeholder-gray-400"
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto no-scrollbar">
                <PullToRefresh onRefresh={handleRefresh}>
                    <div className="px-4 pt-4 pb-6">

                        {isLoading && !isRefreshing ? (
                            <div className="flex justify-center py-12">
                                <span className="material-symbols-outlined animate-spin text-gray-400 text-3xl">refresh</span>
                            </div>
                        ) : (
                            <>
                                {/* My Follows */}
                                {followedTopics.length > 0 && (
                                    <section className="mb-6">
                                        <div className="flex items-center justify-between mb-3 px-1">
                                            <h2 className="text-base font-bold text-gray-900 dark:text-white">我的关注</h2>
                                            <button className="text-xs text-blue-600 dark:text-blue-400 font-medium active:opacity-60">编辑</button>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {followedTopics.map(topic => (
                                                <QuickTopic
                                                    key={topic.id}
                                                    icon={topic.icon}
                                                    color={topic.color}
                                                    label={topic.name}
                                                    onClick={() => onNavigate(View.TOPIC_FEED)}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Categories */}
                                {Object.entries(groupedTopics).map(([category, categoryTopics]) => (
                                    <CategorySection key={category} title={category}>
                                        {categoryTopics.map(topic => (
                                            <TopicRow
                                                key={topic.id}
                                                icon={topic.icon}
                                                color={topic.color.includes('text') ? topic.color : `text-${topic.color.split('-')[1]}-500`}
                                                bg={topic.color.replace('text-', 'bg-').replace('500', '100') + ' dark:opacity-20'} // Simple bg generation
                                                title={topic.name}
                                                desc={topic.description || ''}
                                                updates={topic.new_post_count > 0 ? topic.new_post_count : undefined}
                                                onClick={() => onNavigate(View.TOPIC_FEED)}
                                            />
                                        ))}
                                    </CategorySection>
                                ))}

                                {topics.length === 0 && (
                                    <div className="text-center py-10 text-gray-400">
                                        <span className="material-symbols-outlined text-4xl mb-2">category</span>
                                        <p>暂无话题</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Bottom spacing */}
                        <div className="h-6"></div>
                    </div>
                </PullToRefresh>
            </main>
        </div>
    );
};

const QuickTopic = ({ icon, color, label, onClick }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-sm group-active:scale-95 transition-transform bg-opacity-10`}>
            {/* Added bg-opacity-10 because color usually includes text-color but expected bg-color in original */}
            <span className="material-symbols-outlined text-[28px]">{icon}</span>
        </div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </button>
);

const CategorySection = ({ title, children }: any) => (
    <div className="mb-6">
        <h3 className="px-1 mb-3 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
        <div className="flex flex-col gap-3">
            {children}
        </div>
    </div>
);

const TopicRow = ({ icon, color, bg, title, desc, updates, onClick }: any) => (
    <div onClick={onClick} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 active:scale-[0.99] transition-transform cursor-pointer">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
            <span className={`material-symbols-outlined text-[26px] ${color}`}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-1">{title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{desc}</p>
        </div>
        {updates && (
            <div className="shrink-0 flex flex-col items-end">
                <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-[10px] font-bold text-red-500">+{updates}</span>
            </div>
        )}
        <span className="material-symbols-outlined text-gray-300 text-[20px]">chevron_right</span>
    </div>
);

export default Topics;