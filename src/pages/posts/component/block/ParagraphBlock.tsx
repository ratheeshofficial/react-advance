import { Box, Textarea, Text } from '@chakra-ui/react';
import type { BaseBlockProps } from '../../../../types/posts/block';

export function ParagraphBlock({ block, onChange, isEditing = true }: BaseBlockProps) {
  return (
    <Box py='1'>
      {isEditing ? (
        <Textarea
          value={block.content || ''}
          onChange={(e) => onChange?.({ ...block, content: e.target.value })}
          placeholder='Write paragraph text here…'
          border='none'
          outline='none'
          _focus={{ outline: 'none', boxShadow: 'none' }}
          fontFamily="'Inter', sans-serif"
          fontSize='14px'
          lineHeight='1.65'
          color='var(--ink-soft)'
          py='1'
          px='0'
          resize='vertical'
          minH='60px'
        />
      ) : (
        <Text
          fontFamily="'Inter', sans-serif"
          fontSize='14px'
          lineHeight='1.65'
          color='var(--ink-soft)'
          whiteSpace='pre-wrap'
          py='1'
        >
          {block.content || ''}
        </Text>
      )}
    </Box>
  );
}

export default ParagraphBlock;

