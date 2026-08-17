import { memo } from 'react';
import { Box } from '@chakra-ui/react';

export const DividerBlock = memo(function DividerBlock() {
  return (
    <Box py='4'>
      <Box
        h='2px'
        bgGradient='to-r'
        gradientFrom='accent.subtle'
        gradientVia='accent.solid'
        gradientTo='bg.subtle'
        borderRadius='full'
      />
    </Box>
  );
});

export default DividerBlock;
