import { Flex, Spacer, HStack, Text, Box, IconButton } from '@chakra-ui/react';
import { FiUser, FiMenu } from 'react-icons/fi';
import { ColorModeButton } from '../../../../components/ui/color-mode';

interface TopbarProps {
  onOpen?: () => void;
}

export function Topbar({ onOpen }: TopbarProps) {
  return (
    <Flex
      as='header'
      w='full'
      bg='bg.surface'
      h='16'
      align='center'
      px={{ base: '4', md: '6' }}
      borderBottomWidth='1px'
      borderColor='border.default'
      zIndex='5'
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant='ghost'
        aria-label='open menu'
        mr='2'
        color='text.secondary'
      >
        <FiMenu size={24} />
      </IconButton>
      <Spacer />
      <HStack gap='3' color='text.muted'>
        <ColorModeButton />
        <Flex
          align='center'
          gap='2'
          cursor='pointer'
          _hover={{ color: 'accent.fg' }}
          transition='color 0.2s'
        >
          <Flex
            align='center'
            justify='center'
            bg='accent.subtle'
            color='accent.fg'
            h='8'
            w='8'
            borderRadius='full'
          >
            <Box as={FiUser} />
          </Flex>
          <Text fontSize='sm' fontWeight='medium' color='text.secondary'>
            Admin
          </Text>
        </Flex>
      </HStack>
    </Flex>
  );
}
