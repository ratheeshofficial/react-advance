import { Box, Button, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import { AddBlockPicker } from './AddBlockPicker';
import type { BlockType } from '../../../../types/posts/block';

interface EmptyCanvasProps {
  onSelectBlock?: (type: BlockType) => void;
}

export function EmptyCanvas({ onSelectBlock }: EmptyCanvasProps) {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Box
      mt='4'
      p='8'
      border='2px dashed'
      borderColor='purple.200'
      borderRadius='2xl'
      textAlign='center'
      bg='purple.50/20'
    >
      <VStack gap='3'>
        <Text color='gray.600' fontSize='sm' fontWeight='medium'>
          No content yet. Start writing your article by adding a block.
        </Text>
        <Button size='sm' colorPalette='purple' variant='solid' onClick={onOpen} borderRadius='lg'>
          <LuPlus /> Add Block
        </Button>
      </VStack>

      <AddBlockPicker
        open={open}
        onClose={onClose}
        onOpenChange={(e) => (e.open ? onOpen() : onClose())}
        onSelectBlock={onSelectBlock}
      />
    </Box>
  );
}

export default EmptyCanvas;
