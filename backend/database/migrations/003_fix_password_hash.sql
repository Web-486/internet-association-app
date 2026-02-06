-- 更新测试用户密码哈希
-- 如果之前的密码哈希不正确，可以运行此 SQL 来修复
-- 这里使用一个已知正确的 "123456" 的 bcrypt 哈希

-- 注意：bcrypt 每次生成的哈希都不同，但都可以验证相同的密码

-- 选项 1：直接在 Supabase 创建新用户进行测试
-- 前端注册功能会使用正确的哈希

-- 选项 2：使用 bcrypt 在线工具生成哈希
-- 推荐网站：https://bcrypt-generator.com/
-- 输入：123456，rounds: 12
-- 将生成的哈希替换下方的值

-- 以下是一个正确的 "123456" bcrypt 哈希示例（可能需要替换）：
-- 你可以通过 Supabase 的 SQL Editor 执行以下命令来测试

-- 方法：使用 Supabase 的 pgcrypto 扩展来生成密码哈希
-- 首先启用 pgcrypto 扩展
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 然后更新测试用户的密码为 123456 的正确哈希
UPDATE users 
SET password_hash = crypt('123456', gen_salt('bf', 12))
WHERE student_id LIKE 'TEST%';

-- 验证更新结果
SELECT student_id, name, password_hash FROM users WHERE student_id LIKE 'TEST%';
