import { supabase } from '../lib/supabase';
import type { IPost, IPostDbRow } from '../types/posts/posts';

function mapFromDb(row: IPostDbRow): IPost {
  return {
    id: row.id,
    title: row.title || '',
    author: row.author || '',
    status: row.status || 'Draft',
    category: row.category || '',
    lastUpdated: row.last_updated || row.created_at || new Date().toISOString(),
    publishDate: row.publish_date || undefined,
    excerpt: row.excerpt || '',
    cover_image: row.cover_image || undefined,
    slug: row.slug || '',
    tags: row.tags || [],
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || '',
    editorialNotes: row.editorial_notes || '',
    blocks: row.blocks || [],
  };
}

function mapToDb(post: Partial<IPost>): IPostDbRow {
  const payload: IPostDbRow = {
    title: post.title ?? '',
    author: post.author ?? '',
    status: post.status ?? 'Draft',
    category: post.category ?? '',
    last_updated: post.lastUpdated || new Date().toISOString(),
    publish_date: post.publishDate || null,
    excerpt: post.excerpt ?? '',
    cover_image: post.cover_image || null,
    slug: post.slug ?? '',
    tags: post.tags || [],
    seo_title: post.seoTitle ?? '',
    seo_description: post.seoDescription ?? '',
    editorial_notes: post.editorialNotes ?? '',
    blocks: post.blocks || [],
  };

  if (post.id) {
    payload.id = post.id;
  }

  return payload;
}

function getInitialPosts(): IPost[] {
  return [];
}

async function getAllPosts(): Promise<IPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts from Supabase:', error);
    throw new Error(error.message);
  }

  return (data || []).map(mapFromDb);
}

async function getByIdPost(id: string): Promise<IPost | undefined> {
  if (!id) return undefined;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching post by ID from Supabase:', error);
    throw new Error(error.message);
  }

  return data ? mapFromDb(data) : undefined;
}

async function createPost(post: IPost): Promise<IPost> {
  const dbPayload = mapToDb(post);
  if (!post.id) {
    delete dbPayload.id;
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([dbPayload])
    .select()
    .single();

  if (error) {
    console.error('Error creating post in Supabase:', error);
    throw new Error(error.message);
  }

  return mapFromDb(data);
}

async function updatePost(id: string, post: IPost): Promise<IPost> {
  const dbPayload = mapToDb(post);
  delete dbPayload.id;

  const { data, error } = await supabase
    .from('posts')
    .update(dbPayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post in Supabase:', error);
    throw new Error(error.message);
  }

  return mapFromDb(data);
}

async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id);

  if (error) {
    console.error('Error deleting post from Supabase:', error);
    throw new Error(error.message);
  }
}

async function uploadFile(
  bucket: 'post-covers' | 'post-attachments',
  file: File,
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${Date.now()}_${cleanName}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    console.error(`Error uploading file to ${bucket}:`, uploadError);
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

export const postsRepository = {
  getInitialPosts,
  getAllPosts,
  getByIdPost,
  createPost,
  updatePost,
  deletePost,
  uploadFile,
};
