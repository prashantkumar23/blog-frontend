import React, { useEffect, useState } from "react";
import {
  Grid,
  Container,
  Stack,
  Typography,
  Avatar,
  IconButton,
  TextField,
} from "@mui/material";
import Image from "next/image";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "react-query";
import InfiniteScroll from "react-infinite-scroller";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import { AppLayout } from "../../layout";
import { getSession, GetSessionOptions } from "next-auth/client";
import updateBio from "../../graphql/mutations/user/updateBio";
import getUserInfo from "../../graphql/queries/user/getUserInfo";
import getUserBlogs from "../../graphql/queries/user/getUserBlogs";
import { CardOne } from "../../components/Cards/CardOne";
import { GetUserBlogsResponse } from "../../types";

type UserInfo = {
  user: {
    bio: string;
  };
};

const pageNumber = 1;
const nPerPage = 4;

const RenderBlogs = React.memo(function RenderBlogs({
  data,
  fetchNextPage,
  hasNextPage,
}: any) {
  return (
    <Stack flexDirection="column" sx={{ padding: "2rem" }}>
      <InfiniteScroll
        //@ts-ignore
        loadMore={fetchNextPage}
        hasMore={hasNextPage}
      >
        <Grid
          container
          flexDirection="row"
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
    </Stack>
  );
});

export default function Profile({ session }: { session: any }) {
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState("");
  const queryClient = useQueryClient();

  const { data: UserInfo, isSuccess: isUserInfoSuccess } = useQuery(
    "userInfo",
    () => getUserInfo({ userId: session.user.id }),
    {
      enabled: session ? true : false,
    }
  );

  useEffect(() => {
    if (session && UserInfo) {
      setNewBio(UserInfo.user.bio);
    }
  }, [isUserInfoSuccess]);

  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteQuery<GetUserBlogsResponse>(
      "userBlogs",
      ({ pageParam = { pageNumber, nPerPage } }) =>
        getUserBlogs({ userId: session.user.id as string, ...pageParam }),
      {
        getNextPageParam: (lastPage) => lastPage.next || undefined,
        staleTime: Infinity,
        enabled: session ? true : false,
      }
    );

  const updateBioMutation = useMutation(updateBio, {
    onMutate: async (userInput) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries("comments");

      // Snapshot the previous value
      const userInfoOld = queryClient.getQueryData<UserInfo>("userInfo");

      // Optimistically update to the new value
      if (userInfoOld) {
        queryClient.setQueryData<UserInfo>("userInfo", {
          user: {
            ...userInfoOld.user,
            bio: userInput.bio,
          },
        });
      }

      // Return a context object with the snapshotted value
      return { userInfoOld };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_, __, context: any) => {
      if (context?.userInfoOld) {
        queryClient.setQueryData<UserInfo>("userInfo", context.userInfoOld);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries("userInfo");
    },
  });

  const handleUpdateBio = (userId: string, bio: string) => {
    return updateBioMutation.mutate({
      userId,
      bio,
    });
  };

  return (
    <AppLayout>
      <Grid
        container
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
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
              <Image layout="fill" src={session.user.image} />
            </Avatar>
            {editing ? (
              <IconButton
                sx={{
                  position: "absolute",
                  right: -40,
                }}
                onClick={() => setEditing((prevState: any) => !prevState)}
              >
                <CloseIcon sx={{ width: "1.3rem", height: "1.3rem" }} />
              </IconButton>
            ) : null}

            <IconButton
              sx={{
                position: "absolute",
                right: -70,
              }}
              onClick={() => {
                setEditing((prevState: any) => !prevState);
                if (newBio !== UserInfo.user.bio && editing === true) {
                  console.log(session.user.id, newBio);
                  handleUpdateBio(session.user.id, newBio);
                }
              }}
            >
              {editing ? (
                <CheckIcon
                  color="primary"
                  sx={{ width: "1.3rem", height: "1.3rem" }}
                />
              ) : (
                <EditIcon
                  color="primary"
                  sx={{ width: "1.3rem", height: "1.3rem" }}
                />
              )}
            </IconButton>
          </Stack>
        </Grid>
        {/*  Name and Username  */}
        <Grid item xs={12} sx={{ width: "100%" }}>
          <Typography variant="h5" sx={{ textAlign: "center" }} color="primary">
            {session.user.name}
          </Typography>
        </Grid>

        {/*  BIO  */}
        <Grid item xs={12} sx={{ width: "100%", marginBottom: "3rem" }}>
          <Container maxWidth="sm">
            {editing ? (
              <TextField
                multiline
                minRows={3}
                type="text"
                spellCheck="false"
                fullWidth
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                InputProps={{
                  style: {
                    borderRadius: "0.8rem",
                  },
                }}
              />
            ) : (
              <div>
                {UserInfo && UserInfo.user.bio.length === 0 && (
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "center", color: "#aaa" }}
                  >
                    Please add a bio by clicking edit button
                  </Typography>
                )}
                <Typography color="primary" sx={{ textAlign: "center" }}>
                  {UserInfo && UserInfo.user.bio}
                </Typography>
              </div>
            )}
          </Container>
        </Grid>

        {!isLoading && !data?.pages[0].blogs && (
          <Typography variant="h4" sx={{ color: "#aaa" }}>
            No blogs published yet
          </Typography>
        )}

        {!isLoading && data?.pages[0].blogs && (
          <RenderBlogs
            data={data}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        )}
      </Grid>
    </AppLayout>
  );
}

export async function getServerSideProps(
  context: GetSessionOptions | undefined
) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination:
          "/api/auth/signin?callbackUrl=http://localhost:3000/profile",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
