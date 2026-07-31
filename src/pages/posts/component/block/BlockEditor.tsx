import { useReducer } from 'react';
import {
  Box,
  Button,
  IconButton,
  VStack,
  Text,
  Flex,
  HStack,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import {
  LuPlus,
  LuEye,
  LuPencil,
  LuArrowUp,
  LuArrowDown,
  LuTrash2,
} from 'react-icons/lu';

import type { IBlock, BlockType } from '../../../../types/posts/block';
import { AddBlockPicker } from './AddBlockPicker';
import {
  ParagraphBlock,
  Heading2Block,
  Heading3Block,
  QuoteBlock,
  OrderedListBlock,
  UnorderedListBlock,
  DividerBlock,
  CalloutBlock,
  CodeBlock,
  ImageBlock,
} from './index';

interface BlockEditorState {
  blocks: IBlock[];
  isEditingMode: boolean;
  insertAfterBlockId: string | null;
}

type BlockEditorAction =
  | { type: 'ADD_BLOCK'; blockType: BlockType }
  | { type: 'UPDATE_BLOCK'; updated: IBlock }
  | { type: 'DELETE_BLOCK'; id: string }
  | { type: 'MOVE_BLOCK'; index: number; direction: 'up' | 'down' }
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

const createDefaultBlock = (type: BlockType): IBlock => ({
  id: String(Date.now()),
  type,
  content:
    type === 'heading2'
      ? 'New Section Heading'
      : type === 'heading3'
        ? 'Sub Section Title'
        : type === 'quote'
          ? 'Inspiring quote goes here...'
          : type === 'callout'
            ? 'Important note or reminder.'
            : type === 'code'
              ? '// Add code here'
              : type === 'paragraph'
                ? ''
                : '',
  calloutType: type === 'callout' ? 'info' : undefined,
  language: type === 'code' ? 'typescript' : undefined,
  items:
    type === 'orderedList' || type === 'unorderedList'
      ? ['Item 1', 'Item 2']
      : undefined,
});

function blockEditorReducer(
  state: BlockEditorState,
  action: BlockEditorAction,
): BlockEditorState {
  switch (action.type) {
    case 'ADD_BLOCK': {
      const newBlock = createDefaultBlock(action.blockType);
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

export function BlockEditor() {
  const { open, onOpen, onClose } = useDisclosure();
  const [state, dispatch] = useReducer(blockEditorReducer, initialState);
  const { blocks, isEditingMode } = state;

  const handleOpenPicker = (blockId?: string) => {
    dispatch({ type: 'SET_INSERT_AFTER', blockId: blockId ?? null });
    onOpen();
  };

  const handleClosePicker = () => {
    dispatch({ type: 'SET_INSERT_AFTER', blockId: null });
    onClose();
  };

  const handleAddBlock = (type: BlockType) => {
    dispatch({ type: 'ADD_BLOCK', blockType: type });
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

  const renderBlock = (block: IBlock, index: number) => {
    const props = {
      block,
      onChange: handleUpdateBlock,
      onDelete: handleDeleteBlock,
      isEditing: isEditingMode,
    };

    let component;
    switch (block.type) {
      case 'paragraph':
        component = <ParagraphBlock {...props} />;
        break;
      case 'heading2':
        component = <Heading2Block {...props} />;
        break;
      case 'heading3':
        component = <Heading3Block {...props} />;
        break;
      case 'quote':
        component = <QuoteBlock {...props} />;
        break;
      case 'orderedList':
        component = <OrderedListBlock {...props} />;
        break;
      case 'unorderedList':
        component = <UnorderedListBlock {...props} />;
        break;
      case 'divider':
        component = <DividerBlock />;
        break;
      case 'callout':
        component = <CalloutBlock {...props} />;
        break;
      case 'code':
        component = <CodeBlock {...props} />;
        break;
      case 'image':
        component = <ImageBlock {...props} />;
        break;
      default:
        component = <ParagraphBlock {...props} />;
    }

    return (
      <Box key={block.id}>
        <Box
          position='relative'
          p='4'
          borderRadius='xl'
          bg='white'
          borderWidth='1px'
          borderColor='gray.200'
          boxShadow='sm'
          _hover={{ borderColor: 'purple.400', boxShadow: 'md' }}
          transition='all 0.2s'
        >
          {isEditingMode && (
            <Flex
              justify='space-between'
              align='center'
              mb='3'
              pb='2'
              borderBottom='1px solid'
              borderColor='gray.100'
            >
              <Badge
                size='sm'
                variant='subtle'
                textTransform='capitalize'
                colorPalette='purple'
                px='2.5'
                py='1'
                borderRadius='md'
              >
                {block.type}
              </Badge>

              <HStack gap='1.5'>
                {index > 0 && (
                  <IconButton
                    aria-label='Move block up'
                    size='xs'
                    variant='subtle'
                    colorPalette='gray'
                    onClick={() => handleMoveBlock(index, 'up')}
                    title='Move block up'
                    borderRadius='md'
                  >
                    <LuArrowUp />
                  </IconButton>
                )}
                {index < blocks.length - 1 && (
                  <IconButton
                    aria-label='Move block down'
                    size='xs'
                    variant='subtle'
                    colorPalette='gray'
                    onClick={() => handleMoveBlock(index, 'down')}
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
                  onClick={() => handleDeleteBlock(block.id)}
                  title='Delete block'
                  borderRadius='md'
                >
                  <LuTrash2 />
                </IconButton>
              </HStack>
            </Flex>
          )}
          {component}

          <Text
            fontSize='xs'
            mt='4'
            _hover={{ color: 'purple.500' }}
            color='gray.400'
            cursor='pointer'
            onClick={() => handleDuplicateBlock(block.id)}
          >
            Duplicate{' '}
          </Text>
        </Box>
        <Button
          size='sm'
          variant='subtle'
          colorPalette='purple'
          onClick={() => handleOpenPicker(block.id)}
          borderRadius='full'
          px='6'
          mt='4'
        >
          <LuPlus /> Add Block Below
        </Button>
      </Box>
    );
  };

  return (
    <Box maxW='4xl' mx='auto' py='4'>
      {/* Editor Control Header */}
      <Flex
        justify='space-between'
        align='center'
        mb='6'
        bg='white'
        p='4'
        borderRadius='2xl'
        borderWidth='1px'
        borderColor='gray.100'
        boxShadow='sm'
      >
        <VStack align='start' gap='0'>
          <Text fontSize='lg' fontWeight='bold' color='gray.800'>
            Block Content Editor
          </Text>
          <Text fontSize='xs' color='gray.500'>
            {blocks.length} {blocks.length === 1 ? 'block' : 'blocks'} total
          </Text>
        </VStack>

        <HStack gap='3'>
          <Button
            size='sm'
            variant='outline'
            colorPalette={isEditingMode ? 'gray' : 'purple'}
            onClick={() => dispatch({ type: 'TOGGLE_EDITING_MODE' })}
            borderRadius='lg'
          >
            {isEditingMode ? <LuEye /> : <LuPencil />}
            {isEditingMode ? 'Preview Post' : 'Edit Mode'}
          </Button>

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
        </HStack>
      </Flex>

      {/* Blocks Container */}
      {blocks.length === 0 ? (
        <Box
          p='10'
          border='2px dashed'
          borderColor='purple.200'
          borderRadius='2xl'
          textAlign='center'
          bg='purple.50/30'
        >
          <Text color='gray.600' fontWeight='medium' mb='4'>
            No content blocks added yet. Start creating your article!
          </Text>
          <Button
            colorPalette='purple'
            size='sm'
            onClick={() => handleOpenPicker()}
          >
            <LuPlus /> Add Your First Block
          </Button>
        </Box>
      ) : (
        <VStack align='stretch' gap='4'>
          {blocks.map((block, idx) => renderBlock(block, idx))}
        </VStack>
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
