import {
  Box,
  Button,
  Heading,
  Input,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { toaster } from './components/ui/toaster';
import Child from './components/Chid';
import FilterUser from './components/ui/FilterUser';

function Index() {
  console.log('parent');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isloadingPost, setIsLoadingPost] = useState(false);
  const [singlePost, setSinglePost] = useState(null);
  const [errorPost, setErrorPost] = useState('');

  const [postId, setPostId] = useState(1);

  useEffect(() => {
    async function getOnePost(postId: number) {
      try {
        setIsLoadingPost(true);
        setErrorPost('');
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${postId}`,
        );
        if (!response.ok) {
          throw new Error('API Not Found');
        }
        const json = await response.json();
        setSinglePost(json);
      } catch (error) {
        setErrorPost('Error in Fetching a Single Post');
        throw error;
      } finally {
        setIsLoadingPost(false);
      }
    }

    getOnePost(postId);
  }, [postId]);

  async function handleSave() {
    try {
      setSubmitted(true);
      await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          name,
          title: 'foo',
          body: 'bar',
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    } catch (error) {
      console.error(error);
      toaster.create({
        description: 'File saved successfully',
        type: 'info',
      });
    } finally {
      setSubmitted(false);
    }
  }

  const handleClick = useCallback(() => {
    setPostId((prev) => prev + 1); // Updating the state will cause the Child component to re-render
  }, []);

  return (
    // Avoid DOM Elements use Fragment
    <>
      <SimpleGrid columns={2} textAlign='left' gap={5} alignItems='center'>
        <VStack gap='4' alignItems='left'>
          <Heading>Parent Component</Heading>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='name'
          />
          <Text>hello {name}</Text>
          {/* <Text>Count {count}</Text> */}
          {/* without loader api call */}
          <Button
            onClick={handleSave}
            disabled={submitted}
            _disabled={{ cursor: 'default' }}
          >
            save
          </Button>
        </VStack>
        <Box>
          <Heading>React.memo</Heading>
          {/* Child Component */}
          <Child
            onClick={handleClick}
            postId={postId}
            isloadingPost={isloadingPost}
          />
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={1} textAlign='left' mt={5}>
        <Heading>Single Post Title</Heading>
        {errorPost && <Text>{errorPost}</Text>}
        {isloadingPost ? (
          <Skeleton height='80px' />
        ) : (
          singlePost && (
            <Text>
              {postId}. {singlePost.title}
            </Text>
          )
        )}
      </SimpleGrid>
      <FilterUser />
    </>
  );
}

export default Index;
