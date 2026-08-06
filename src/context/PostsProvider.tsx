import { useState, type ReactNode } from 'react';
import { postsRepository } from '../repositories/post.repositories';
import type { IPost } from '../types/posts/posts';
import type { UseNavigateResult } from '@tanstack/react-router';
import { PostsContext } from './PostsContext';

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<IPost[]>(() =>
    postsRepository.getInitialPosts(),
  );
  const [singlePost, setSinglePost] = useState<IPost | null>(null);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isUpdatingPosts, setIsUpdatingPosts] = useState(false);
  const [isCreatingPosts, setIsCreatingPosts] = useState(false);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);

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
      setSinglePost(updated);
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
      if (singlePost?.id === id) {
        setSinglePost(null);
        setTitle('');
        setExcerpt('');
        setCoverImage(null);
      }
    } catch (error) {
      console.log('error - ', error);
    }
  }

  async function getById(id: string) {
    setIsLoadingPosts(true);
    try {
      const fetchedPost = await postsRepository.getByIdPost(id);
      setSinglePost(fetchedPost || null);
      if (fetchedPost) {
        setTitle(fetchedPost.title || '');
        setExcerpt(fetchedPost.excerpt || '');
        setCoverImage(fetchedPost.cover_image || null);
      } else {
        setTitle('');
        setExcerpt('');
        setCoverImage(null);
      }
      return fetchedPost;
    } catch (error) {
      console.log('error', error);
      setSinglePost(null);
      setTitle('');
      setExcerpt('');
      setCoverImage(null);
    } finally {
      setIsLoadingPosts(false);
    }
  }

  async function handleSavePost(
    id: string,
    navigate?: UseNavigateResult<string>,
  ) {
    if (!id) return;
    const payload: IPost = {
      ...(singlePost || {}),
      id,
      title,
      excerpt,
      cover_image: coverImage as string,
      status: 'Published',
      lastUpdated: new Date().toISOString(),
    } as IPost;

    await update(id, payload);
    if (navigate) {
      navigate({ to: '/' });
    }
  }

  async function handleDeletePost(
    id: string,
    navigate?: UseNavigateResult<string>,
  ) {
    if (!id) return;
    await remove(id);
    if (navigate) {
      navigate({ to: '/' });
    }
  }

  return (
    <PostsContext.Provider
      value={{
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
        title,
        setTitle,
        excerpt,
        setExcerpt,
        coverImage,
        setCoverImage,
        handleSavePost,
        handleDeletePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}
