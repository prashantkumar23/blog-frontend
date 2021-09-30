import { memo } from "react";
import { Grid, Container, Stack, Typography, Avatar } from "@mui/material";
import Image from "next/image";
import {
  dehydrate,
  DehydratedState,
  QueryClient,
  useInfiniteQuery,
} from "react-query";
import InfiniteScroll from "react-infinite-scroller";

import { AppLayout } from "../layout";
import getUserBlogsFromOtherUsers from "../graphql/queries/getUserBlogsFromOtherUsers";
import { CardOne } from "../components/Cards/CardOne";
import {
  GetUserBlogsFromOtherUsersResponse,
  GetUserInfoFromNameResponse,
} from "../types";
import getUserInfoFromName from "../graphql/queries/user/getUserInfoFromName";

const pageNumber = 1;
const nPerPage = 4;

const RenderBlogs = memo(function RenderBlogs({
  data,
  fetchNextPage,
  hasNextPage,
}: any) {
  return (
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
          data.pages.map((pageData: any) => {
            return pageData.blogs?.map(
              ({ id, title, tags, blogImageUrl, createdAt }: any) => {
                return (
                  <CardOne
                    key={id}
                    blogId={id}
                    blogTitle={title}
                    tags={tags}
                    blogImageUrl={blogImageUrl!}
                    createdAt={createdAt}
                  />
                );
              }
            );
          })}
      </Grid>
    </InfiniteScroll>
  );
});

export default function Profile({
  name,
  dehydratedState,
}: {
  name: string;
  dehydratedState: DehydratedState;
}) {
  //@ts-ignore
  const { user } = dehydratedState.queries[0].state.data;

  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteQuery<GetUserBlogsFromOtherUsersResponse>(
      ["userBlogsFromOtherUsers", name],
      ({ pageParam = { pageNumber, nPerPage } }) =>
        getUserBlogsFromOtherUsers({ name, ...pageParam }),
      {
        getNextPageParam: (lastPage) => lastPage.next || undefined,
        enabled: name ? true : false,
      }
    );

  return (
    <AppLayout>
      <Grid container direction="column" spacing={2} alignItems="center">
        <Grid item xs={12} sx={{ marginTop: "1rem" }}>
          <Stack
            direction="row"
            justifyContent="center"
            sx={{ position: "relative" }}
          >
            <Avatar
              sx={{
                width: "8rem",
                height: "8rem",
              }}
            >
              <Image layout="fill" src={user.image} />
            </Avatar>
          </Stack>
        </Grid>
        {/*  Name and Bio  */}
        <Grid item xs={12} sx={{ width: "100%" }}>
          <Typography variant="h5" sx={{ textAlign: "center" }} color="primary">
            {name}
          </Typography>
        </Grid>

        {/*  BIO  */}
        <Grid item xs={12} sx={{ width: "100%" }}>
          <Container maxWidth="sm">
            <Typography color="primary" sx={{ textAlign: "center" }}>
              {user.bio}
            </Typography>
          </Container>
        </Grid>

        {!isLoading && !data?.pages[0].blogs && (
          <Typography variant="h4" sx={{ color: "#aaa", marginTop: "3rem" }}>
            User haven't publish any blog yet
          </Typography>
        )}

        <RenderBlogs
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
      </Grid>
    </AppLayout>
  );
}

export async function getServerSideProps(context: any) {
  const { query } = context;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<GetUserInfoFromNameResponse>(
    ["userInformation", query.name],
    () => getUserInfoFromName({ name: query.name })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      name: query.name,
    },
  };
}
