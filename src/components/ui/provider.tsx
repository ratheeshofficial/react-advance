'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';
import { Toaster } from './toaster';
import { system } from '../../theme/system';

export function Provider(props: ColorModeProviderProps) {
  const { children, ...rest } = props;

  return (
    <ChakraProvider value={system}>
      <ColorModeProvider defaultTheme='system' enableSystem {...rest}>
        {children}
        <Toaster />
      </ColorModeProvider>
    </ChakraProvider>
  );
}
