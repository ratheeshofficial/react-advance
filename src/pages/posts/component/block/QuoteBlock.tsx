import { memo } from 'react';
import { Box, Textarea, Text, Flex } from '@chakra-ui/react';
import { LuQuote } from 'react-icons/lu';
import type { BaseBlockProps } from '../../../../types/posts/block';

export const QuoteBlock = memo(function QuoteBlock({
  block,
  onChange,
  isEditing = true,
}: BaseBlockProps) {
  return (
    <Box py='1'>
      <Box
        pl='4'
        borderLeft='4px solid'
        borderColor='purple.500'
        bg='purple.50/40'
        p='3'
        borderRadius='r-md'
      >
        {isEditing ? (
          <Flex gap='2' align='top'>
            <Box color='purple.500' pt='2'>
              <LuQuote size={20} />
            </Box>
            <Textarea
              value={block.content || ''}
              onChange={(e) => onChange?.({ ...block, content: e.target.value })}
              placeholder='Enter inspirational quote or snippet...'
              aria-label='Quote content'
              variant='subtle'
              size='md'
              fontStyle='italic'
              bg='white'
              _focus={{ borderColor: 'purple.500' }}
              borderRadius='md'
            />
          </Flex>
        ) : (
          <Flex gap='3' align='top' py='1'>
            <Box color='purple.500' pt='1'>
              <LuQuote size={24} />
            </Box>
            <Text fontSize='lg' fontStyle='italic' color='gray.800' lineHeight='relaxed' fontWeight='medium'>
              "{block.content || 'Quote text goes here...'}"
            </Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
});

export default QuoteBlock;
