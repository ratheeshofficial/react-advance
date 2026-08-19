import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { LuPlus, LuX, LuListOrdered } from 'react-icons/lu';
import { memo } from 'react';
import type { BaseBlockProps } from '../../../../types/posts/block';

export const OrderedListBlock = memo(function OrderedListBlock({
  block,
  onChange,
  isEditing = true,
}: BaseBlockProps) {
  const items =
    block.items && block.items.length > 0
      ? block.items
      : [block.content || 'Item 1'];

  const handleItemChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = val;
    onChange?.({ ...block, items: updated, content: updated[0] || '' });
  };

  const handleAddItem = () => {
    const updated = [...items, `Item ${items.length + 1}`];
    onChange?.({ ...block, items: updated });
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index);
    onChange?.({ ...block, items: updated });
  };

  return (
    <Box py={isEditing ? '1' : '0'}>
      <Flex gap='2' align='top'>
        {isEditing && (
          <Box color='accent.fg' pt='2' fontSize='lg'>
            <LuListOrdered />
          </Box>
        )}
        <Box flex='1'>
          {isEditing ? (
            <VStack align='stretch' gap='2'>
              {items.map((item, idx) => (
                <HStack key={idx} gap='2'>
                  <Text fontWeight='bold' color='accent.fg' minW='20px'>
                    {idx + 1}.
                  </Text>
                  <Input
                    size='sm'
                    variant='subtle'
                    value={item}
                    onChange={(e) => handleItemChange(idx, e.target.value)}
                    placeholder={`List item ${idx + 1}...`}
                    aria-label={`List item ${idx + 1}`}
                    bg='bg.muted'
                    _focus={{ bg: 'bg.surface', borderColor: 'accent.solid' }}
                  />
                  {items.length > 1 && (
                    <IconButton
                      aria-label={`Remove list item ${idx + 1}`}
                      size='xs'
                      variant='ghost'
                      colorPalette='red'
                      onClick={() => handleRemoveItem(idx)}
                    >
                      <LuX />
                    </IconButton>
                  )}
                </HStack>
              ))}
              <Button
                size='xs'
                variant='subtle'
                colorPalette='purple'
                alignSelf='flex-start'
                onClick={handleAddItem}
              >
                <LuPlus /> Add Item
              </Button>
            </VStack>
          ) : (
            <VStack align='stretch' gap='2' pl='1'>
              {items.map((item, idx) => (
                <HStack key={idx} align='top' gap='2.5'>
                  <Text fontWeight='bold' color='accent.fg' fontSize='md' minW='24px'>
                    {idx + 1}.
                  </Text>
                  <Text fontSize='lg' color='text.primary' lineHeight='1.7'>
                    {item}
                  </Text>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>
      </Flex>
    </Box>
  );
});

export default OrderedListBlock;
