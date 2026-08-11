import { Box, Input, Heading, Flex } from '@chakra-ui/react';
import { LuHeading3 } from 'react-icons/lu';
import type { BaseBlockProps } from '../../../../types/posts/block';

export function Heading3Block({ block, onChange, isEditing = true }: BaseBlockProps) {
  return (
    <Box py='1'>
      {isEditing ? (
        <Flex gap='2' align='center'>
          <Box color='purple.500' fontSize='lg'>
            <LuHeading3 />
          </Box>
          <Input
            value={block.content || ''}
            onChange={(e) => onChange?.({ ...block, content: e.target.value })}
            placeholder='H3 Heading Title...'
            variant='subtle'
            size='md'
            fontWeight='semibold'
            fontSize='lg'
            bg='gray.50'
            _focus={{ bg: 'white', borderColor: 'purple.500' }}
            borderRadius='md'
          />
        </Flex>
      ) : (
        <Heading as='h3' size='lg' fontWeight='bold' color='gray.800' pt='1'>
          {block.content || 'H3 Heading'}
        </Heading>
      )}
    </Box>
  );
}

export default Heading3Block;
