import { useState } from 'react';
import { postsRepository } from '../repositories/post.repositories';
import type { IPost } from '../types/posts/posts';

export function usePosts() {
  const [posts, setPosts] = useState<IPost[]>(() =>
    postsRepository.getInitialPosts(),
  );
  const [singlePost, setSinglePost] = useState<IPost | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isUpdatingPosts, setIsUpdatingPosts] = useState(false);
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
    setIsUpdatingPosts(true);
    try {
      const updated = await postsRepository.updatePost(id, changes);
      setPosts((prev) => prev.map((post) => (post.id === id ? updated : post)));
      return updated;
    } catch (error) {
      console.log('error - ', error);
    } finally {
      setIsUpdatingPosts(false);
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
    setIsLoadingPosts(true);
    try {
      const fetchedPost = await postsRepository.getByIdPost(id);
      setSinglePost(fetchedPost || null);
      return fetchedPost;
    } catch (error) {
      console.log('error', error);
      setSinglePost(null);
    } finally {
      setIsLoadingPosts(false);
    }
  }

  return {
    create,
    posts,
    isCreatingPosts,
    isLoadingPosts,
    isUpdatingPosts,
    list,
    update,
    remove,
    getById,
    singlePost,
  };
}
