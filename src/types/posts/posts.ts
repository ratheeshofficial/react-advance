import type { ElementType } from 'react';
import type { BlockType } from './block';

export interface IPost {
  id?: string;
  title: string;
  author?: string;
  status?: 'Published' | 'Draft' | 'Scheduled';
  category?: string;
  lastUpdated: string;
  publishDate?: string;
  excerpt?: string;
  cover_image?: string;
}

export interface IBlockOptionItem {
  type: BlockType;
  title: string;
  subtitle: string;
  icon: ElementType;
  color: string;
  bg: string;
  badge?: string;
  category: 'Text' | 'Formatting' | 'Media & Code';
}
