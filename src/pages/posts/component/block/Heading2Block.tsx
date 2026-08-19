import { memo } from 'react';
import { Box, Input } from '@chakra-ui/react';
import type { BaseBlockProps } from '../../../../types/posts/block';

export const Heading2Block = memo(function Heading2Block({
  block,
  onChange,
  isEditing = true,
}: BaseBlockProps) {
  return (
    <Box py={isEditing ? '1' : '0'}>
      {isEditing ? (
        <Input
          value={block.content || ''}
          onChange={(e) => onChange?.({ ...block, content: e.target.value })}
          placeholder='Heading 2 title…'
          aria-label='Heading 2 content'
          border='none'
          outline='none'
          _focus={{ outline: 'none', boxShadow: 'none' }}
          fontFamily="'Fraunces', serif"
          fontSize='21px'
          fontWeight='600'
          color='text.primary'
          py={isEditing ? '2' : '0'}
          px='0'
        />
      ) : (
        <Box
          fontFamily="'Fraunces', serif"
          fontSize='21px'
          fontWeight='600'
          color='text.primary'
          py='0'
        >
          {block.content || 'Heading 2 Title'}
        </Box>
      )}
    </Box>
  );
});

export default Heading2Block;

