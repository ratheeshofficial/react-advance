import { Box, Flex, Textarea, Text, HStack, Badge } from '@chakra-ui/react';
import { LuInfo, LuTriangleAlert, LuCircleCheck, LuLightbulb } from 'react-icons/lu';
import type { BaseBlockProps } from '../../../../types/posts/block';

export function CalloutBlock({ block, onChange, isEditing = true }: BaseBlockProps) {
  const type = block.calloutType || 'info';

  const typeConfigs = {
    info: {
      bg: 'blue.50',
      borderColor: 'blue.300',
      iconColor: 'blue.600',
      Icon: LuInfo,
      label: 'Info',
    },
    warning: {
      bg: 'amber.50',
      borderColor: 'amber.300',
      iconColor: 'amber.600',
      Icon: LuTriangleAlert,
      label: 'Warning',
    },
    success: {
      bg: 'green.50',
      borderColor: 'green.300',
      iconColor: 'green.600',
      Icon: LuCircleCheck,
      label: 'Success',
    },
    note: {
      bg: 'purple.50',
      borderColor: 'purple.300',
      iconColor: 'purple.600',
      Icon: LuLightbulb,
      label: 'Tip',
    },
  };

  const currentConfig = typeConfigs[type];
  const IconComponent = currentConfig.Icon;

  return (
    <Box py='1'>
      <Box
        p='4'
        borderRadius='xl'
        bg={currentConfig.bg}
        borderWidth='1px'
        borderColor={currentConfig.borderColor}
      >
        <Flex justify='space-between' align='center' mb='2'>
          <HStack gap='2'>
            <Box color={currentConfig.iconColor} fontSize='xl'>
              <IconComponent />
            </Box>
            <Badge size='sm' variant='subtle' textTransform='uppercase'>
              {currentConfig.label}
            </Badge>
          </HStack>

          {isEditing && (
            <HStack gap='1'>
              {(['info', 'note', 'warning', 'success'] as const).map((t) => (
                <Box
                  key={t}
                  as='button'
                  px='2'
                  py='0.5'
                  fontSize='xs'
                  borderRadius='md'
                  fontWeight={type === t ? 'bold' : 'normal'}
                  bg={type === t ? 'white' : 'transparent'}
                  boxShadow={type === t ? 'xs' : 'none'}
                  onClick={() => onChange?.({ ...block, calloutType: t })}
                >
                  {t}
                </Box>
              ))}
            </HStack>
          )}
        </Flex>

        {isEditing ? (
          <Textarea
            value={block.content || ''}
            onChange={(e) => onChange?.({ ...block, content: e.target.value })}
            placeholder='Important callout message or note...'
            variant='subtle'
            size='sm'
            bg='white/80'
            _focus={{ bg: 'white', borderColor: currentConfig.borderColor }}
            borderRadius='md'
          />
        ) : (
          <Text fontSize='md' color='gray.800' lineHeight='relaxed'>
            {block.content || 'Important callout text...'}
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default CalloutBlock;
