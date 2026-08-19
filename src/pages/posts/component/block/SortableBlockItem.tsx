import React, { memo } from 'react';
import type { IBlock } from '../../../../types/posts/block';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  Flex,
  HStack,
  Text,
} from '@chakra-ui/react';
import {
  FiChevronUp,
  FiChevronDown,
  FiTrash2,
  FiPlus,
  FiType,
  FiAlignLeft,
  FiInfo,
  FiCode,
  FiPaperclip,
  FiMessageSquare,
} from 'react-icons/fi';
import { BlockRenderer } from './BlockRenderer';
import { blockPreviewResetCss } from '../../../../constant/styles';

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

const getBlockTheme = (type: string) => {
  switch (type.toLowerCase()) {
    case 'heading1':
    case 'heading2':
    case 'heading3':
      return {
        borderColor: 'status.approved.fg',
        pillBg: 'status.approved.subtle',
        pillColor: 'status.approved.fg',
        label: type === 'heading3' ? 'Heading 3' : 'Heading 2',
        Icon: FiType,
      };
    case 'paragraph':
      return {
        borderColor: 'text.muted',
        pillBg: 'bg.subtle',
        pillColor: 'text.muted',
        label: 'Paragraph',
        Icon: FiAlignLeft,
      };
    case 'callout':
      return {
        borderColor: 'stamp.fg',
        pillBg: 'stamp.subtle',
        pillColor: 'stamp.fg',
        label: 'Callout',
        Icon: FiInfo,
      };
    case 'code':
      return {
        borderColor: 'status.scheduled.fg',
        pillBg: 'status.scheduled.subtle',
        pillColor: 'status.scheduled.fg',
        label: 'Code',
        Icon: FiCode,
      };
    case 'quote':
      return {
        borderColor: 'accent.solid',
        pillBg: 'accent.subtle',
        pillColor: 'accent.fg',
        label: 'Quote',
        Icon: FiMessageSquare,
      };
    case 'attachment':
      return {
        borderColor: 'status.published.fg',
        pillBg: 'status.published.subtle',
        pillColor: 'status.published.fg',
        label: 'Attachment',
        Icon: FiPaperclip,
      };
    default:
      return {
        borderColor: 'accent.solid',
        pillBg: 'accent.subtle',
        pillColor: 'accent.fg',
        label: type.charAt(0).toUpperCase() + type.slice(1),
        Icon: FiAlignLeft,
      };
  }
};

export const SortableBlockItem = memo(function SortableBlockItem({
  block,
  index,
  totalBlocks,
  isEditingMode,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
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

  const theme = getBlockTheme(block.type);
  const IconComponent = theme.Icon;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <Box
        position='relative'
        bg={isEditingMode ? 'bg.surface' : 'transparent'}
        borderWidth={isEditingMode ? '1px' : '0'}
        borderStyle='solid'
        borderColor='border.default'
        borderLeftWidth={isEditingMode ? '4px' : '0'}
        borderLeftColor={isEditingMode ? theme.borderColor : 'transparent'}
        borderRadius={isEditingMode ? '9px' : '0'}
        p={isEditingMode ? '14px 16px 16px' : '0'}
        transition='all 0.15s ease'
        _hover={isEditingMode ? { shadow: 'sm' } : {}}
      >
        {isEditingMode && (
          <Flex
            justify='space-between'
            align='center'
            mb='2.5'
          >
            <HStack gap='9px' align='center'>
              {showDragHandle && (
                <Box
                  as='button'
                  color='text.muted'
                  cursor='grab'
                  fontSize='14px'
                  letterSpacing='1px'
                  userSelect='none'
                  aria-label={`Drag block ${index + 1} (${theme.label}) to reorder`}
                  _active={{ cursor: 'grabbing' }}
                  _focusVisible={{ outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'accent.solid', borderRadius: '4px' }}
                  title='Drag to reorder'
                  {...attributes}
                  {...listeners}
                >
                  ⠿
                </Box>
              )}
              <HStack
                bg={theme.pillBg}
                color={theme.pillColor}
                px='9px'
                py='3px'
                borderRadius='5px'
                fontFamily="'IBM Plex Mono', monospace"
                fontSize='10.5px'
                fontWeight='600'
                letterSpacing='0.03em'
                gap='5px'
              >
                <IconComponent size={10} />
                <Text>{theme.label}</Text>
              </HStack>
            </HStack>

            <HStack gap='5px' align='center'>
              {index > 0 && (
                <Box
                  as='button'
                  aria-label={`Move block ${index + 1} up`}
                  tabIndex={0}
                  w='26px'
                  h='26px'
                  borderRadius='6px'
                  borderWidth='1px'
                  borderStyle='solid'
                  borderColor='border.default'
                  bg='bg.surface'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  color='text.muted'
                  cursor='pointer'
                  transition='all 0.12s ease'
                  _hover={{ bg: 'bg.subtle', color: 'text.primary' }}
                  _focusVisible={{ outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'accent.solid', borderRadius: '6px' }}
                  onClick={() => onMoveBlock(index, 'up')}
                  title='Move block up'
                >
                  <FiChevronUp size={14} />
                </Box>
              )}
              {index < totalBlocks - 1 && (
                <Box
                  as='button'
                  aria-label={`Move block ${index + 1} down`}
                  tabIndex={0}
                  w='26px'
                  h='26px'
                  borderRadius='6px'
                  borderWidth='1px'
                  borderStyle='solid'
                  borderColor='border.default'
                  bg='bg.surface'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  color='text.muted'
                  cursor='pointer'
                  transition='all 0.12s ease'
                  _hover={{ bg: 'bg.subtle', color: 'text.primary' }}
                  _focusVisible={{ outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'accent.solid', borderRadius: '6px' }}
                  onClick={() => onMoveBlock(index, 'down')}
                  title='Move block down'
                >
                  <FiChevronDown size={14} />
                </Box>
              )}
              <Box
                as='button'
                aria-label={`Delete block ${index + 1}`}
                tabIndex={0}
                w='26px'
                h='26px'
                borderRadius='6px'
                borderWidth='1px'
                borderStyle='solid'
                borderColor='border.default'
                bg='bg.surface'
                display='flex'
                alignItems='center'
                justifyContent='center'
                color='text.muted'
                cursor='pointer'
                transition='all 0.12s ease'
                _hover={{ bg: 'danger.subtle', color: 'danger.fg', borderColor: 'danger.border' }}
                _focusVisible={{ outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'danger.fg', borderRadius: '6px' }}
                onClick={() => onDeleteBlock(block.id)}
                title='Delete block'
              >
                <FiTrash2 size={12} />
              </Box>
            </HStack>
          </Flex>
        )}

        <Box css={blockPreviewResetCss}>
          <BlockRenderer
            block={block}
            onChange={onUpdateBlock}
            onDelete={onDeleteBlock}
            isEditing={isEditingMode}
          />
        </Box>
      </Box>

      {/* Insert zone overlays the seam below this block without reserving layout space */}
      {isEditingMode && showAddBelow && onOpenPicker && (
        <Box
          position='absolute'
          left='0'
          right='0'
          bottom='0'
          h='26px'
          transform='translateY(50%)'
          display='flex'
          alignItems='center'
          justifyContent='center'
          role='group'
          zIndex={3}
        >
          <Box
            position='absolute'
            left='0'
            right='0'
            top='50%'
            h='1px'
            bg='border.default'
            opacity='0'
            transition='opacity 0.15s ease'
            _groupHover={{ opacity: 1 }}
          />
          <Box
            as='button'
            aria-label={`Insert block after block ${index + 1}`}
            tabIndex={0}
            position='relative'
            zIndex={2}
            w='26px'
            h='26px'
            borderRadius='full'
            bg='bg.surface'
            borderWidth='1.5px'
            borderStyle='solid'
            borderColor='border.default'
            color='text.muted'
            display='flex'
            alignItems='center'
            justifyContent='center'
            cursor='pointer'
            opacity='0'
            transform='scale(0.85)'
            transition='all 0.15s ease'
            _groupHover={{ opacity: 1, transform: 'scale(1)' }}
            _hover={{ bg: 'accent.solid', borderColor: 'accent.solid', color: 'text.inverse' }}
            _focusVisible={{ opacity: 1, transform: 'scale(1)', outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'accent.solid' }}
            onClick={() => onOpenPicker(block.id)}
            title='Insert block here'
          >
            <FiPlus size={13} />
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default SortableBlockItem;

