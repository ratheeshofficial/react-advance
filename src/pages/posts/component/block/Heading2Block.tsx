import { Box, Input, Heading, Flex } from '@chakra-ui/react';
import { LuHeading2 } from 'react-icons/lu';
import type { BaseBlockProps } from '../../../../types/posts/block';

export function Heading2Block({ block, onChange, isEditing = true }: BaseBlockProps) {
  return (
    <Box py='1'>
      {isEditing ? (
        <Flex gap='2' align='center'>
          <Box color='purple.600' fontSize='xl'>
            <LuHeading2 />
          </Box>
          <Input
            value={block.content || ''}
            onChange={(e) => onChange?.({ ...block, content: e.target.value })}
            placeholder='H2 Heading Title...'
            variant='subtle'
            size='lg'
            fontWeight='bold'
            fontSize='xl'
            bg='gray.50'
            _focus={{ bg: 'white', borderColor: 'purple.500' }}
            borderRadius='md'
          />
        </Flex>
      ) : (
        <Heading as='h2' size='xl' fontWeight='bold' color='gray.800' borderBottom='2px solid' borderColor='purple.100' pb='1'>
          {block.content || 'H2 Heading'}
        </Heading>
      )}
    </Box>
  );
}

export default Heading2Block;
