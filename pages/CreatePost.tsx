import React, { useState, useEffect } from 'react';
import { View } from '../App';
import { api, Topic } from '../src/services/api';

interface CreatePostProps {
  onNavigate: (view: View) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showTopicSelector, setShowTopicSelector] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await api.getTopics();
      if (response.success && response.data) {
        setTopics(response.data.items);
        // Default to first topic or none
        if (response.data.items.length > 0) {
          // setSelectedTopicId(response.data.items[0].id); // Optional: select default
        }
      }
    } catch (error) {
      console.error('Failed to fetch topics', error);
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) return;

    setIsPublishing(true);
    try {
      const response = await api.createPost({
        title: title,
        content: content,
        topic_id: selectedTopicId || undefined,
        images: images,
        tags: ["原创"] // Default tag for now
      });

      if (response.success) {
        onNavigate(View.HOME);
      } else {
        alert('发布失败: ' + response.message);
      }
    } catch (error: any) {
      console.error('Publish error:', error);
      alert('发布出错: ' + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddImage = () => {
    // Mock adding an image by cycling through examples
    const mockImages = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC1O9wWRafvrH1m6tswBbcS7H2fHuX49dM8S1gf_C0kDH_gO8aT2laRMQd4jpTaM2fd6EozdaxEOmVIhUQxxydgzS6zNbNNiInZQNKHOxuIuacQPy2o16nsfp6itKfISFpWVfO2zpnqX9cJlqKuju1DhDYXuW467LbqKk1ywRtKt3iKrqgzDyELBtZDySSI-rdAfGvCJ8fLwI_exD7Y5NHPopoKqU1tBWYN2Nz2WAS21A3NDfbiGZb7YWgQWgaAASwegMTtktkHX20',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4hJq2g0k8p7r9s5t2u4v6x8y0z2B4C6D8E0F2G4H6I8J0K2L4M6N8P0Q2R4S6T8U0V2W4X6Y8Z0a2b4c6d8e0f2g4h6i8j0k2',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD-pZsi-bU4yUHxnSYm8kbjdn8hD8xqiZJYHjoeKKZIffOAEQwuxRxyYG3n7hMGNtykpBClFJKT8RTRx4h5YGxUBdjeXKUzIk33knnXSRUsjLjyCqXQ-k5zddWcDBiraYdF96BSmwPjLPtdNBlOtaDo32Ux4BTihHyc6Nbns0kTvxeTLAZ1D7S_bo5UrOa7Li-C_4FhjmIwnfHigYi9Rg3vLEJ6w4MQhpRg6KBLoVj2MGtPfcbAqf5m5KuYg0hAHTacJJ2X6qys9oU'
    ];
    const randomImg = mockImages[Math.floor(Math.random() * mockImages.length)];
    setImages([...images, randomImg]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const selectedTopic = topics.find(t => t.id === selectedTopicId);

  return (
    <div className="bg-white dark:bg-black h-full flex flex-col relative z-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
        <button
          onClick={() => onNavigate(View.HOME)}
          className="text-gray-500 dark:text-gray-400 text-sm font-medium px-2 py-1"
        >
          取消
        </button>
        <h1 className="text-base font-bold text-gray-900 dark:text-white">发布帖子</h1>
        <button
          onClick={handlePublish}
          disabled={!content.trim() || isPublishing}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${content.trim()
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isPublishing && <span className="material-symbols-outlined text-xs animate-spin">refresh</span>}
          {isPublishing ? '发布中' : '发布'}
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <input
          type="text"
          placeholder="填写标题会让更多人看到哦~"
          className="w-full text-lg font-bold text-gray-900 dark:text-white placeholder-gray-400 border-none outline-none bg-transparent mb-4 p-0 focus:ring-0"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="分享你的新鲜事..."
          className="w-full h-40 text-base text-gray-700 dark:text-gray-300 placeholder-gray-400 border-none outline-none bg-transparent resize-none p-0 focus:ring-0 leading-relaxed"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {/* Selected Topic Display */}
        {selectedTopic && (
          <div className="flex items-center gap-1 mb-4">
            <span className="text-blue-600 font-bold text-sm">#{selectedTopic.name}</span>
            <button onClick={() => setSelectedTopicId('')} className="material-symbols-outlined text-gray-400 text-[16px]">close</button>
          </div>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {images.map((img, idx) => (
            <div key={idx} className="aspect-square relative rounded-xl overflow-hidden group">
              <img src={img} alt="upload" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          ))}
          {images.length < 9 && (
            <button
              onClick={handleAddImage}
              className="aspect-square bg-gray-50 dark:bg-zinc-800 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
              <span className="text-xs">添加图片</span>
            </button>
          )}
        </div>

        {/* Topic Selector Area (Simple toggle for now) */}
        {showTopicSelector && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-900 dark:text-white">选择话题</span>
              <button onClick={() => setShowTopicSelector(false)} className="text-xs text-blue-600">关闭</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setShowTopicSelector(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedTopicId === topic.id ? 'bg-blue-600 text-white' : 'bg-white dark:bg-zinc-700 text-gray-600 dark:text-gray-300'}`}
                >
                  {topic.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {!selectedTopic && (
            <TagPill icon="tag" label="添加话题" onClick={() => setShowTopicSelector(true)} />
          )}
          <TagPill icon="location_on" label="添加地点" />
        </div>
      </main>

      {/* Toolbar */}
      <div className="border-t border-gray-100 dark:border-zinc-800 px-4 py-3 flex items-center justify-between pb-safe">
        <div className="flex items-center gap-6">
          <ToolIcon icon="image" active onClick={handleAddImage} />
          <ToolIcon icon="alternate_email" />
          <ToolIcon icon="tag" onClick={() => setShowTopicSelector(!showTopicSelector)} />
          <ToolIcon icon="sentiment_satisfied" />
        </div>
        <span className="text-xs text-gray-400">{content.length}/1000</span>
      </div>
    </div>
  );
};

const ToolIcon = ({ icon, active, onClick }: any) => (
  <button onClick={onClick} className={`text-[24px] transition-colors ${active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
    <span className="material-symbols-outlined">{icon}</span>
  </button>
);

const TagPill = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 dark:bg-zinc-800 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 active:scale-95 transition-transform">
    <span className="material-symbols-outlined text-[16px] text-gray-400">{icon}</span>
    {label}
  </button>
);

export default CreatePost;