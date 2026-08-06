import type {
  IBlock,
  BlockType,
  ColumnLayoutType,
} from '../../../../types/posts/block';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export const createDefaultBlock = (
  type: BlockType,
  columnLayout?: ColumnLayoutType,
): IBlock => {
  const blockId = String(Date.now());
  const selectedLayout = columnLayout || '50-50';

  let defaultColumnBlocks: IBlock[][] | undefined = undefined;

  if (type === 'column') {
    if (selectedLayout === '50-50') {
      defaultColumnBlocks = [
        [
          {
            id: `${blockId}-col1-1`,
            type: 'heading2',
            content: 'Left Column Heading',
          },
          {
            id: `${blockId}-col1-2`,
            type: 'paragraph',
            content:
              'This paragraph is inside the left column. Each side acts like an independent mini editor.',
          },
        ],
        [
          {
            id: `${blockId}-col2-1`,
            type: 'image',
            src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
            caption: 'Right column image',
          },
          {
            id: `${blockId}-col2-2`,
            type: 'quote',
            content:
              'Design is not just what it looks like and feels like. Design is how it works.',
          },
        ],
      ];
    } else if (selectedLayout === '33-67') {
      defaultColumnBlocks = [
        [
          {
            id: `${blockId}-col1-1`,
            type: 'heading3',
            content: 'Overview',
          },
          {
            id: `${blockId}-col1-2`,
            type: 'paragraph',
            content: 'Quick highlights in the side column.',
          },
        ],
        [
          {
            id: `${blockId}-col2-1`,
            type: 'heading2',
            content: 'Detailed Analysis',
          },
          {
            id: `${blockId}-col2-2`,
            type: 'paragraph',
            content: 'Comprehensive deep dive section on the main side.',
          },
        ],
      ];
    } else if (selectedLayout === '67-33') {
      defaultColumnBlocks = [
        [
          {
            id: `${blockId}-col1-1`,
            type: 'heading2',
            content: 'Main Feature',
          },
          {
            id: `${blockId}-col1-2`,
            type: 'paragraph',
            content: 'Detailed explanation of the main feature.',
          },
        ],
        [
          {
            id: `${blockId}-col2-1`,
            type: 'image',
            src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
            caption: 'Sidebar image',
          },
          {
            id: `${blockId}-col2-2`,
            type: 'quote',
            content: 'Sidebar quote note.',
          },
        ],
      ];
    } else {
      defaultColumnBlocks = [
        [
          {
            id: `${blockId}-col1-1`,
            type: 'heading2',
            content: 'Full Width Section',
          },
          {
            id: `${blockId}-col1-2`,
            type: 'paragraph',
            content: 'Full width column block content.',
          },
        ],
      ];
    }
  }

  return {
    id: blockId,
    type,
    content:
      type === 'heading2'
        ? 'New Section Heading'
        : type === 'heading3'
          ? 'Sub Section Title'
          : type === 'quote'
            ? 'Inspiring quote goes here...'
            : type === 'callout'
              ? 'Important note or reminder.'
              : type === 'code'
                ? '// Add code here'
                : type === 'paragraph'
                  ? ''
                  : '',
    calloutType: type === 'callout' ? 'info' : undefined,
    language: type === 'code' ? 'typescript' : undefined,
    items:
      type === 'orderedList' || type === 'unorderedList'
        ? ['Item 1', 'Item 2']
        : undefined,
    src:
      type === 'image'
        ? 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80'
        : undefined,
    caption: type === 'image' ? 'Sample Image' : undefined,
    columnLayout: type === 'column' ? selectedLayout : undefined,
    columnBlocks: defaultColumnBlocks,
  };
};

export const useBlockSensors = () => {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
};
