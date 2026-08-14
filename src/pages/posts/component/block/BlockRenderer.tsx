import { memo } from 'react';
import type { BaseBlockProps } from '../../../../types/posts/block';
import { ParagraphBlock } from './ParagraphBlock';
import { Heading2Block } from './Heading2Block';
import { Heading3Block } from './Heading3Block';
import { QuoteBlock } from './QuoteBlock';
import { OrderedListBlock } from './OrderedListBlock';
import { UnorderedListBlock } from './UnorderedListBlock';
import { DividerBlock } from './DividerBlock';
import { CalloutBlock } from './CalloutBlock';
import { CodeBlock } from './CodeBlock';
import { ImageBlock } from './ImageBlock';
import { AttachmentBlock } from './AttachmentBlock';
import { ColumnBlock } from './ColumnBlock';

export const BlockRenderer = memo(function BlockRenderer(props: BaseBlockProps) {
  switch (props.block.type) {
    case 'paragraph':
      return <ParagraphBlock {...props} />;
    case 'heading2':
      return <Heading2Block {...props} />;
    case 'heading3':
      return <Heading3Block {...props} />;
    case 'quote':
      return <QuoteBlock {...props} />;
    case 'orderedList':
      return <OrderedListBlock {...props} />;
    case 'unorderedList':
      return <UnorderedListBlock {...props} />;
    case 'divider':
      return <DividerBlock />;
    case 'callout':
      return <CalloutBlock {...props} />;
    case 'code':
      return <CodeBlock {...props} />;
    case 'image':
      return <ImageBlock {...props} />;
    case 'attachment':
      return <AttachmentBlock {...props} />;
    case 'column':
      return <ColumnBlock {...props} />;
    default:
      return <ParagraphBlock {...props} />;
  }
});

export default BlockRenderer;
