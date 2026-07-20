import { SimpleGrid, Text } from '@chakra-ui/react';
import PostCard from './PostCard';
import { mockPosts } from '../../../constant/PostsConfigProps';
import { useEffect, useState } from 'react';

function BlogPost() {
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingPosts(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (mockPosts?.length === 0) {
    return <div>No posts found</div>;
  }

  function renderPosts() {
    return (
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={2}>
        {isLoadingPosts && <Text>Loading Posts...</Text>}
        {!isLoadingPosts &&
          (mockPosts.length > 0 ? (
            mockPosts?.map((post, key) => {
              return <PostCard key={`post-${key + 1}`} post={post} />;
            })
          ) : (
            <Text>No Posts Found</Text>
          ))}
      </SimpleGrid>
    );
  }
  return <>{renderPosts()}</>;
}
export default BlogPost;
