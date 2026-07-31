export type BlockType =
  | 'paragraph'
  | 'heading2'
  | 'heading3'
  | 'quote'
  | 'orderedList'
  | 'unorderedList'
  | 'divider'
  | 'callout'
  | 'code'
  | 'image';

export interface IBlock {
  id: string;
  type: BlockType;
  content?: string;
  src?: string;
  caption?: string;
  language?: string;
  calloutType?: 'info' | 'warning' | 'success' | 'note';
  items?: string[];
}

export interface BaseBlockProps {
  block: IBlock;
  onChange?: (updatedBlock: IBlock) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
}

export interface IBlockOption {
  type: BlockType;
  label: string;
  description: string;
  iconName: string;
  badge?: string;
  category: 'text' | 'formatting' | 'media';
}
