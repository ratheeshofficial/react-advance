import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export function HomePage() {
  return (
    <Box>
      <VStack align="start" gap="4">
        <Heading size="lg" color="blue.600">Home Page</Heading>
        <Text color="gray.600">Welcome to the Nexus application home page. This layout and content are fully powered by Chakra UI.</Text>
      </VStack>
    </Box>
  );
}
