import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { hideScrollbarCss } from '../../../constant/styles';

export const EditorArea = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box
      h={{ base: 'auto', xl: '100%' }}
      w={{ base: '100%', md: 'calc(100% - 250px)', xl: 'calc(100% - 550px)' }}
      p='8'
      bg='white'
      color='black'
      overflowY={{ base: 'visible', xl: 'auto' }}
      css={hideScrollbarCss}
    >
      <Box maxW='3xl' mx='auto'>
        <Text fontSize='3xl' fontWeight='extrabold' mb='6' color='gray.800'>
          Editor Canvas
        </Text>
        <Text fontSize='lg' color='gray.500' mb='8'>
          (Write Blog Here)
        </Text>
        {children}
      </Box>
    </Box>
  );
};
