import { useState, type ReactNode } from 'react';
import { postsRepository } from '../repositories/post.repositories';
import type { IPost } from '../types/posts/posts';
import type { UseNavigateResult } from '@tanstack/react-router';
import { PostsContext } from './PostsContext';
import {
  usePostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from '../hooks/usePostsQuery';

export function PostsProvider({ children }: { children: ReactNode }) {
  const {
    data: posts = [],
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = usePostsQuery();
  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();
  const deleteMutation = useDeletePostMutation();

  const [singlePost, setSinglePost] = useState<IPost | null>(null);
  const [isFetchingSingle, setIsFetchingSingle] = useState(false);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  async function create(post: IPost) {
    try {
      const created = await createMutation.mutateAsync(post);
      return created;
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

  async function list() {
    await refetchPosts();
  }

  async function update(id: string, changes: IPost) {
    try {
      const updated = await updateMutation.mutateAsync({ id, post: changes });
      setSinglePost(updated);
      return updated;
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }

  async function remove(id: string) {
    try {
      await deleteMutation.mutateAsync(id);
      if (singlePost && String(singlePost.id) === String(id)) {
        setSinglePost(null);
        setTitle('');
        setExcerpt('');
        setCoverImage(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  async function getById(id: string) {
    setIsFetchingSingle(true);
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
      console.error('Error getting post by id:', error);
      setSinglePost(null);
      setTitle('');
      setExcerpt('');
      setCoverImage(null);
    } finally {
      setIsFetchingSingle(false);
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
      status: singlePost?.status || 'Published',
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
        isCreatingPosts: createMutation.isPending,
        isLoadingPosts: isLoadingPosts || isFetchingSingle,
        isUpdatingPosts: updateMutation.isPending,
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
        isAutoUpdating,
        setIsAutoUpdating,
        isDirty,
        setIsDirty,
        handleSavePost,
        handleDeletePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}
