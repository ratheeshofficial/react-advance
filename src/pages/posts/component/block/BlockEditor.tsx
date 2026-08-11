import { useReducer } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  Flex,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { LuPlus, LuEye, LuPencil } from 'react-icons/lu';
import { arrayMove } from '@dnd-kit/sortable';

import type {
  IBlock,
  BlockType,
  ColumnLayoutType,
} from '../../../../types/posts/block';
import { AddBlockPicker } from './AddBlockPicker';
import { SortableBlockList, EmptyCanvas, createDefaultBlock } from './index';

interface BlockEditorState {
  blocks: IBlock[];
  isEditingMode: boolean;
  insertAfterBlockId: string | null;
}

type BlockEditorAction =
  | { type: 'ADD_BLOCK'; blockType: BlockType; columnLayout?: ColumnLayoutType }
  | { type: 'UPDATE_BLOCK'; updated: IBlock }
  | { type: 'DELETE_BLOCK'; id: string }
  | { type: 'MOVE_BLOCK'; index: number; direction: 'up' | 'down' }
  | { type: 'REORDER_BLOCKS'; activeId: string; overId: string }
  | { type: 'DUPLICATE_BLOCK'; blockId: string }
  | { type: 'TOGGLE_EDITING_MODE' }
  | { type: 'SET_INSERT_AFTER'; blockId: string | null };

const initialBlocks: IBlock[] = [
  {
    id: '1',
    type: 'heading2',
    content: 'Welcome to the Block Editor',
  },
  {
    id: '2',
    type: 'paragraph',
    content:
      'This block editor allows you to write structured articles using distinct components like headings, quotes, code snippets, callouts, and lists.',
  },
  {
    id: '3',
    type: 'callout',
    content: 'Tip: Click "Add Block" to insert new content components anytime!',
    calloutType: 'note',
  },
];

const initialState: BlockEditorState = {
  blocks: initialBlocks,
  isEditingMode: true,
  insertAfterBlockId: null,
};

function blockEditorReducer(
  state: BlockEditorState,
  action: BlockEditorAction,
): BlockEditorState {
  switch (action.type) {
    case 'ADD_BLOCK': {
      const newBlock = createDefaultBlock(
        action.blockType,
        action.columnLayout,
      );
      if (!state.insertAfterBlockId) {
        return {
          ...state,
          blocks: [...state.blocks, newBlock],
          insertAfterBlockId: null,
        };
      }
      const index = state.blocks.findIndex(
        (b) => b.id === state.insertAfterBlockId,
      );
      if (index === -1) {
        return {
          ...state,
          blocks: [...state.blocks, newBlock],
          insertAfterBlockId: null,
        };
      }
      const newBlocks = [...state.blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      return {
        ...state,
        blocks: newBlocks,
        insertAfterBlockId: null,
      };
    }
    case 'UPDATE_BLOCK': {
      return {
        ...state,
        blocks: state.blocks.map((b) =>
          b.id === action.updated.id ? action.updated : b,
        ),
      };
    }
    case 'DELETE_BLOCK': {
      return {
        ...state,
        blocks: state.blocks.filter((b) => b.id !== action.id),
      };
    }
    case 'MOVE_BLOCK': {
      const targetIdx =
        action.direction === 'up' ? action.index - 1 : action.index + 1;
      if (targetIdx < 0 || targetIdx >= state.blocks.length) return state;
      const newBlocks = [...state.blocks];
      const [moved] = newBlocks.splice(action.index, 1);
      newBlocks.splice(targetIdx, 0, moved);
      return {
        ...state,
        blocks: newBlocks,
      };
    }
    case 'REORDER_BLOCKS': {
      const oldIndex = state.blocks.findIndex((b) => b.id === action.activeId);
      const newIndex = state.blocks.findIndex((b) => b.id === action.overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex)
        return state;
      return {
        ...state,
        blocks: arrayMove(state.blocks, oldIndex, newIndex),
      };
    }
    case 'DUPLICATE_BLOCK': {
      const duplicated = state.blocks.find((b) => b.id === action.blockId);
      if (!duplicated) return state;
      const index = state.blocks.findIndex((b) => b.id === action.blockId);
      const newBlock: IBlock = { ...duplicated, id: String(Date.now()) };
      const newBlocks = [...state.blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      return {
        ...state,
        blocks: newBlocks,
      };
    }
    case 'TOGGLE_EDITING_MODE': {
      return {
        ...state,
        isEditingMode: !state.isEditingMode,
      };
    }
    case 'SET_INSERT_AFTER': {
      return {
        ...state,
        insertAfterBlockId: action.blockId,
      };
    }
    default:
      return state;
  }
}

export interface BlockEditorProps {
  isEditingMode?: boolean;
  onToggleEditingMode?: () => void;
}

export function BlockEditor({
  isEditingMode: externalIsEditingMode,
  onToggleEditingMode,
}: BlockEditorProps = {}) {
  const { open, onOpen, onClose } = useDisclosure();
  const [state, dispatch] = useReducer(blockEditorReducer, initialState);

  const isEditingMode =
    externalIsEditingMode !== undefined
      ? externalIsEditingMode
      : state.isEditingMode;
  const { blocks } = state;

  const handleToggleMode = () => {
    dispatch({ type: 'TOGGLE_EDITING_MODE' });
    onToggleEditingMode?.();
  };

  const handleOpenPicker = (blockId?: string) => {
    dispatch({ type: 'SET_INSERT_AFTER', blockId: blockId ?? null });
    onOpen();
  };

  const handleClosePicker = () => {
    dispatch({ type: 'SET_INSERT_AFTER', blockId: null });
    onClose();
  };

  const handleAddBlock = (type: BlockType, columnLayout?: ColumnLayoutType) => {
    dispatch({ type: 'ADD_BLOCK', blockType: type, columnLayout });
  };

  const handleUpdateBlock = (updated: IBlock) => {
    dispatch({ type: 'UPDATE_BLOCK', updated });
  };

  const handleDeleteBlock = (id: string) => {
    dispatch({ type: 'DELETE_BLOCK', id });
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    dispatch({ type: 'MOVE_BLOCK', index, direction });
  };

  const handleDuplicateBlock = (blockId: string) => {
    dispatch({ type: 'DUPLICATE_BLOCK', blockId });
  };

  const handleReorderBlocks = (activeId: string, overId: string) => {
    dispatch({ type: 'REORDER_BLOCKS', activeId, overId });
  };

  return (
    <Box maxW='4xl' mx='auto' py='4'>
      {/* Editor Control Header */}
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        justify='space-between'
        align={{ base: 'stretch', sm: 'center' }}
        gap={{ base: '3', sm: '0' }}
        mb='6'
        bg='white'
        p={{ base: '3', sm: '4' }}
        borderRadius='2xl'
        borderWidth='1px'
        borderColor='gray.100'
        boxShadow='sm'
      >
        <VStack align='start' gap='0'>
          <Text fontSize='lg' fontWeight='bold' color='gray.800'>
            {isEditingMode ? 'Block Content Editor' : 'Article Reader Preview'}
          </Text>
          <Text fontSize='xs' color='gray.500'>
            {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'} total
          </Text>
        </VStack>

        <HStack gap='3' justify={{ base: 'space-between', sm: 'flex-end' }}>
          <Button
            size='sm'
            variant='outline'
            colorPalette={isEditingMode ? 'gray' : 'purple'}
            onClick={handleToggleMode}
            borderRadius='lg'
          >
            {isEditingMode ? <LuEye /> : <LuPencil />}
            {isEditingMode ? 'Preview Post' : 'Edit Mode'}
          </Button>

          {isEditingMode && (
            <Button
              size='sm'
              colorPalette='purple'
              variant='solid'
              onClick={() => handleOpenPicker()}
              borderRadius='lg'
              boxShadow='sm'
            >
              <LuPlus /> Add Block
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Blocks Container */}
      {blocks.length === 0 ? (
        isEditingMode ? (
          <EmptyCanvas onSelectBlock={handleAddBlock} />
        ) : (
          <Box p='8' textAlign='center' bg='white' borderRadius='xl' borderWidth='1px' borderColor='gray.100'>
            <Text color='gray.400' fontStyle='italic'>
              No content blocks added to this post yet. Switch to Edit Mode to add blocks.
            </Text>
          </Box>
        )
      ) : (
        <SortableBlockList
          blocks={blocks}
          isEditingMode={isEditingMode}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
          onMoveBlock={handleMoveBlock}
          onReorderBlocks={handleReorderBlocks}
          onDuplicateBlock={handleDuplicateBlock}
          onOpenPicker={handleOpenPicker}
        />
      )}

      {/* Block Picker Dialog */}
      <AddBlockPicker
        open={open}
        onClose={handleClosePicker}
        onOpenChange={(e) =>
          e.open ? handleOpenPicker() : handleClosePicker()
        }
        onSelectBlock={handleAddBlock}
      />
    </Box>
  );
}

export default BlockEditor;
