import { VStack } from '@chakra-ui/react';
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { IBlock } from '../../../../types/posts/block';
import { SortableBlockItem } from './SortableBlockItem';
import { useBlockSensors } from './blockUtils';

export interface SortableBlockListProps {
  blocks: IBlock[];
  isEditingMode: boolean;
  onUpdateBlock: (updated: IBlock) => void;
  onDeleteBlock: (id: string) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onReorderBlocks: (activeId: string, overId: string) => void;
  onDuplicateBlock?: (id: string) => void;
  onOpenPicker?: (id: string) => void;
  showDragHandle?: boolean;
  showAddBelow?: boolean;
  gap?: string;
}

export function SortableBlockList({
  blocks,
  isEditingMode,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onReorderBlocks,
  onDuplicateBlock,
  onOpenPicker,
  showDragHandle = true,
  showAddBelow = true,
  gap,
}: SortableBlockListProps) {
  const sensors = useBlockSensors();
  const resolvedGap = gap ?? (isEditingMode ? '2' : '4');

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderBlocks(String(active.id), String(over.id));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <VStack align='stretch' gap={resolvedGap}>
          {blocks.map((block, idx) => (
            <SortableBlockItem
              key={block.id}
              block={block}
              index={idx}
              totalBlocks={blocks.length}
              isEditingMode={isEditingMode}
              onUpdateBlock={onUpdateBlock}
              onDeleteBlock={onDeleteBlock}
              onMoveBlock={onMoveBlock}
              onDuplicateBlock={onDuplicateBlock}
              onOpenPicker={onOpenPicker}
              showDragHandle={showDragHandle}
              showAddBelow={showAddBelow}
            />
          ))}
        </VStack>
      </SortableContext>
    </DndContext>
  );
}

export default SortableBlockList;
