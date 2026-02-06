-- 互联网协会议题讨论 App - 数据库迁移脚本
-- 请在 Supabase SQL Editor 中执行此脚本

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    grade VARCHAR(10),
    major VARCHAR(100),
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 2. 话题分类表
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 帖子表
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 4. 评论表
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 活动表
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    location VARCHAR(200) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    category VARCHAR(50) NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 通知表
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL,
    content TEXT,
    reference_id UUID,
    reference_type VARCHAR(20),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 签到表
CREATE TABLE IF NOT EXISTS check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_date DATE NOT NULL,
    points_earned INTEGER NOT NULL,
    streak_days INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, check_date)
);

-- 8. 关注表
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- 9. 点赞表
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL,
    target_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_id, target_type)
);

-- 10. 收藏表
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_topic_id ON posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON check_ins(check_date);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- 插入初始话题数据
INSERT INTO topics (name, icon, color, category, description) VALUES
('前端开发', 'html', 'text-orange-500', '技术交流', 'React, Vue, CSS 动效交流'),
('后端与架构', 'dns', 'text-blue-500', '技术交流', 'Java, Go, 高并发, 云原生'),
('AI 与算法', 'smart_toy', 'text-purple-500', '技术交流', '大模型, 深度学习, CV/NLP'),
('课程与考试', 'menu_book', 'text-emerald-500', '校园生活', '选课避雷, 期末复习资料共享'),
('二手闲置', 'local_mall', 'text-pink-500', '校园生活', '毕业出物, 课本流转, 宿舍神器'),
('表白墙与吐槽', 'favorite', 'text-red-500', '校园生活', '匿名树洞, 寻找那个TA'),
('实习与秋招', 'work_outline', 'text-indigo-500', '求职发展', '面经分享, 内推码, Offer比较'),
('留学与深造', 'flight_takeoff', 'text-cyan-500', '求职发展', '申请攻略, 选校咨询, 语言考试')
ON CONFLICT DO NOTHING;

-- 插入示例活动数据
INSERT INTO events (title, description, image_url, location, start_time, category, tags, status) VALUES
('指尖绘意：弹幕狂想网页教学活动', 'AI辅助教学开发互动网页，体验实时弹幕涂鸦上墙。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8fuJdhhX0BPB57Qsw-PfTxaz6_bY0YRR07pKnP6cX9JpAn2oMSpZeUQBYwAHvAY6e8wDae5IRbJSOzY5cNOl3OaLHHwNflP-065k5QTapdFBhsGAE9yTXbPyTpBeWLhP5xqBiAEVIzpq9J84rhajNbkfhpNElNR3KjrBVb4K7r4JyqRCPKiGTb4c9DT8H6fXm4ZRiMo1iELKCpn-pdedV743OMDOC060LDIswhLXDfhaQcudJ-HYxDBJuKKF86rlkPHDvr1N0zjc', '武昌校区教4-204', NOW() + INTERVAL '7 days', '学术讲座', '["创艺杯", "网页开发"]', 'upcoming'),
('字节跳动秋招宣讲会 - 校园专场', 'HR 现场接收简历，含技术岗面试直通名额。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-pZsi-bU4yUHxnSYm8kbjdn8hD8xqiZJYHjoeKKZIffOAEQwuxRxyYG3n7hMGNtykpBClFJKT8RTRx4h5YGxUBdjeXKUzIk33knnXSRUsjLjyCqXQ-k5zddWcDBiraYdF96BSmwPjLPtdNBlOtaDo32Ux4BTihHyc6Nbns0kTvxeTLAZ1D7S_bo5UrOa7Li-C_4FhjmIwnfHigYi9Rg3vLEJ6w4MQhpRg6KBLoVj2MGtPfcbAqf5m5KuYg0hAHTacJJ2X6qys9oU', '学生活动中心 302', NOW() + INTERVAL '3 days', '求职', '["求职", "大厂"]', 'upcoming')
ON CONFLICT DO NOTHING;

-- 完成提示
SELECT '数据库迁移完成！' as message;
