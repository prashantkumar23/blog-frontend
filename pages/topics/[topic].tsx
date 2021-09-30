import { Typography, Divider, Grid } from "@mui/material";
import { useInfiniteQuery } from "react-query";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroller";

import { CardOne } from "../../components/Cards/CardOne";
import getBlogsByTag from "../../graphql/queries/getBlogsByTag";
import { AppLayout } from "../../layout";
import { GetBlogsByTagResponse } from "../../types";
import { TOPICS } from "../../utils/topics";

const pageNumber = 0;
const nPerPage = 4;

export default function TopicPostPage() {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage } =
    useInfiniteQuery<GetBlogsByTagResponse>(
      ["topics", router.query.topic],
      ({ pageParam = { pageNumber, nPerPage } }) =>
        getBlogsByTag(router.query.topic as string, pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.next || undefined,
        staleTime: Infinity,
        enabled: router.query.topic ? true : false,
      }
    );

  if (data) {
    return (
      <AppLayout>
        <div style={{ marginBottom: "3rem" }}>
          <Typography
            variant="h2"
            sx={{ textTransform: "capitalize", marginBottom: "2rem" }}
          >
            {router.query.topic} 🖖
            <Divider sx={{ marginTop: "1rem" }} />
          </Typography>
          <Typography gutterBottom>
            {
              TOPICS.find((topic) => topic.topicName === router.query.topic)
                ?.topicDescription
            }
          </Typography>
        </div>
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
                        tags={tags as string[]}
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
      </AppLayout>
    );
  }
  return null;
}

// export async function getServerSideProps(context: any) {
//   const { query } = context;
//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery(query.topic, () =>
//     getBlogsByTag(query.topic)
//   );

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//       topic: query.topic,
//     },
//   };
// }
