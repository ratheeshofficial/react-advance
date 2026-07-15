import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export function AboutPage() {
  return (
    <Box>
      <VStack align="start" gap="4">
        <Heading size="lg" color="blue.600">About Us</Heading>
        <Text color="gray.600">Learn more about our team and what we do. All styled with Chakra UI for a modern aesthetic.</Text>
      </VStack>
    </Box>
  );
}
