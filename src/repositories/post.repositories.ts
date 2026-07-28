import { PREF_KEYS } from '../constant/PreferenceKeys';
import { mockPosts } from '../constant/PostsConfigProps';
import type { IPost } from '../types/posts/posts';

function getInitialPosts(): IPost[] {
  const res = localStorage.getItem(PREF_KEYS.blog);
  if (res) {
    try {
      return JSON.parse(res);
    } catch {
      // fallback if JSON parsing fails
    }
  }
  localStorage.setItem(PREF_KEYS.blog, JSON.stringify(mockPosts));
  return mockPosts;
}

async function getAllPosts(): Promise<IPost[]> {
  return getInitialPosts();
}

async function createPost(post: IPost): Promise<IPost> {
  const existing = await getAllPosts();
  const updatedList = [...existing, post];
  localStorage.setItem(PREF_KEYS.blog, JSON.stringify(updatedList));
  return post;
}

async function updatePost(id: string, post: IPost): Promise<IPost> {
  const existing = await getAllPosts();
  const updatedList = existing.map((p) => (p.id === id ? post : p));
  localStorage.setItem(PREF_KEYS.blog, JSON.stringify(updatedList));
  return post;
}

async function deletePost(id: string): Promise<void> {
  const existing = await getAllPosts();
  const updatedList = existing.filter((p) => p.id !== id);
  localStorage.setItem(PREF_KEYS.blog, JSON.stringify(updatedList));
}

async function getByIdPost(id: string): Promise<IPost | undefined> {
  const existing = await getAllPosts();
  return existing.find((p) => p.id === id);
}

export const postsRepository = {
  getInitialPosts,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getByIdPost,
};
