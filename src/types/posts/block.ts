export type ColumnLayoutType = '100' | '50-50' | '33-67' | '67-33';

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
  | 'image'
  | 'column';

export interface IBlock {
  id: string;
  type: BlockType;
  content?: string;
  src?: string;
  caption?: string;
  language?: string;
  calloutType?: 'info' | 'warning' | 'success' | 'note';
  items?: string[];
  column?: string;
  columnLayout?: ColumnLayoutType;
  columnContents?: string[];
  columnBlocks?: IBlock[][];
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

