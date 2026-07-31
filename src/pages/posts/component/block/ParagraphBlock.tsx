import { Box, Textarea, Text } from '@chakra-ui/react';
import type { BaseBlockProps } from '../../../../types/posts/block';

export function ParagraphBlock({ block, onChange, isEditing = true }: BaseBlockProps) {
  return (
    <Box py='1'>
      {isEditing ? (
        <Textarea
          value={block.content || ''}
          onChange={(e) => onChange?.({ ...block, content: e.target.value })}
          placeholder='Type your paragraph content...'
          variant='subtle'
          size='md'
          resize='vertical'
          minH='80px'
          bg='gray.50'
          _focus={{ bg: 'white', borderColor: 'purple.500' }}
          borderRadius='md'
          fontSize='md'
          lineHeight='relaxed'
        />
      ) : (
        <Text fontSize='md' color='gray.700' lineHeight='relaxed'>
          {block.content || 'Empty paragraph block'}
        </Text>
      )}
    </Box>
  );
}

export default ParagraphBlock;
