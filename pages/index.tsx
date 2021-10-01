import {
  Stack,
  Chip,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";
import {
  useInfiniteQuery,
  QueryClient,
  dehydrate,
  DehydratedState,
} from "react-query";
import InfiniteScroll from "react-infinite-scroller";
import { CardOne } from "../components/Cards/CardOne";
import getBlogs from "../graphql/queries/getBlogs";
import getTopTagsByNumberOfPosts from "../graphql/queries/getTopTagsNumberByPost";
import { AppLayout } from "../layout";
import { GetBlogsResponse } from "../types";
import { TopWriters } from "../components/TopWriters";
import { TOPICS } from "../utils/topics";
import getTopBlogsByTopic from "../graphql/queries/getTopBlogsByTopic";
import getListOfUsers from "../graphql/queries/user/getListOfUsers";

const pageNumber = 1;
const nPerPage = 4;

export default function HomePage({
  dehydratedState,
  topic,
}: {
  dehydratedState: DehydratedState;
  topic: string;
}) {
  const theme = useTheme();
  const matches = useMediaQuery("(min-width:600px)");
  const topTopics: any = dehydratedState.queries[0].state.data;
  const topBlogs: any = dehydratedState.queries[1].state.data;
  const listOfUsers: any = dehydratedState.queries[2].state.data;

  const { data, fetchNextPage, hasNextPage } =
    useInfiniteQuery<GetBlogsResponse>(
      "blogs",
      ({ pageParam = { pageNumber, nPerPage } }) => getBlogs(pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.next || undefined,
        staleTime: 3 * 1000 * 1000,
      }
    );

  if (data) {
    return (
      <AppLayout>
        <Stack rowGap={2}>
          <Stack
            justifyContent="space-between"
            columnGap={10}
            flexDirection="row"
          >
            {/* Render Specific Topic blogs */}
            <Stack flexDirection="column">
              <Grid
                container
                flexDirection="column"
                sx={{ padding: "1rem" }}
                justifyContent="space-between"
                spacing={2}
                rowGap={2}
              >
                <Typography variant="h4">{`Top Blogs in "${topic}" 🙌`}</Typography>
                {topBlogs &&
                  topBlogs?.blogs?.map(
                    ({
                      _id,
                      title,
                      createdAt,
                      user,
                      tags,
                      blogImageUrl,
                    }: any) => {
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
                  )}
              </Grid>
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
                  {topTopics!.map((t: { tag: string }) => {
                    const color = TOPICS.find(
                      (topic) => topic.topicName === t.tag
                    )?.topicColorCode;
                    return (
                      <Grid item lg={4} md={12} key={t.tag}>
                        <Link href={`/topics/${t.tag}`} passHref>
                          <Chip
                            label={t.tag}
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
                <TopWriters listOfUsers={listOfUsers} />
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
                  {topTopics.map((t: { tag: string }) => {
                    const color = TOPICS.find(
                      (topic) => topic.topicName === t.tag
                    )?.topicColorCode;
                    return (
                      <Link href={`/topics/${t.tag}`} passHref key={t.tag}>
                        <Chip
                          label={t.tag}
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
            <TopWriters listOfUsers={listOfUsers} />
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

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)].topicName;

  await queryClient.fetchQuery(
    "topTagByNumberOfPosts",
    getTopTagsByNumberOfPosts,
    {
      cacheTime: 100000,
    }
  );

  await queryClient.prefetchQuery(
    ["topBlogsByTopic", topic],
    () => getTopBlogsByTopic({ topic }),
    {
      cacheTime: 100000,
    }
  );

  await queryClient.prefetchQuery("listOfUsers", getListOfUsers, {
    cacheTime: 100000,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient, { dehydrateMutations: false }),
      topic,
    },
  };
};
