import { Box } from '@chakra-ui/react';
import React from 'react';
import { hideScrollbarCss } from '../../../constant/styles';

export const EditorArea = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box
      flex='1'
      h={{ base: 'auto', xl: '100%' }}
      w={{ base: '100%', md: 'calc(100% - 220px)', xl: 'calc(100% - 560px)' }}
      py={{ base: 4, md: 6 }}
      px={{ base: 4, md: 7 }}
      bg='var(--paper)'
      color='var(--ink)'
      overflowY={{ base: 'visible', xl: 'auto' }}
      css={hideScrollbarCss}
    >
      <Box maxW='1100px' mx='auto'>
        {children}
      </Box>
    </Box>
  );
};

