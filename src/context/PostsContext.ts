import { createContext } from 'react';
import type { IPost } from '../types/posts/posts';
import type { UseNavigateResult } from '@tanstack/react-router';

export interface PostsContextType {
  posts: IPost[];
  singlePost: IPost | null;
  isLoadingPosts: boolean;
  isUpdatingPosts: boolean;
  isCreatingPosts: boolean;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  excerpt: string;
  setExcerpt: React.Dispatch<React.SetStateAction<string>>;
  coverImage: string | null;
  setCoverImage: React.Dispatch<React.SetStateAction<string | null>>;
  isAutoUpdating: boolean;
  setIsAutoUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  create: (post: IPost) => Promise<IPost | undefined>;
  list: () => Promise<void>;
  update: (id: string, changes: IPost) => Promise<IPost | undefined>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Promise<IPost | undefined>;
  handleSavePost: (
    id: string,
    navigate?: UseNavigateResult<string>,
  ) => Promise<void>;
  handleDeletePost: (
    id: string,
    navigate?: UseNavigateResult<string>,
  ) => Promise<void>;
}

export const PostsContext = createContext<PostsContextType | undefined>(
  undefined,
);
