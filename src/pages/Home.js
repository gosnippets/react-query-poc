import { useMutation, useQuery, useQueryClient } from "react-query";
import React from "react";
import {
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AddNewPost from "../components/AddNewPost";
import { deletePost, fetchPosts } from "../api";

const Home = () => {
  const cache = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery(
    ["posts"],
    () => fetchPosts(),
    {
      keepPreviousData: true,
      onError: (error) => {
        toast({ status: "error", title: error.message });
      },
    }
  );

  const { isLoading: isMutating, mutateAsync } = useMutation(
    "deletePost",
    deletePost,
    {
      onError: (error) => {
        toast({ status: "error", title: error.message });
      },
      onSuccess: () => {
        cache.invalidateQueries("posts");
      },
    }
  );

  return (
    <Container mt="4">
      {isLoading ? (
        <Grid placeItems="center" height="100vh">
          <Spinner />
        </Grid>
      ) : (
        <>
          <AddNewPost />

          {data.data.map((post) => (
            <Stack
              key={post.id}
              p="4"
              boxShadow="md"
              borderRadius="xl"
              border="1px solid #ccc"
              mb="4"
            >
              <Flex justify="flex-end">
                <Button
                  size="sm"
                  isLoading={isMutating}
                  onClick={async () => {
                    await mutateAsync({ id: post.id });
                  }}
                >
                  Delete
                </Button>
              </Flex>
              <Link to={`/post/${post.id}`}>
                <Stack>
                  <Flex justify="space-between">
                  <Heading fontSize="2xl">{post.title}</Heading>
                    <Text>PostId: {post.id}</Text>
                  </Flex>
                  
                  <Text>{post.body}</Text>
                </Stack>
              </Link>
            </Stack>
          ))}
        </>
      )}
    </Container>
  );
};

export default Home;
