import { memo } from 'react';
import { Box, Input, Heading, Flex } from '@chakra-ui/react';
import { LuHeading3 } from 'react-icons/lu';
import type { BaseBlockProps } from '../../../../types/posts/block';

export const Heading3Block = memo(function Heading3Block({
  block,
  onChange,
  isEditing = true,
}: BaseBlockProps) {
  return (
    <Box py={isEditing ? '1' : '0'}>
      {isEditing ? (
        <Flex gap='2' align='center'>
          <Box color='accent.fg' fontSize='lg'>
            <LuHeading3 />
          </Box>
          <Input
            value={block.content || ''}
            onChange={(e) => onChange?.({ ...block, content: e.target.value })}
            placeholder='H3 Heading Title...'
            aria-label='Heading 3 content'
            variant='subtle'
            size='md'
            fontWeight='semibold'
            fontSize='lg'
            bg='bg.muted'
            _focus={{ bg: 'bg.surface', borderColor: 'accent.solid' }}
            borderRadius='md'
          />
        </Flex>
      ) : (
        <Heading as='h3' size='lg' fontWeight='bold' color='text.primary' m='0'>
          {block.content || 'H3 Heading'}
        </Heading>
      )}
    </Box>
  );
});

export default Heading3Block;
