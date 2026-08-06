import type { IPost, IBlockOptionItem } from '../types/posts/posts';
import type { ColumnLayoutOption } from '../pages/posts/component/block/ColumnLayoutPicker';
import {
  LuAlignLeft,
  LuHeading2,
  LuHeading3,
  LuImage,
  LuQuote,
  LuMinus,
  LuMessageSquareQuote,
  LuCode,
  LuListOrdered,
  LuList,
  LuLayoutDashboard,
} from 'react-icons/lu';

export const BLOCK_OPTIONS: IBlockOptionItem[] = [
  {
    type: 'paragraph',
    title: 'Paragraph',
    subtitle: 'Normal text body paragraph',
    icon: LuAlignLeft,
    color: 'purple.600',
    bg: 'purple.50',
    category: 'Text',
  },
  {
    type: 'heading2',
    title: 'H2 Heading',
    subtitle: 'Large section title',
    icon: LuHeading2,
    color: 'blue.600',
    bg: 'blue.50',
    badge: 'Popular',
    category: 'Text',
  },
  {
    type: 'heading3',
    title: 'H3 Heading',
    subtitle: 'Small section sub-title',
    icon: LuHeading3,
    color: 'indigo.600',
    bg: 'indigo.50',
    category: 'Text',
  },
  {
    type: 'quote',
    title: 'Quote',
    subtitle: 'Quote block statement',
    icon: LuQuote,
    color: 'pink.600',
    bg: 'pink.50',
    category: 'Formatting',
  },
  {
    type: 'callout',
    title: 'Callout',
    subtitle: 'Important note or highlight box',
    icon: LuMessageSquareQuote,
    color: 'amber.600',
    bg: 'amber.50',
    badge: 'Useful',
    category: 'Formatting',
  },
  {
    type: 'orderedList',
    title: 'Ordered List',
    subtitle: 'Numbered step-by-step list',
    icon: LuListOrdered,
    color: 'teal.600',
    bg: 'teal.50',
    category: 'Formatting',
  },
  {
    type: 'unorderedList',
    title: 'Unordered List',
    subtitle: 'Bullet point items',
    icon: LuList,
    color: 'emerald.600',
    bg: 'emerald.50',
    category: 'Formatting',
  },
  {
    type: 'divider',
    title: 'Divider',
    subtitle: 'Horizontal section separator line',
    icon: LuMinus,
    color: 'gray.600',
    bg: 'gray.100',
    category: 'Formatting',
  },
  {
    type: 'image',
    title: 'Image',
    subtitle: 'Insert image with caption',
    icon: LuImage,
    color: 'orange.600',
    bg: 'orange.50',
    badge: 'Media',
    category: 'Media & Code',
  },
  {
    type: 'code',
    title: 'Code',
    subtitle: 'Programming code snippet',
    icon: LuCode,
    color: 'violet.600',
    bg: 'violet.50',
    badge: 'Dev',
    category: 'Media & Code',
  },
  {
    type: 'column',
    title: 'Column',
    icon: LuLayoutDashboard,
    color: 'blue.600',
    subtitle: 'Add columns to your post',
    category: 'Layout',
    bg: 'blue.50',
  },
];

export const mockPosts: IPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development in 2026',
    author: 'Alice Smith',
    status: 'Published',
    category: 'Technology',
    lastUpdated: '2026-07-19T10:00:00Z',
    publishDate: '2026-07-20T11:00:00Z',
  },
  {
    id: '2',
    title: 'Mastering React 19 Server Components',
    author: 'Bob Jones',
    status: 'Draft',
    category: 'Engineering',
    lastUpdated: '2026-07-18T14:30:00Z',
    publishDate: '',
  },
  {
    id: '3',
    title: 'Designing Beautiful UIs with CSS Variables',
    author: 'Charlie Davis',
    status: 'Scheduled',
    category: 'Design',
    lastUpdated: '2026-07-15T09:15:00Z',
    publishDate: '2026-07-22T08:00:00Z',
  },
  {
    id: '4',
    title: 'Understanding AI-driven Coding Assistants',
    author: 'Diana Prince',
    status: 'Published',
    category: 'AI',
    lastUpdated: '2026-07-10T11:20:00Z',
    publishDate: '2026-07-11T12:00:00Z',
  },
  {
    id: '5',
    title: 'A Guide to Modern Micro-Animations',
    author: 'Evan Wright',
    status: 'Published',
    category: 'Design',
    lastUpdated: '2026-07-19T16:45:00Z',
    publishDate: '2026-07-19T17:00:00Z',
  },
  {
    id: '6',
    title: 'Performance Tuning Vite Applications',
    author: 'Fiona Gallagher',
    status: 'Draft',
    category: 'Engineering',
    lastUpdated: '2026-07-16T13:10:00Z',
    publishDate: '',
  },
  {
    id: '7',
    title: 'Building Resilient Distributed Systems',
    author: 'George Harrison',
    status: 'Scheduled',
    category: 'Architecture',
    lastUpdated: '2026-07-14T10:00:00Z',
    publishDate: '2026-07-25T09:00:00Z',
  },
  {
    id: '8',
    title: 'The Rise of Edge Computing',
    author: 'Hannah Lee',
    status: 'Published',
    category: 'Technology',
    lastUpdated: '2026-07-05T08:30:00Z',
    publishDate: '2026-07-06T09:00:00Z',
  },
];

export const SORTBY = [
  {
    label: 'Last Updated',
    value: 'lastUpdated',
  },
  {
    label: 'Publish Date',
    value: 'publishDate',
  },
];

export const STATUS = ['All', 'Draft', 'Published', 'Scheduled', 'Archived'];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Published':
      return 'green.500';
    case 'Draft':
      return 'gray.500';
    case 'Scheduled':
      return 'orange.500';
    default:
      return 'blue.500';
  }
};

export const COLUMN_LAYOUT_OPTIONS: ColumnLayoutOption[] = [
  {
    id: '100',
    title: 'Single',
    subtitle: 'Full width single column layout',
    columns: [1],
  },
  {
    id: '50-50',
    title: '50 / 50',
    subtitle: 'Two equal width half columns',
    columns: [1, 1],
  },
  {
    id: '33-67',
    title: '1/3 - 2/3',
    subtitle: 'Narrow left column with wide main area',
    columns: [1, 2],
  },
  {
    id: '67-33',
    title: '2/3 - 1/3',
    subtitle: 'Wide main area with narrow right column',
    columns: [2, 1],
  },
];

