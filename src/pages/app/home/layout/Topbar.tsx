import { Flex, Spacer, HStack, Text, Box, IconButton } from '@chakra-ui/react';
import { FiUser, FiMenu } from 'react-icons/fi';

interface TopbarProps {
  onOpen?: () => void;
}

export function Topbar({ onOpen }: TopbarProps) {
  return (
    <Flex
      as='header'
      w='full'
      bg='white'
      h='16' // 64px height
      align='center'
      px={{ base: '4', md: '6' }}
      // borderBottomWidth='1px'
      // borderColor='gray.200'
      // shadow='sm'
      zIndex='5'
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant='ghost'
        aria-label='open menu'
        mr='2'
      > <FiMenu size={24} color='gray' /></IconButton>
      {/* <Heading size='sm' color='gray.600' fontWeight='semibold'>
        Overview
      </Heading> */}
      <Spacer />
      <HStack gap='6' color='gray.500'>
        {/* <Box as={FiSearch} size='20px' cursor='pointer' _hover={{ color: 'blue.500' }} transition='color 0.2s' />
        <Box as={FiBell} size='20px' cursor='pointer' _hover={{ color: 'blue.500' }} transition='color 0.2s' /> */}

        {/* Simple Profile Button */}
        <Flex
          align='center'
          gap='2'
          cursor='pointer'
          _hover={{ color: 'blue.500' }}
          transition='color 0.2s'
        >
          <Flex
            align='center'
            justify='center'
            bg='blue.50'
            color='blue.600'
            h='8'
            w='8'
            borderRadius='full'
          >
            <Box as={FiUser} />
          </Flex>
          <Text fontSize='sm' fontWeight='medium'>
            Admin
          </Text>
        </Flex>
      </HStack>
    </Flex>
  );
}
