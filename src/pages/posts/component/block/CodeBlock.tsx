import { Box, Flex, Textarea, IconButton, Input, Badge } from '@chakra-ui/react';
import { LuCode, LuCopy, LuCheck } from 'react-icons/lu';
import { useState, memo } from 'react';
import type { BaseBlockProps } from '../../../../types/posts/block';

export const CodeBlock = memo(function CodeBlock({
  block,
  onChange,
  isEditing = true,
}: BaseBlockProps) {
  const [copied, setCopied] = useState(false);
  const language = block.language || 'typescript';

  const handleCopy = () => {
    if (block.content) {
      navigator.clipboard.writeText(block.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box py='1'>
      <Box
        borderRadius='xl'
        overflow='hidden'
        bg='code.bg'
        color='text.inverse'
        borderWidth='1px'
        borderColor='code.border'
      >
        {/* Header bar */}
        <Flex justify='space-between' align='center' px='4' py='2' bg='code.header'>
          <Flex align='center' gap='2'>
            <Box color='accent.fg'>
              <LuCode />
            </Box>
            {isEditing ? (
              <Input
                size='xs'
                w='110px'
                value={language}
                onChange={(e) => onChange?.({ ...block, language: e.target.value })}
                placeholder='Language'
                aria-label='Code language'
                bg='code.input'
                borderColor='code.border'
                color='text.inverse'
              />
            ) : (
              <Badge size='sm' variant='solid' colorPalette='purple'>
                {language}
              </Badge>
            )}
          </Flex>

          <IconButton
            aria-label='Copy code to clipboard'
            size='xs'
            variant='ghost'
            color='text.muted'
            _hover={{ color: 'text.inverse', bg: 'code.input' }}
            onClick={handleCopy}
          >
            {copied ? (
              <Box color='status.published.fg'>
                <LuCheck />
              </Box>
            ) : (
              <LuCopy />
            )}
          </IconButton>
        </Flex>

        {/* Code Content */}
        <Box p='4'>
          {isEditing ? (
            <Textarea
              value={block.content || ''}
              onChange={(e) => onChange?.({ ...block, content: e.target.value })}
              placeholder='Paste or write code here...'
              aria-label='Code snippet content'
              fontFamily='monospace'
              fontSize='sm'
              bg='code.bg'
              color='accent.fg'
              borderColor='code.border'
              _focus={{ borderColor: 'accent.solid' }}
              minH='100px'
            />
          ) : (
            <Box
              as='pre'
              fontFamily='monospace'
              fontSize='sm'
              color='accent.fg'
              overflowX='auto'
              whiteSpace='pre-wrap'
            >
              <code>{block.content || '// Code snippet goes here'}</code>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
});

export default CodeBlock;
