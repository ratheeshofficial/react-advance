import { memo } from 'react';
import { Box, Flex, Textarea, Text, HStack } from '@chakra-ui/react';
import { FiInfo, FiAlertTriangle, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';
import type { BaseBlockProps } from '../../../../types/posts/block';

export const CalloutBlock = memo(function CalloutBlock({
  block,
  onChange,
  isEditing = true,
}: BaseBlockProps) {
  const type = block.calloutType || 'note';

  const typeConfigs = {
    info: {
      bg: 'status.approved.subtle',
      labelColor: 'status.approved.fg',
      Icon: FiInfo,
      label: 'INFO',
    },
    warning: {
      bg: 'stamp.subtle',
      labelColor: 'stamp.fg',
      Icon: FiAlertTriangle,
      label: 'WARNING',
    },
    success: {
      bg: 'status.published.subtle',
      labelColor: 'status.published.fg',
      Icon: FiCheckCircle,
      label: 'SUCCESS',
    },
    note: {
      bg: 'stamp.subtle',
      labelColor: 'stamp.fg',
      Icon: FiHelpCircle,
      label: 'TIP',
    },
  };

  const currentConfig = typeConfigs[type] || typeConfigs.note;
  const IconComponent = currentConfig.Icon;

  return (
    <Box py='1'>
      <Box
        p='12px 14px'
        borderRadius='8px'
        bg={currentConfig.bg}
      >
        <Flex justify='space-between' align='center' mb='1.5'>
          <HStack gap='8px' align='center'>
            <Box color={currentConfig.labelColor} fontSize='14px'>
              <IconComponent />
            </Box>
            <Text
              fontFamily="'IBM Plex Mono', monospace"
              fontSize='10px'
              fontWeight='700'
              color={currentConfig.labelColor}
              letterSpacing='0.06em'
            >
              {currentConfig.label}
            </Text>
          </HStack>

          {isEditing && (
            <HStack gap='4px'>
              {(['note', 'info', 'warning', 'success'] as const).map((t) => (
                <Box
                  key={t}
                  as='button'
                  aria-label={`Set callout type to ${t}`}
                  px='7px'
                  py='2px'
                  fontFamily="'IBM Plex Mono', monospace"
                  fontSize='9.5px'
                  borderRadius='4px'
                  fontWeight={type === t ? '700' : '400'}
                  bg={type === t ? 'bg.surface' : 'transparent'}
                  color={type === t ? currentConfig.labelColor : 'text.muted'}
                  shadow={type === t ? 'sm' : 'none'}
                  onClick={() => onChange?.({ ...block, calloutType: t })}
                  cursor='pointer'
                >
                  {t.toUpperCase()}
                </Box>
              ))}
            </HStack>
          )}
        </Flex>

        {isEditing ? (
          <Textarea
            value={block.content || ''}
            onChange={(e) => onChange?.({ ...block, content: e.target.value })}
            placeholder='Click "Add block" or hover between sections to insert new content anytime.'
            aria-label='Callout content'
            border='none'
            outline='none'
            _focus={{ outline: 'none', boxShadow: 'none' }}
            fontFamily="'Inter', sans-serif"
            fontSize='13.5px'
            color='text.secondary'
            lineHeight='1.5'
            py='0'
            px='0'
            minH='44px'
          />
        ) : (
          <Text
            fontFamily="'Inter', sans-serif"
            fontSize='13.5px'
            color='text.secondary'
            lineHeight='1.5'
          >
            {block.content || ''}
          </Text>
        )}
      </Box>
    </Box>
  );
});

export default CalloutBlock;

