/**
 * Supabase 客户端配置
 * 用于前端直接访问 Supabase（如文件上传等场景）
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 创建 Supabase 客户端
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 上传文件到 Supabase Storage
 * @param bucket 存储桶名称
 * @param path 文件路径
 * @param file 文件对象
 * @returns 上传后的公开 URL
 */
export async function uploadFile(
    bucket: string,
    path: string,
    file: File
): Promise<string> {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        throw new Error(`文件上传失败: ${error.message}`);
    }

    // 获取公开 URL
    const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * 删除 Supabase Storage 中的文件
 * @param bucket 存储桶名称
 * @param paths 文件路径数组
 */
export async function deleteFiles(bucket: string, paths: string[]): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
        throw new Error(`文件删除失败: ${error.message}`);
    }
}

export default supabase;
