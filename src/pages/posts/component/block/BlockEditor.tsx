import { useReducer, useMemo } from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
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
    content:
      'Click "Add block" or hover between sections to insert new content anytime.',
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
}: BlockEditorProps = {}) {
  const { open, onOpen, onClose } = useDisclosure();
  const [state, dispatch] = useReducer(blockEditorReducer, initialState);

  const isEditingMode =
    externalIsEditingMode !== undefined
      ? externalIsEditingMode
      : state.isEditingMode;
  const { blocks } = state;

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

  const totalWords = useMemo(() => {
    return blocks.reduce((acc, b) => {
      const text = b.content || '';
      return acc + text.trim().split(/\s+/).filter(Boolean).length;
    }, 0);
  }, [blocks]);

  const readTime = Math.max(1, Math.ceil(totalWords / 200));

  return (
    <Box maxW='760px' mx='auto' py='2'>
      {/* Content Editor Toolbar */}
      <Flex
        align='center'
        justify='space-between'
        mb='4'
        pb='3.5'
        borderBottom='1px solid var(--rule)'
      >
        <Box>
          <Text
            fontFamily="'Fraunces', serif"
            fontWeight='600'
            fontSize='17px'
            color='var(--ink)'
            lineHeight='1.2'
          >
            Content
          </Text>
          <Text
            fontFamily="'IBM Plex Mono', monospace"
            fontSize='11px'
            color='var(--muted-2)'
            mt='0.5'
          >
            {blocks.length} {blocks.length === 1 ? 'BLOCK' : 'BLOCKS'} · ~
            {totalWords} WORDS · {readTime} MIN READ
          </Text>
        </Box>

        <HStack gap='2.5' align='center'>
          {/* <Button
            size='sm'
            variant='outline'
            borderColor='var(--rule)'
            bg='var(--paper-raised)'
            color='var(--ink-soft)'
            fontFamily="'Inter', sans-serif"
            fontSize='13px'
            fontWeight='600'
            borderRadius='8px'
            px='3'
            py='2'
            _hover={{ bg: 'var(--rule-soft)' }}
            onClick={handleToggleMode}
          >
            {isEditingMode ? <FiEye size={14} style={{ marginRight: '4px' }} /> : <FiEdit3 size={14} style={{ marginRight: '4px' }} />}
            {isEditingMode ? 'Preview' : 'Edit Mode'}
          </Button> */}

          {isEditingMode && (
            <Button
              size='sm'
              variant='outline'
              borderColor='var(--rule)'
              bg='var(--paper-raised)'
              color='var(--ink-soft)'
              fontFamily="'Inter', sans-serif"
              fontSize='13px'
              fontWeight='600'
              borderRadius='8px'
              px='3.5'
              py='2'
              _hover={{ bg: 'var(--rule-soft)', color: 'var(--ink)' }}
              onClick={() => handleOpenPicker()}
            >
              <FiPlus size={14} style={{ marginRight: '4px' }} />
              Add block
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Blocks Stack Container */}
      {blocks.length === 0 ? (
        isEditingMode ? (
          <EmptyCanvas onSelectBlock={handleAddBlock} />
        ) : (
          <Box
            p='8'
            textAlign='center'
            bg='var(--paper-raised)'
            borderRadius='9px'
            border='1px solid var(--rule)'
          >
            <Text color='var(--muted-2)' fontStyle='italic' fontSize='13.5px'>
              No content blocks added to this post yet. Switch to Edit Mode to
              add blocks.
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
