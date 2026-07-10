import { Button, Text } from '@chakra-ui/react';
import React from 'react';

function Child({
  onClick,
  postId,
  isloadingPost,
}: {
  onClick: () => void;
  postId: number;
  isloadingPost: boolean;
}) {
  console.log('child');
  return (
    <>
      <Text>Child Component</Text>
      <Text>Get Single Post By Id - {postId}</Text>
      <Button
        onClick={onClick}
        disabled={isloadingPost}
        _disabled={{ cursor: 'default' }}
      >
        Post {postId} +
      </Button>
    </>
  );
}
export default React.memo(Child);
