import { Box, VStack, HStack, Input, Button, Text, Flex, IconButton } from '@chakra-ui/react';
import { LuPlus, LuX, LuList } from 'react-icons/lu';
import type { BaseBlockProps } from '../../../../types/posts/block';

export function UnorderedListBlock({ block, onChange, isEditing = true }: BaseBlockProps) {
  const items = block.items && block.items.length > 0 ? block.items : [block.content || 'Bullet list item 1'];

  const handleItemChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = val;
    onChange?.({ ...block, items: updated, content: updated[0] || '' });
  };

  const handleAddItem = () => {
    const updated = [...items, `Bullet list item ${items.length + 1}`];
    onChange?.({ ...block, items: updated });
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    const updated = items.filter((_, i) => i !== index);
    onChange?.({ ...block, items: updated });
  };

  return (
    <Box py='1'>
      <Flex gap='2' align='top'>
        {isEditing && (
          <Box color='purple.600' pt='2' fontSize='lg'>
            <LuList />
          </Box>
        )}
        <Box flex='1'>
          {isEditing ? (
            <VStack align='stretch' gap='2'>
              {items.map((item, idx) => (
                <HStack key={idx} gap='2'>
                  <Box w='2' h='2' borderRadius='full' bg='purple.500' mx='1' />
                  <Input
                    size='sm'
                    variant='subtle'
                    value={item}
                    onChange={(e) => handleItemChange(idx, e.target.value)}
                    placeholder={`Bullet item ${idx + 1}...`}
                    bg='gray.50'
                    _focus={{ bg: 'white', borderColor: 'purple.500' }}
                  />
                  {items.length > 1 && (
                    <IconButton
                      aria-label='Remove item'
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
                <HStack key={idx} align='top' gap='3'>
                  <Box w='2' h='2' borderRadius='full' bg='purple.500' mt='2.5' flexShrink={0} />
                  <Text fontSize='lg' color='gray.800' lineHeight='1.7'>
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
}

export default UnorderedListBlock;
