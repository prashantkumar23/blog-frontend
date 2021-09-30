import { useEffect, useState } from "react";
import {
  Stack,
  Chip,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import { GraphQLClient } from "graphql-request";
import { useInfiniteQuery, useQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroller";
// import { dehydrate } from "react-query/hydration";
import { CardOne } from "../components/Cards/CardOne";
import getBlogs from "../graphql/queries/getBlogs";
import getTopTagsByNumberOfPosts from "../graphql/queries/getTopTagsNumberByPost";
import { AppLayout } from "../layout";
import {
  GetBlogsResponse,
  GetTopBlogsByTopicResponse,
  GetTopTagsByNumberOfPostResponse,
} from "../types";
import FolderList from "../components/TopWriters";
import { TOPICS } from "../utils/topics";
import getTopBlogsByTopic from "../graphql/queries/getTopBlogsByTopic";

const endpoint = "https://blog-backend-graphql.herokuapp.com/api";

export const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer token`,
  },
});

const pageNumber = 0;
const nPerPage = 2;

export default function HomePage() {
  const theme = useTheme();
  const [topic, setTopic] = useState("");
  const matches = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)].topicName;
    setTopic(topic);
  }, []);

  const { data, fetchNextPage, hasNextPage } =
    useInfiniteQuery<GetBlogsResponse>(
      "blogs",
      ({ pageParam = { pageNumber, nPerPage } }) => getBlogs(pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.next || undefined,
        staleTime: 3 * 1000 * 1000,
      }
    );

  const { data: topBlogs } = useQuery<GetTopBlogsByTopicResponse>(
    ["topBlogsByTopic", topic],
    () => getTopBlogsByTopic({ topic }),
    {
      staleTime: 1000,
      enabled: topic.length > 1 ? true : false,
    }
  );

  const { data: topTags } = useQuery<GetTopTagsByNumberOfPostResponse[]>(
    "topTagByNumberOfPosts",
    getTopTagsByNumberOfPosts,
    {
      staleTime: Infinity,
    }
  );

  if (data && topTags) {
    return (
      <AppLayout>
        <Stack rowGap={2} sx={{}}>
          {/* <CategoryList topTags={topTags} /> */}
          <Stack
            justifyContent="space-between"
            columnGap={10}
            flexDirection="row"
          >
            {/* Render all blogs */}
            <Stack
              flexDirection="column"
              rowGap={2}
              sx={{ marginBottom: "3rem" }}
            >
              <Typography variant="h4">{`Top Blogs in "${topic}" 🙌`}</Typography>
              {topBlogs &&
                topBlogs?.blogs?.map(
                  ({ _id, title, createdAt, user, tags, blogImageUrl }) => {
                    return (
                      <Grid item xs={12} sm={12} key={_id} md={6}>
                        <CardOne
                          blogId={_id}
                          blogTitle={title}
                          tags={tags}
                          blogImageUrl={blogImageUrl!}
                          createdAt={createdAt}
                          userId={user!._id}
                          name={user!.name}
                          image={user!.image}
                        />
                      </Grid>
                    );
                  }
                )}
            </Stack>

            <Stack
              flexDirection="column"
              rowGap={3}
              sx={{
                width: "30rem",
                [theme.breakpoints.between("xs", "md")]: {
                  display: "none",
                },
              }}
            >
              <Typography variant="h4">Top topics for you 👐</Typography>
              <Stack>
                <Grid container>
                  {topTags.map((tag) => {
                    const color = TOPICS.find(
                      (topic) => topic.topicName === tag.tag
                    )?.topicColorCode;
                    return (
                      <Grid item lg={4} md={12} key={tag.tag}>
                        <Link href={`/topics/${tag.tag}`} passHref>
                          <Chip
                            label={tag.tag}
                            clickable
                            sx={{
                              marginTop: "0.5rem",
                              marginBottom: "0.5rem",
                              backgroundColor: color
                                ? color
                                : "background.default",
                            }}
                          />
                        </Link>
                      </Grid>
                    );
                  })}
                </Grid>
              </Stack>
              <div>
                <FolderList />
              </div>
            </Stack>
          </Stack>
        </Stack>

        {/* Mobile view of Top Topics */}
        {matches ? null : (
          <div
            style={{
              marginBottom: "1rem",
              marginTop: "2rem",
            }}
          >
            <Typography variant="h6">Top topics for you 👐</Typography>
            <div
              style={{
                overflow: "scroll",
                width: "100%",
              }}
            >
              <div style={{ padding: "1rem" }}>
                <Stack flexDirection="row" columnGap={2} rowGap={2}>
                  {topTags.map((tag) => {
                    const color = TOPICS.find(
                      (topic) => topic.topicName === tag.tag
                    )?.topicColorCode;
                    return (
                      <Link href={`/topics/${tag.tag}`} passHref key={tag.tag}>
                        <Chip
                          label={tag.tag}
                          clickable
                          sx={{
                            marginTop: "0.5rem",
                            marginBottom: "0.5rem",
                            backgroundColor: color
                              ? color
                              : "background.default",
                          }}
                        />
                      </Link>
                    );
                  })}
                </Stack>
              </div>
            </div>
          </div>
        )}

        {/* Mobile view of Top Topics */}
        {matches ? null : (
          <div
            style={{
              overflow: "scroll",
              width: "100%",
              marginBottom: "3rem",
            }}
          >
            <FolderList />
          </div>
        )}

        {/* More Blogs */}
        <Stack flexDirection="column">
          <Typography variant="h3" sx={{ marginBottom: "2rem" }}>
            More Blogs 🥰
          </Typography>

          <InfiniteScroll
            //@ts-ignore
            loadMore={fetchNextPage}
            hasMore={hasNextPage}
          >
            <Grid
              container
              flexDirection="row"
              sx={{ padding: "1rem" }}
              justifyContent="space-between"
              spacing={2}
              rowGap={2}
            >
              {data &&
                data.pages.map((pageData) => {
                  return pageData.blogs?.map(
                    ({ _id, title, tags, blogImageUrl, createdAt, user }) => {
                      return (
                        <CardOne
                          key={_id}
                          blogId={_id}
                          blogTitle={title}
                          tags={tags}
                          blogImageUrl={blogImageUrl!}
                          createdAt={createdAt}
                          userId={user!._id}
                          name={user!.name}
                          image={user!.image}
                        />
                      );
                    }
                  );
                })}
            </Grid>
          </InfiniteScroll>
        </Stack>
      </AppLayout>
    );
  }

  return null;
}

// export const getServerSideProps = async () => {
//   const queryClient = new QueryClient();
//   const pageNumber = 0;
//   const nPerPage = 2;

//   await queryClient.prefetchQuery(
//     "blogs",
//     () => getBlogs({ pageNumber, nPerPage }),
//     {
//       staleTime: Infinity,
//     }
//   );

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// };
