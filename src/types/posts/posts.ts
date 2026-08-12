import type { ElementType } from 'react';
import type { BlockType, IBlock } from './block';
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
  blocks?: IBlock[];
}

export interface IPostDbRow {
  id?: string;
  title?: string;
  author?: string;
  status?: PostStatus;
  category?: string;
  last_updated?: string;
  publish_date?: string | null;
  excerpt?: string;
  cover_image?: string | null;
  slug?: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  editorial_notes?: string;
  blocks?: IBlock[];
  created_at?: string;
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
