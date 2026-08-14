import { memo } from 'react';
import { Box } from '@chakra-ui/react';

export const DividerBlock = memo(function DividerBlock() {
  return (
    <Box py='4'>
      <Box
        h='2px'
        bgGradient='to-r'
        gradientFrom='purple.100'
        gradientVia='purple.400'
        gradientTo='gray.100'
        borderRadius='full'
      />
    </Box>
  );
});

export default DividerBlock;
