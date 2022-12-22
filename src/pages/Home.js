import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import React, { useEffect } from "react";
import {
  Button,
  Center,
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
import { deletePost, fetchInfinityPosts, fetchPosts } from "../api";

const Home = () => {
  const cache = useQueryClient();
  const toast = useToast();
  // const { data, isLoading } = useQuery(
  //   ["posts"],
  //   () => fetchPosts(),
  //   {
  //     keepPreviousData: true,
  //     onError: (error) => {
  //       toast({ status: "error", title: error.message });
  //     },
  //   }
  // );

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ["posts"],
      ({ pageParam = 1 }) => fetchInfinityPosts(pageParam),
      {
        getNextPageParam: (lastPage, pages) => {
          if (lastPage.meta.pagination.page < lastPage.meta.pagination.pages)
            return lastPage.meta.pagination.page + 1;
          return false;
        },
      }
    );

  useEffect(() => {
    let fetching = false;
    const handleScroll = async (event) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target.scrollingElement;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true;
        if (hasNextPage) await fetchNextPage();
        fetching = false;
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage]);

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

          {/* {data.data.map((post) => (
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
                    <Text>UserId: {post.user_id}</Text>
                    <Text>PostId: {post.id}</Text>
                  </Flex>
                  <Heading fontSize="2xl">{post.title}</Heading>
                  <Text>{post.body}</Text>
                </Stack>
              </Link>
            </Stack>
          ))} */}

          {data.pages.map((page) =>
            page.data.map((post) => (
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
                      <Text>UserId: {post.user_id}</Text>
                      <Text>PostId: {post.id}</Text>
                    </Flex>
                    <Heading fontSize="2xl">{post.title}</Heading>
                    <Text>{post.body}</Text>
                  </Stack>
                </Link>
              </Stack>
            ))
          )}

          <Center mb="20px">
            {isFetching && "Loading..."}
            {/* {hasNextPage && (
              <Button
                isLoading={isFetching}
                loadingText="Loading.."
                colorScheme="teal"
                variant="outline"
                spinnerPlacement="start"
                onClick={fetchNextPage}
              >
                Load More
              </Button>
            )} */}
          </Center>
        </>
      )}
    </Container>
  );
};

export default Home;
