import { Button } from '@chakra-ui/react';
import React from 'react';

const TestChild = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log('child rendering');
  return (
    <>
      Child Component
      <Button onClick={onClick}>Child Click</Button>
    </>
  );
});

export default TestChild;
