import type { Post } from '../types/posts/posts';

export const mockPosts: Post[] = [
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
