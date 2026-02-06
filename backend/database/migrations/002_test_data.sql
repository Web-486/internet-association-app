-- 互联网协会议题讨论 App - 测试数据脚本
-- 请在 Supabase SQL Editor 中执行此脚本
-- 注意：请先执行 001_init.sql 创建表结构

-- ========================================
-- 1. 插入测试用户
-- ========================================
INSERT INTO users (id, student_id, name, email, phone, password_hash, avatar_url, grade, major, points, created_at) VALUES
-- 密码都是 123456，使用 bcrypt 加密
('11111111-1111-1111-1111-111111111111', 'TEST001', '张三', 'zhangsan@test.com', '13800138001', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.L5tGpPDSaW.Xqy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan', '2022级', '计算机科学', 150, NOW() - INTERVAL '30 days'),
('22222222-2222-2222-2222-222222222222', 'TEST002', '李四', 'lisi@test.com', '13800138002', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.L5tGpPDSaW.Xqy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', '2023级', '软件工程', 80, NOW() - INTERVAL '25 days'),
('33333333-3333-3333-3333-333333333333', 'TEST003', '王五', 'wangwu@test.com', '13800138003', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.L5tGpPDSaW.Xqy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu', '2021级', '人工智能', 220, NOW() - INTERVAL '60 days'),
('44444444-4444-4444-4444-444444444444', 'TEST004', '赵六', 'zhaoliu@test.com', '13800138004', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.L5tGpPDSaW.Xqy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu', '2022级', '数据科学', 95, NOW() - INTERVAL '20 days'),
('55555555-5555-5555-5555-555555555555', 'TEST005', '孙七', 'sunqi@test.com', '13800138005', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.L5tGpPDSaW.Xqy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunqi', '2023级', '网络安全', 45, NOW() - INTERVAL '10 days')
ON CONFLICT (student_id) DO NOTHING;

-- ========================================
-- 2. 插入测试帖子
-- ========================================
INSERT INTO posts (id, user_id, topic_id, title, content, images, tags, like_count, comment_count, view_count, created_at) VALUES
-- 张三的帖子
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 
 (SELECT id FROM topics WHERE name = '前端开发' LIMIT 1),
 'React 19 新特性体验分享',
 '最近尝试了 React 19 的新特性，Server Components 真的很强大！配合 Next.js 14 使用体验非常好。

主要体验的新特性：
1. Server Components - 服务端渲染组件，减少客户端 bundle 大小
2. Streaming - 流式渲染，提升首屏加载速度
3. Actions - 简化表单处理

大家有什么问题可以一起讨论！',
 '["https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400"]',
 '["React", "前端", "分享"]',
 25, 8, 156, NOW() - INTERVAL '5 days'),

-- 李四的帖子
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222',
 (SELECT id FROM topics WHERE name = '后端与架构' LIMIT 1),
 '求助：Go 语言并发编程最佳实践',
 '最近在学习 Go 语言，对于 goroutine 和 channel 的使用还有些疑惑。

我的问题是：
1. goroutine 池怎么实现比较好？
2. channel 什么时候该用 buffered 什么时候该用 unbuffered？
3. context 包的正确使用姿势？

希望有经验的大佬指点一下！',
 '[]',
 '["Go", "并发", "求助"]',
 12, 5, 89, NOW() - INTERVAL '3 days'),

-- 王五的帖子
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333',
 (SELECT id FROM topics WHERE name = 'AI 与算法' LIMIT 1),
 'GPT-5 来了！深度解析新版本能力提升',
 '今天 OpenAI 发布了 GPT-5，作为 AI 方向的学生，第一时间体验了一下。

主要提升：
- 推理能力大幅增强
- 多模态能力更加成熟
- 上下文窗口扩展到 200K
- 更低的延迟和成本

对于我们做 AI 应用开发的同学来说，这是一个好消息！',
 '["https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400", "https://images.unsplash.com/photo-1684369176170-463e84248b70?w=400"]',
 '["AI", "GPT", "深度学习"]',
 58, 15, 342, NOW() - INTERVAL '1 day'),

-- 赵六的帖子
('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444',
 (SELECT id FROM topics WHERE name = '实习与秋招' LIMIT 1),
 '字节跳动后端实习面经分享',
 '上周刚结束字节跳动的实习面试，趁热分享一下面经。

一面（60min）：
1. 自我介绍
2. 项目深挖
3. Redis 缓存穿透、击穿、雪崩
4. MySQL 索引优化
5. 手撕：LRU 缓存

二面（45min）：
1. 系统设计：设计一个短链服务
2. 分布式锁实现方案
3. 场景题：如何保证消息不丢失

HR 面已过，等 offer 中！祝大家面试顺利！',
 '[]',
 '["面试", "字节跳动", "面经"]',
 42, 12, 289, NOW() - INTERVAL '2 days'),

-- 孙七的帖子
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555',
 (SELECT id FROM topics WHERE name = '课程与考试' LIMIT 1),
 '期末复习资料分享 - 数据结构与算法',
 '期末周临近，整理了一份数据结构与算法的复习资料分享给大家。

包含内容：
- 各章节知识点思维导图
- 历年真题及答案
- 常见算法模板代码
- 易错点总结

需要的同学可以评论区留言，我私发给你们~',
 '[]',
 '["复习", "数据结构", "资料分享"]',
 35, 20, 178, NOW() - INTERVAL '4 hours')
ON CONFLICT DO NOTHING;

-- ========================================
-- 3. 插入测试评论（使用有效的 UUID 格式）
-- ========================================
INSERT INTO comments (id, post_id, user_id, parent_id, content, like_count, created_at) VALUES
-- React 帖子的评论
('c1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', NULL, 
 '感谢分享！Server Components 确实很强大，我们团队也在考虑迁移。', 5, NOW() - INTERVAL '4 days'),
('c2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', NULL,
 '请问 Server Components 和传统的 SSR 有什么区别呢？', 3, NOW() - INTERVAL '3 days'),
('c3333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222',
 '主要区别是 Server Components 可以在服务器上渲染，但不会发送到客户端，减少了 JS bundle 大小。', 8, NOW() - INTERVAL '3 days'),

-- Go 帖子的评论  
('c4444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', NULL,
 '推荐看一下 Go 语言圣经和 Go 并发编程实战这两本书，讲得很清楚。', 6, NOW() - INTERVAL '2 days'),
('c5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', NULL,
 '我之前用 ants 这个库做 goroutine 池，性能很不错。', 4, NOW() - INTERVAL '2 days'),

-- GPT-5 帖子的评论
('c6666666-6666-6666-6666-666666666666', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', NULL,
 '太强了！已经迫不及待想体验了！', 12, NOW() - INTERVAL '20 hours'),
('c7777777-7777-7777-7777-777777777777', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', NULL,
 '请问 API 价格怎么样？学生党表示关心成本...', 8, NOW() - INTERVAL '18 hours'),

-- 面经帖子的评论
('c8888888-8888-8888-8888-888888888888', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', NULL,
 '感谢分享！请问有内推码吗？', 3, NOW() - INTERVAL '1 day'),
('c9999999-9999-9999-9999-999999999999', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', NULL,
 'LRU 用什么数据结构实现的？HashMap + 双向链表吗？', 5, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- ========================================
-- 4. 插入关注关系
-- ========================================
INSERT INTO follows (id, follower_id, following_id, created_at) VALUES
('f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '20 days'),
('f2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '15 days'),
('f3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '18 days'),
('f4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '10 days'),
('f5555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '25 days'),
('f6666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '12 days'),
('f7777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', NOW() - INTERVAL '8 days'),
('f8888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;

-- ========================================
-- 5. 插入点赞记录
-- ========================================
INSERT INTO likes (id, user_id, target_id, target_type, created_at) VALUES
-- 帖子点赞
('a1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'post', NOW() - INTERVAL '4 days'),
('a2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'post', NOW() - INTERVAL '3 days'),
('a3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'post', NOW() - INTERVAL '20 hours'),
('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'post', NOW() - INTERVAL '18 hours'),
('a5555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'post', NOW() - INTERVAL '1 day'),
-- 评论点赞
('a6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', 'comment', NOW() - INTERVAL '2 days'),
('a7777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'c6666666-6666-6666-6666-666666666666', 'comment', NOW() - INTERVAL '19 hours')
ON CONFLICT DO NOTHING;

-- ========================================
-- 6. 插入收藏记录
-- ========================================
INSERT INTO bookmarks (id, user_id, post_id, created_at) VALUES
('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '4 days'),
('b2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW() - INTERVAL '1 day'),
('b3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW() - INTERVAL '18 hours'),
('b4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NOW() - INTERVAL '2 hours')
ON CONFLICT DO NOTHING;

-- ========================================
-- 7. 插入签到记录
-- ========================================
INSERT INTO check_ins (id, user_id, check_date, points_earned, streak_days, created_at) VALUES
-- 张三最近7天签到
('d1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', CURRENT_DATE - 6, 10, 1, NOW() - INTERVAL '6 days'),
('d2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', CURRENT_DATE - 5, 15, 2, NOW() - INTERVAL '5 days'),
('d3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', CURRENT_DATE - 4, 20, 3, NOW() - INTERVAL '4 days'),
('d4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', CURRENT_DATE - 3, 25, 4, NOW() - INTERVAL '3 days'),
('d5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', CURRENT_DATE - 2, 30, 5, NOW() - INTERVAL '2 days'),
('d6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', CURRENT_DATE - 1, 35, 6, NOW() - INTERVAL '1 day'),
-- 王五签到
('d7777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', CURRENT_DATE - 1, 10, 1, NOW() - INTERVAL '1 day'),
('d8888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', CURRENT_DATE, 15, 2, NOW())
ON CONFLICT DO NOTHING;

-- ========================================
-- 8. 插入通知记录
-- ========================================
INSERT INTO notifications (id, user_id, sender_id, type, content, reference_id, reference_type, is_read, created_at) VALUES
('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'like', '李四 赞了你的帖子', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'post', false, NOW() - INTERVAL '4 days'),
('e2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'comment', '王五 评论了你的帖子', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'post', false, NOW() - INTERVAL '3 days'),
('e3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'follow', '李四 关注了你', NULL, NULL, true, NOW() - INTERVAL '18 days'),
('e4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'like', '张三 赞了你的帖子', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'post', false, NOW() - INTERVAL '18 hours'),
('e5555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'comment', '孙七 评论了你的帖子', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'post', false, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- ========================================
-- 完成提示
-- ========================================
SELECT '测试数据插入完成！' as message,
       (SELECT COUNT(*) FROM users WHERE student_id LIKE 'TEST%') as test_users,
       (SELECT COUNT(*) FROM posts) as posts,
       (SELECT COUNT(*) FROM comments) as comments,
       (SELECT COUNT(*) FROM follows) as follows,
       (SELECT COUNT(*) FROM likes) as likes;
