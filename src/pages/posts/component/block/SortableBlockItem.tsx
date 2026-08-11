import type React from 'react';
import type { IBlock } from '../../../../types/posts/block';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  Button,
  IconButton,
  Text,
  Flex,
  HStack,
  Badge,
} from '@chakra-ui/react';
import {
  LuPlus,
  LuArrowUp,
  LuArrowDown,
  LuTrash2,
  LuGripVertical,
} from 'react-icons/lu';
import { BlockRenderer } from './BlockRenderer';

export interface SortableBlockItemProps {
  block: IBlock;
  index: number;
  totalBlocks: number;
  isEditingMode: boolean;
  onUpdateBlock: (updated: IBlock) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onDuplicateBlock?: (id: string) => void;
  onOpenPicker?: (id: string) => void;
  showDragHandle?: boolean;
  showAddBelow?: boolean;
}

export function SortableBlockItem({
  block,
  index,
  totalBlocks,
  isEditingMode,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onDuplicateBlock,
  onOpenPicker,
  showDragHandle = true,
  showAddBelow = true,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    disabled: !isEditingMode || !showDragHandle,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };

  return (
    <Box ref={setNodeRef} style={style} mb={isEditingMode ? '0' : '4'}>
      <Box
        position='relative'
        p={isEditingMode ? { base: '3', sm: '2' } : '0'}
        borderRadius={isEditingMode ? 'xl' : 'none'}
        bg={isEditingMode ? 'white' : 'transparent'}
        borderWidth={isEditingMode ? '1px' : '0px'}
        borderColor={isDragging ? 'purple.400' : 'gray.200'}
        boxShadow={isEditingMode ? (isDragging ? 'lg' : 'sm') : 'none'}
        _hover={isEditingMode ? { borderColor: 'purple.400', boxShadow: 'md' } : {}}
        transition='border-color 0.2s, box-shadow 0.2s'
      >
        {isEditingMode && (
          <Flex
            justify='space-between'
            align='center'
            flexWrap='wrap'
            gap='2'
            mb='3'
            pb='2'
            borderBottom='1px solid'
            borderColor='gray.100'
          >
            <HStack gap='2' flexWrap='wrap'>
              {showDragHandle && (
                <IconButton
                  aria-label='Drag block'
                  size='xs'
                  variant='ghost'
                  colorPalette='gray'
                  cursor='grab'
                  _active={{ cursor: 'grabbing' }}
                  title='Drag to reorder'
                  borderRadius='md'
                  {...attributes}
                  {...listeners}
                >
                  <LuGripVertical />
                </IconButton>
              )}
              <Badge
                size='sm'
                variant='subtle'
                textTransform='capitalize'
                colorPalette='purple'
                // px='2.5'
                py='1'
                borderRadius='md'
                fontSize='xs'
              >
                {block.type}
              </Badge>
            </HStack>

            <HStack gap='1.5' flexWrap='wrap' ml='auto'>
              {index > 0 && (
                <IconButton
                  aria-label='Move block up'
                  size='xs'
                  variant='subtle'
                  colorPalette='gray'
                  onClick={() => onMoveBlock(index, 'up')}
                  title='Move block up'
                  borderRadius='md'
                >
                  <LuArrowUp />
                </IconButton>
              )}
              {index < totalBlocks - 1 && (
                <IconButton
                  aria-label='Move block down'
                  size='xs'
                  variant='subtle'
                  colorPalette='gray'
                  onClick={() => onMoveBlock(index, 'down')}
                  title='Move block down'
                  borderRadius='md'
                >
                  <LuArrowDown />
                </IconButton>
              )}
              <IconButton
                aria-label='Delete block'
                size='xs'
                variant='solid'
                colorPalette='red'
                onClick={() => onDeleteBlock(block.id)}
                title='Delete block'
                borderRadius='md'
              >
                <LuTrash2 />
              </IconButton>
            </HStack>
          </Flex>
        )}

        <BlockRenderer
          block={block}
          onChange={onUpdateBlock}
          onDelete={onDeleteBlock}
          isEditing={isEditingMode}
        />

        {isEditingMode && onDuplicateBlock && (
          <Text
            fontSize='xs'
            mt='4'
            _hover={{ color: 'purple.500' }}
            color='gray.400'
            cursor='pointer'
            onClick={() => onDuplicateBlock(block.id)}
          >
            Duplicate
          </Text>
        )}
      </Box>

      {isEditingMode && showAddBelow && onOpenPicker && (
        <Flex justify='center' mt='4'>
          <Button
            size='sm'
            variant='subtle'
            colorPalette='purple'
            onClick={() => onOpenPicker(block.id)}
            borderRadius='full'
            px='6'
            w={{ base: '100%', sm: 'auto' }}
          >
            <LuPlus /> Add Block Below
          </Button>
        </Flex>
      )}
    </Box>
  );
}

export default SortableBlockItem;
