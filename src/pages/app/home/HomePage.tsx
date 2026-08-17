import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export function HomePage() {
  return (
    <Box>
      <VStack align="start" gap="4">
        <Heading size="lg" color="accent.fg">Home Page</Heading>
        <Text color="text.muted">Welcome to the Nexus application home page. This layout and content are fully powered by Chakra UI.</Text>
      </VStack>
    </Box>
  );
}
