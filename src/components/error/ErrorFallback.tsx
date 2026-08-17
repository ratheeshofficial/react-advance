import { type FallbackProps } from 'react-error-boundary';
import { Box, Button, Flex, Heading, Text, VStack, HStack } from '@chakra-ui/react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box
      role='alert'
      p='8'
      m='4'
      borderRadius='16px'
      bg='bg.surface'
      border='1px solid'
      borderColor='border.default'
      shadow='sm'
      textAlign='center'
      maxW='520px'
      mx='auto'
    >
      <VStack gap='4'>
        <Flex
          w='48px'
          h='48px'
          borderRadius='full'
          bg='danger.subtle'
          color='danger.fg'
          align='center'
          justify='center'
          fontSize='22px'
        >
          <FiAlertTriangle />
        </Flex>

        <VStack gap='1'>
          <Heading
            as='h2'
            fontFamily="'Fraunces', serif"
            fontSize='20px'
            fontWeight='600'
            color='text.primary'
          >
            Something went wrong
          </Heading>
          <Text fontSize='13.5px' color='text.muted'>
            An unexpected error occurred while rendering this component.
          </Text>
        </VStack>

        {(error as Error)?.message && (
          <Box
            w='100%'
            p='3'
            bg='bg.muted'
            borderRadius='8px'
            border='1px solid'
            borderColor='border.default'
            textAlign='left'
            maxH='120px'
            overflowY='auto'
          >
            <Text
              fontFamily="'IBM Plex Mono', monospace"
              fontSize='11.5px'
              color='danger.fg'
              whiteSpace='pre-wrap'
            >
              {(error as Error).message}
            </Text>
          </Box>
        )}

        <HStack gap='3' justify='center'>
          <Button
            size='sm'
            bg='accent.solid'
            color='text.inverse'
            borderRadius='8px'
            fontSize='13px'
            fontWeight='600'
            px='4'
            py='2'
            _hover={{ bg: 'accent.hover' }}
            onClick={resetErrorBoundary}
          >
            <FiRefreshCw size={14} style={{ marginRight: '6px' }} />
            Try again
          </Button>
          <Button
            size='sm'
            variant='outline'
            borderColor='border.default'
            color='text.secondary'
            borderRadius='8px'
            fontSize='13px'
            fontWeight='600'
            px='4'
            py='2'
            _hover={{ bg: 'bg.subtle' }}
            onClick={() => (window.location.href = '/')}
          >
            <FiHome size={14} style={{ marginRight: '6px' }} />
            Go to Dashboard
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

export function ListingErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box
      role='alert'
      p='10'
      my='6'
      borderRadius='16px'
      bg='bg.surface'
      border='1px solid'
      borderColor='border.default'
      shadow='sm'
      textAlign='center'
      maxW='600px'
      mx='auto'
    >
      <VStack gap='4'>
        <Flex
          w='52px'
          h='52px'
          borderRadius='full'
          bg='stamp.subtle'
          color='stamp.fg'
          align='center'
          justify='center'
          fontSize='24px'
        >
          <FiAlertTriangle />
        </Flex>

        <VStack gap='1'>
          <Heading
            as='h2'
            fontFamily="'Fraunces', serif"
            fontSize='22px'
            fontWeight='600'
            color='text.primary'
          >
            Failed to load posts listing
          </Heading>
          <Text fontSize='14px' color='text.muted'>
            We ran into an issue while retrieving your articles workspace.
          </Text>
        </VStack>

        {(error as Error)?.message && (
          <Box
            w='100%'
            p='3'
            bg='bg.muted'
            borderRadius='8px'
            border='1px solid'
            borderColor='border.default'
            textAlign='left'
          >
            <Text
              fontFamily="'IBM Plex Mono', monospace"
              fontSize='11.5px'
              color='stamp.fg'
              whiteSpace='pre-wrap'
            >
              {(error as Error).message}
            </Text>
          </Box>
        )}

        <Button
          size='sm'
          bg='accent.solid'
          color='text.inverse'
          borderRadius='8px'
          fontSize='13px'
          fontWeight='600'
          px='5'
          py='2.5'
          h='auto'
          _hover={{ bg: 'accent.hover' }}
          onClick={resetErrorBoundary}
        >
          <FiRefreshCw size={14} style={{ marginRight: '6px' }} />
          Reload Listing
        </Button>
      </VStack>
    </Box>
  );
}

export function EditorErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Box
      role='alert'
      p='10'
      my='6'
      borderRadius='16px'
      bg='bg.surface'
      border='1px solid'
      borderColor='border.default'
      shadow='sm'
      textAlign='center'
      maxW='640px'
      mx='auto'
    >
      <VStack gap='4'>
        <Flex
          w='56px'
          h='56px'
          borderRadius='full'
          bg='danger.subtle'
          color='danger.fg'
          align='center'
          justify='center'
          fontSize='26px'
        >
          <FiAlertTriangle />
        </Flex>

        <VStack gap='1'>
          <Heading
            as='h2'
            fontFamily="'Fraunces', serif"
            fontSize='24px'
            fontWeight='600'
            color='text.primary'
          >
            Editor Encountered an Error
          </Heading>
          <Text fontSize='14px' color='text.muted'>
            An unhandled exception occurred within the block editor workspace.
          </Text>
        </VStack>

        {(error as Error)?.message && (
          <Box
            w='100%'
            p='3.5'
            bg='bg.muted'
            borderRadius='8px'
            border='1px solid'
            borderColor='border.default'
            textAlign='left'
            maxH='140px'
            overflowY='auto'
          >
            <Text
              fontFamily="'IBM Plex Mono', monospace"
              fontSize='12px'
              color='danger.fg'
              whiteSpace='pre-wrap'
            >
              {(error as Error).message}
            </Text>
          </Box>
        )}

        <HStack gap='3.5' justify='center'>
          <Button
            size='sm'
            bg='accent.solid'
            color='text.inverse'
            borderRadius='8px'
            fontSize='13.5px'
            fontWeight='600'
            px='5'
            py='2.5'
            h='auto'
            _hover={{ bg: 'accent.hover' }}
            onClick={resetErrorBoundary}
          >
            <FiRefreshCw size={14} style={{ marginRight: '6px' }} />
            Retry Editor
          </Button>
          <Button
            size='sm'
            variant='outline'
            borderColor='border.default'
            color='text.secondary'
            borderRadius='8px'
            fontSize='13.5px'
            fontWeight='600'
            px='5'
            py='2.5'
            h='auto'
            _hover={{ bg: 'bg.subtle' }}
            onClick={() => (window.location.href = '/')}
          >
            <FiHome size={14} style={{ marginRight: '6px' }} />
            Back to Posts
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

export default ErrorFallback;
