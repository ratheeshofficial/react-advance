import { useState } from 'react';
import { postsRepository } from '../repositories/post.repositories';
import type { IPost } from '../types/posts/posts';

export function usePosts() {
  const [posts, setPosts] = useState<IPost[]>(() =>
    postsRepository.getInitialPosts(),
  );
  const [singlePost, setSinglePost] = useState<IPost | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isCreatingPosts, setIsCreatingPosts] = useState(false);

  async function create(post: IPost) {
    setIsCreatingPosts(true);
    try {
      const created = await postsRepository.createPost(post);
      setPosts((prev) => [...prev, created]);
      return created;
    } catch (error) {
      console.log('error - ', error);
    } finally {
      setIsCreatingPosts(false);
    }
  }

  async function list() {
    setIsLoadingPosts(true);
    try {
      const postsData = await postsRepository.getAllPosts();
      setPosts(postsData);
    } catch (error) {
      console.log('error - ', error);
    } finally {
      setIsLoadingPosts(false);
    }
  }

  async function update(id: string, changes: IPost) {
    try {
      const updated = await postsRepository.updatePost(id, changes);
      setPosts((prev) => prev.map((post) => (post.id === id ? updated : post)));
      return updated;
    } catch (error) {
      console.log('error - ', error);
    }
  }

  async function remove(id: string) {
    try {
      await postsRepository.deletePost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.log('error - ', error);
    }
  }

  async function getById(id: string) {
    try {
      const singlePost = posts.find((post) => post.id === id);
      await postsRepository.getByIdPost(id);
      setSinglePost(singlePost || null);
    } catch (error) {
      console.log('error', error);
    }
  }

  return {
    create,
    posts,
    isCreatingPosts,
    isLoadingPosts,
    list,
    update,
    remove,
    getById,
    singlePost,
  };
}
