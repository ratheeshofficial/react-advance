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
      bg='var(--paper-raised, #ffffff)'
      border='1px solid var(--rule, #e5e7eb)'
      shadow='var(--shadow-sm)'
      textAlign='center'
      maxW='520px'
      mx='auto'
    >
      <VStack gap='4'>
        <Flex
          w='48px'
          h='48px'
          borderRadius='full'
          bg='#FBEAEA'
          color='#C43333'
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
            color='var(--ink, #161a23)'
          >
            Something went wrong
          </Heading>
          <Text fontSize='13.5px' color='var(--muted, #64748b)'>
            An unexpected error occurred while rendering this component.
          </Text>
        </VStack>

        {(error as Error)?.message && (
          <Box
            w='100%'
            p='3'
            bg='var(--rule-soft, #f8fafc)'
            borderRadius='8px'
            border='1px solid var(--rule, #e2e8f0)'
            textAlign='left'
            maxH='120px'
            overflowY='auto'
          >
            <Text
              fontFamily="'IBM Plex Mono', monospace"
              fontSize='11.5px'
              color='#C43333'
              whiteSpace='pre-wrap'
            >
              {(error as Error).message}
            </Text>
          </Box>
        )}

        <HStack gap='3' justify='center'>
          <Button
            size='sm'
            bg='var(--accent, #6366f1)'
            color='white'
            borderRadius='8px'
            fontSize='13px'
            fontWeight='600'
            px='4'
            py='2'
            _hover={{ opacity: 0.9 }}
            onClick={resetErrorBoundary}
          >
            <FiRefreshCw size={14} style={{ marginRight: '6px' }} />
            Try again
          </Button>
          <Button
            size='sm'
            variant='outline'
            borderColor='var(--rule, #e2e8f0)'
            color='var(--ink-soft, #334155)'
            borderRadius='8px'
            fontSize='13px'
            fontWeight='600'
            px='4'
            py='2'
            _hover={{ bg: 'var(--rule-soft, #f1f5f9)' }}
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
      bg='var(--paper-raised, #ffffff)'
      border='1px solid var(--rule, #e5e7eb)'
      shadow='var(--shadow-sm)'
      textAlign='center'
      maxW='600px'
      mx='auto'
    >
      <VStack gap='4'>
        <Flex
          w='52px'
          h='52px'
          borderRadius='full'
          bg='#FEF3C7'
          color='#D97706'
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
            color='var(--ink, #161a23)'
          >
            Failed to load posts listing
          </Heading>
          <Text fontSize='14px' color='var(--muted, #64748b)'>
            We ran into an issue while retrieving your articles workspace.
          </Text>
        </VStack>

        {(error as Error)?.message && (
          <Box
            w='100%'
            p='3'
            bg='var(--rule-soft, #f8fafc)'
            borderRadius='8px'
            border='1px solid var(--rule, #e2e8f0)'
            textAlign='left'
          >
            <Text
              fontFamily="'IBM Plex Mono', monospace"
              fontSize='11.5px'
              color='#B45309'
              whiteSpace='pre-wrap'
            >
              {(error as Error).message}
            </Text>
          </Box>
        )}

        <Button
          size='sm'
          bg='var(--accent, #6366f1)'
          color='white'
          borderRadius='8px'
          fontSize='13px'
          fontWeight='600'
          px='5'
          py='2.5'
          h='auto'
          _hover={{ opacity: 0.9 }}
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
      bg='var(--paper-raised, #ffffff)'
      border='1px solid var(--rule, #e5e7eb)'
      shadow='var(--shadow-sm)'
      textAlign='center'
      maxW='640px'
      mx='auto'
    >
      <VStack gap='4'>
        <Flex
          w='56px'
          h='56px'
          borderRadius='full'
          bg='#FBEAEA'
          color='#C43333'
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
            color='var(--ink, #161a23)'
          >
            Editor Encountered an Error
          </Heading>
          <Text fontSize='14px' color='var(--muted, #64748b)'>
            An unhandled exception occurred within the block editor workspace.
          </Text>
        </VStack>

        {(error as Error)?.message && (
          <Box
            w='100%'
            p='3.5'
            bg='var(--rule-soft, #f8fafc)'
            borderRadius='8px'
            border='1px solid var(--rule, #e2e8f0)'
            textAlign='left'
            maxH='140px'
            overflowY='auto'
          >
            <Text
              fontFamily="'IBM Plex Mono', monospace"
              fontSize='12px'
              color='#C43333'
              whiteSpace='pre-wrap'
            >
              {(error as Error).message}
            </Text>
          </Box>
        )}

        <HStack gap='3.5' justify='center'>
          <Button
            size='sm'
            bg='var(--accent, #6366f1)'
            color='white'
            borderRadius='8px'
            fontSize='13.5px'
            fontWeight='600'
            px='5'
            py='2.5'
            h='auto'
            _hover={{ opacity: 0.9 }}
            onClick={resetErrorBoundary}
          >
            <FiRefreshCw size={14} style={{ marginRight: '6px' }} />
            Retry Editor
          </Button>
          <Button
            size='sm'
            variant='outline'
            borderColor='var(--rule, #e2e8f0)'
            color='var(--ink-soft, #334155)'
            borderRadius='8px'
            fontSize='13.5px'
            fontWeight='600'
            px='5'
            py='2.5'
            h='auto'
            _hover={{ bg: 'var(--rule-soft, #f1f5f9)' }}
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
