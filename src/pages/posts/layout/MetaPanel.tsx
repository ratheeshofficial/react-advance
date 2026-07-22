import { Box, Text, VStack } from '@chakra-ui/react';
import { hideScrollbarCss } from '../../../constant/styles';

export const MetaPanel = () => {
  return (
    <Box
      h={{ base: 'auto', xl: '100%' }}
      overflowY={{ base: 'visible', xl: 'auto' }}
      w={{ base: '100%', xl: '300px' }}
      bg='gray.50'
      // borderLeft={{ base: 'none', xl: '1px solid' }}
      borderTop={{ base: '1px solid', xl: 'none' }}
      borderColor='gray.200'
      p='6'
      css={hideScrollbarCss}
    >
      <Text fontSize='lg' fontWeight='bold' mb='4' color='gray.800'>
        Meta Panel
      </Text>
      {/* <Divider mb="4" /> */}
      <VStack align='start' gap='4'>
        <Box>
          <Text fontSize='sm' fontWeight='semibold' color='gray.600'>
            Publish Info
          </Text>
          <Text fontSize='sm' color='gray.500' mt='1'>
            Status: Draft
          </Text>
        </Box>
        <Box>
          <Text fontSize='sm' fontWeight='semibold' color='gray.600'>
            Author
          </Text>
          <Text fontSize='sm' color='gray.500' mt='1'>
            John Doe
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};
