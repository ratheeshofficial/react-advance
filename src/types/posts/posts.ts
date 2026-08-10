import type { ElementType } from 'react';
import type { BlockType } from './block';
import type { PostStatus } from './workflow';

export interface IPost {
  id?: string;
  title: string;
  author?: string;
  status?: PostStatus;
  category?: string;
  lastUpdated: string;
  publishDate?: string;
  excerpt?: string;
  cover_image?: string;
  slug?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  editorialNotes?: string;
}

export interface IBlockOptionItem {
  type: BlockType;
  title: string;
  subtitle: string;
  icon: ElementType;
  color: string;
  bg: string;
  badge?: string;
  category: 'Text' | 'Formatting' | 'Media & Code' | 'Layout';
}
