import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsRepository } from '../repositories/post.repositories';
import type { IPost } from '../types/posts/posts';

export const POSTS_QUERY_KEY = ['posts'];

export function usePostsQuery() {
  return useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: postsRepository.getAllPosts,
  });
}

export function usePostQuery(id?: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => (id ? postsRepository.getByIdPost(id) : undefined),
    enabled: Boolean(id),
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IPost) => postsRepository.createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, post }: { id: string; post: IPost }) =>
      postsRepository.updatePost(id, post),
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['post', updatedPost.id] });
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsRepository.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}
