import { Flex } from '@chakra-ui/react';
import React from 'react';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const childrenArray = React.Children.toArray(children);
  const Header = childrenArray[0];
  const Sidebar = childrenArray[1];
  const EditorArea = childrenArray[2];
  const MetaPanel = childrenArray[3];

  return (
    <Flex direction='column' h='100vh' w='100vw' overflow='hidden'>
      {Header}
      <Flex
        flex='1'
        direction='row'
        wrap='wrap'
        overflow={{ base: 'auto', xl: 'hidden' }}
      >
        {Sidebar}
        {EditorArea}
        {MetaPanel}
      </Flex>
    </Flex>
  );
};
