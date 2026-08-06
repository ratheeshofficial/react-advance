import { useState } from 'react';
import type {
  BaseBlockProps,
  ColumnLayoutType,
  IBlock,
  BlockType,
} from '../../../../types/posts/block';
import { Box, Flex, Text, VStack, Badge, Button } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import { arrayMove } from '@dnd-kit/sortable';

import { AddBlockPicker } from './AddBlockPicker';
import { SortableBlockList } from './SortableBlockList';
import { createDefaultBlock } from './blockUtils';

const LAYOUT_CONFIG: Record<
  ColumnLayoutType,
  { flex: number; label: string }[]
> = {
  '100': [{ flex: 1, label: 'Single Column (100%)' }],
  '50-50': [
    { flex: 1, label: 'Left Column (50%)' },
    { flex: 1, label: 'Right Column (50%)' },
  ],
  '33-67': [
    { flex: 1, label: 'Left Column (33%)' },
    { flex: 2, label: 'Right Column (67%)' },
  ],
  '67-33': [
    { flex: 2, label: 'Left Column (67%)' },
    { flex: 1, label: 'Right Column (33%)' },
  ],
};

export function ColumnBlock({
  block,
  onChange,
  isEditing = true,
}: BaseBlockProps) {
  const layout = block.columnLayout || '50-50';
  const columnsConfig = LAYOUT_CONFIG[layout] || LAYOUT_CONFIG['50-50'];

  const [activeColIndex, setActiveColIndex] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Initialize or fallback columnBlocks
  const columnBlocks: IBlock[][] =
    block.columnBlocks ||
    columnsConfig.map((_, i) => {
      const fallbackText = block.columnContents?.[i];
      if (fallbackText) {
        return [
          {
            id: `legacy-${block.id}-${i}`,
            type: 'paragraph',
            content: fallbackText,
          },
        ];
      }
      return [];
    });

  const updateColumnBlocks = (newColumnBlocks: IBlock[][]) => {
    if (onChange) {
      onChange({
        ...block,
        columnBlocks: newColumnBlocks,
      });
    }
  };

  const handleOpenPickerForColumn = (colIdx: number) => {
    setActiveColIndex(colIdx);
    setPickerOpen(true);
  };

  const handleClosePicker = () => {
    setPickerOpen(false);
    setActiveColIndex(null);
  };

  const handleAddChildBlock = (type: BlockType) => {
    if (activeColIndex === null) return;

    const newChildBlock = createDefaultBlock(type);

    const newColumnBlocks = columnBlocks.map((col, idx) => {
      if (idx === activeColIndex) {
        return [...col, newChildBlock];
      }
      return col;
    });

    updateColumnBlocks(newColumnBlocks);
    handleClosePicker();
  };

  const handleUpdateChildBlock = (colIdx: number, updatedChild: IBlock) => {
    const newColumnBlocks = columnBlocks.map((col, idx) => {
      if (idx === colIdx) {
        return col.map((b) => (b.id === updatedChild.id ? updatedChild : b));
      }
      return col;
    });
    updateColumnBlocks(newColumnBlocks);
  };

  const handleDeleteChildBlock = (colIdx: number, childId: string) => {
    const newColumnBlocks = columnBlocks.map((col, idx) => {
      if (idx === colIdx) {
        return col.filter((b) => b.id !== childId);
      }
      return col;
    });
    updateColumnBlocks(newColumnBlocks);
  };

  const handleMoveChildBlock = (
    colIdx: number,
    childIdx: number,
    direction: 'up' | 'down',
  ) => {
    const col = columnBlocks[colIdx];
    if (!col) return;
    const targetIdx = direction === 'up' ? childIdx - 1 : childIdx + 1;
    if (targetIdx < 0 || targetIdx >= col.length) return;

    const newCol = [...col];
    const [moved] = newCol.splice(childIdx, 1);
    newCol.splice(targetIdx, 0, moved);

    const newColumnBlocks = columnBlocks.map((c, idx) =>
      idx === colIdx ? newCol : c,
    );
    updateColumnBlocks(newColumnBlocks);
  };

  const handleColumnReorder = (
    colIdx: number,
    activeId: string,
    overId: string,
  ) => {
    const col = columnBlocks[colIdx];
    if (!col) return;
    const oldIndex = col.findIndex((b) => b.id === activeId);
    const newIndex = col.findIndex((b) => b.id === overId);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const updatedCol = arrayMove(col, oldIndex, newIndex);
      const newColumnBlocks = columnBlocks.map((c, idx) =>
        idx === colIdx ? updatedCol : c,
      );
      updateColumnBlocks(newColumnBlocks);
    }
  };

  return (
    <Box w='100%'>
      <Flex direction={{ base: 'column', md: 'row' }} gap='4' align='stretch' w='100%'>
        {columnsConfig.map((col, colIdx) => {
          const colBlocks = columnBlocks[colIdx] || [];

          return (
            <Box
              key={colIdx}
              flex={{ base: '1 1 100%', md: col.flex }}
              w={{ base: '100%', md: 'auto' }}
              p={{ base: '2.5', sm: '3.5' }}
              bg={isEditing ? 'purple.50/30' : 'transparent'}
              borderRadius='xl'
              borderWidth={isEditing ? '1px' : '0px'}
              borderColor='purple.200'
              borderStyle='dashed'
            >
              {isEditing ? (
                <VStack align='stretch' gap='3'>
                  <Flex justify='space-between' align='center'>
                    <Badge
                      size='xs'
                      variant='solid'
                      colorPalette='purple'
                      px='2'
                      py='0.5'
                      borderRadius='md'
                    >
                      {col.label}
                    </Badge>
                    <Text fontSize='2xs' color='gray.400' fontWeight='medium'>
                      {colBlocks.length}{' '}
                      {colBlocks.length === 1 ? 'block' : 'blocks'}
                    </Text>
                  </Flex>

                  {colBlocks.length === 0 ? (
                    <Box
                      p='6'
                      textAlign='center'
                      borderWidth='1px'
                      borderColor='gray.200'
                      borderStyle='dashed'
                      borderRadius='lg'
                      bg='white'
                    >
                      <Text fontSize='xs' color='gray.400' mb='3'>
                        Empty Column
                      </Text>
                      <Button
                        size='xs'
                        variant='subtle'
                        colorPalette='purple'
                        onClick={() => handleOpenPickerForColumn(colIdx)}
                      >
                        <LuPlus /> Add Block
                      </Button>
                    </Box>
                  ) : (
                    <VStack align='stretch' gap='3'>
                      <SortableBlockList
                        blocks={colBlocks}
                        isEditingMode={isEditing}
                        onUpdateBlock={(updated) =>
                          handleUpdateChildBlock(colIdx, updated)
                        }
                        onDeleteBlock={(id) =>
                          handleDeleteChildBlock(colIdx, id)
                        }
                        onMoveBlock={(idx, dir) =>
                          handleMoveChildBlock(colIdx, idx, dir)
                        }
                        onReorderBlocks={(activeId, overId) =>
                          handleColumnReorder(colIdx, activeId, overId)
                        }
                        showAddBelow={false}
                        gap='3'
                      />
                      <Button
                        size='xs'
                        variant='subtle'
                        colorPalette='purple'
                        onClick={() => handleOpenPickerForColumn(colIdx)}
                        alignSelf='center'
                        mt='1'
                        borderRadius='full'
                        px='4'
                      >
                        <LuPlus /> Add Block to Column
                      </Button>
                    </VStack>
                  )}
                </VStack>
              ) : (
                <SortableBlockList
                  blocks={colBlocks}
                  isEditingMode={false}
                  onUpdateBlock={() => {}}
                  onDeleteBlock={() => {}}
                  onMoveBlock={() => {}}
                  onReorderBlocks={() => {}}
                  showDragHandle={false}
                  showAddBelow={false}
                  gap='3'
                />
              )}
            </Box>
          );
        })}
      </Flex>

      {/* Column Block Picker Dialog */}
      <AddBlockPicker
        open={pickerOpen}
        onClose={handleClosePicker}
        onOpenChange={(e) => {
          if (!e.open) handleClosePicker();
        }}
        onSelectBlock={handleAddChildBlock}
        allowColumnBlock={false}
      />
    </Box>
  );
}

export default ColumnBlock;
