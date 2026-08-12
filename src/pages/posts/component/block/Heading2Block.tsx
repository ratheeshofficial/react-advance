import { Box, Input } from '@chakra-ui/react';
import type { BaseBlockProps } from '../../../../types/posts/block';

export function Heading2Block({ block, onChange, isEditing = true }: BaseBlockProps) {
  return (
    <Box py='1'>
      {isEditing ? (
        <Input
          value={block.content || ''}
          onChange={(e) => onChange?.({ ...block, content: e.target.value })}
          placeholder='Heading 2 title…'
          border='none'
          outline='none'
          _focus={{ outline: 'none', boxShadow: 'none' }}
          fontFamily="'Fraunces', serif"
          fontSize='21px'
          fontWeight='600'
          color='var(--ink)'
          py='2'
          px='0'
        />
      ) : (
        <Box
          fontFamily="'Fraunces', serif"
          fontSize='21px'
          fontWeight='600'
          color='var(--ink)'
          py='2'
        >
          {block.content || 'Heading 2 Title'}
        </Box>
      )}
    </Box>
  );
}

export default Heading2Block;

