import { Box, Text } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";

function BlogView() {
    const { postId } = useParams({ from: '/app/posts/_blogLayout/$postId' })
    return (
        <Box p="6" bg="gray.50" borderRadius="md" border="1px dashed" borderColor="gray.300">
            <Text fontSize="xl" color="gray.700">Currently editing post:</Text>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600" mt="2">{postId}</Text>
        </Box>
    )
}

export default BlogView