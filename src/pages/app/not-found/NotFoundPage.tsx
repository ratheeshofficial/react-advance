import { Box, Button, Heading, Text, VStack, Image } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';

export default function NotFoundPage() {
  const navigate = useNavigate();
  function navigateHome() {
    navigate({ to: '/app/home' });
  }
  return (
    <Box display='flex' alignItems='center' justifyContent='center' minH='80vh'>
      <VStack gap={8} textAlign='center' padding={8}>
        <Image
          src='https://media.giphy.com/media/A9EcBzd6t8DZe/giphy.gif'
          alt='Confused Travolta 404'
          borderRadius='2xl'
          boxShadow='2xl'
          maxW={{ base: '200px', md: '200px' }}
        />
        <Heading fontSize={{ base: '4xl', md: '6xl' }} fontWeight='extrabold'>
          404 - Page Not Found
        </Heading>
        <Text fontSize='xl' color='gray.500' maxW='lg'>
          Oops! It seems you've wandered into the unknown. The page you are
          looking for doesn't exist or has been moved.
        </Text>
        <Button
          size='lg'
          onClick={navigateHome}
          variant='solid'
          colorPalette='teal'
          borderRadius='full'
          px={8}
          mt={4}
        >
          Take Me Home
        </Button>
      </VStack>
    </Box>
  );
}
