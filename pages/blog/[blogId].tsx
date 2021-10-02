import { useState } from "react";
import {
  Stack,
  Typography,
  Avatar,
  Chip,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Container,
  AlertColor,
} from "@mui/material";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { NextPageContext } from "next";
import ReactHtmlParser from "react-html-parser";
import Image from "next/image";
import Link from "next/link";
import { dehydrate } from "react-query/hydration";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";

import { useSession } from "../../next-react-query";
import Notification from "../../components/Notification";
import getBlog from "../../graphql/queries/getBlog";
import getCommentsOfBlog from "../../graphql/queries/getCommentsOfBlog";
import { GetBlogResponse } from "../../types";
import { AppLayout } from "../../layout";
import addComment from "../../graphql/mutations/comment/addComment";
import deleteComment from "../../graphql/mutations/comment/deleteComment";
import updateComment from "../../graphql/mutations/comment/updateComment";
import React from "react";
import { TOPICS } from "../../utils/topics";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Comments = {
  blogComments: {
    _id: string;
    comments: {
      _id: string;
      comment: string;
      createdAt: string;
      user: {
        _id: string;
        image: string;
        name: string;
      };
    }[];
  };
};

export default function BlogPage(props: any) {
  const data: GetBlogResponse = props.dehydratedState.queries[0].state.data;
  const { _id, title, body, tags, user, blogImageUrl } = data.blog!;
  const [updateCommentSettings, setUpdateCommentSettings] = useState({
    enable: false,
    whichCommentToUpdate: "",
  });
  const [notify, setNotify] = useState<{
    isOpen: boolean;
    message: string;
    type: AlertColor | undefined;
  }>({
    isOpen: false,
    message: "",
    type: undefined,
  });
  const [commentToUpdate, setCommentToUpdate] = useState("");
  const queryClient = useQueryClient();

  const [fetchComments, setFetchComments] = useState(false);
  const [comment, setComment] = useState("");
  const [session, loading] = useSession();

  const { data: CommentsData } = useQuery(
    "comments",
    () => getCommentsOfBlog({ blogId: _id }),
    {
      enabled: fetchComments,
      staleTime: Infinity,
    }
  );

  const addCommentMutation = useMutation(addComment, {
    onMutate: async (newComment) => {
      setComment("");

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries("comments");

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<Comments>("comments");

      // Optimistically update to the new value
      if (previousComments) {
        queryClient.setQueryData<Comments>("comments", {
          ...previousComments.blogComments.comments,
          //@ts-ignore
          blogComments: [
            ...previousComments.blogComments.comments,
            { comment: newComment },
          ],
        });
      }

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_, __, context: any) => {
      if (context?.previousComments) {
        queryClient.setQueryData<Comments>(
          "comments",
          context.previousComments
        );
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries("comments");
    },
    onSuccess: () => {
      setNotify({
        isOpen: true,
        message: "Comment added!",
        type: "success",
      });
    },
  });

  const updateCommentMutation = useMutation(updateComment, {
    onMutate: async (commentToUpdate) => {
      setComment("");

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries("comments");

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<Comments>("comments");

      // Optimistically update to the new value
      if (previousComments) {
        queryClient.setQueryData<Comments>("comments", {
          ...previousComments.blogComments.comments,
          //@ts-ignore
          blogComments: previousComments.blogComments.comments.map((c) => {
            let returnComment = { ...c };

            if (c._id === commentToUpdate.commentId) {
              returnComment.comment = commentToUpdate.commentBody;
            }

            return returnComment;
          }),
        });
      }

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_, __, context: any) => {
      if (context?.previousComments) {
        queryClient.setQueryData<Comments>(
          "comments",
          context.previousComments
        );
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries("comments");
    },
    onSuccess: () => {
      setUpdateCommentSettings((prevState) => {
        return {
          enable: !prevState.enable,
          whichCommentToUpdate: "",
        };
      });
      setNotify({
        isOpen: true,
        message: "Comment updated!",
        type: "success",
      });
    },
  });

  const deleteCommentMutation = useMutation(deleteComment, {
    onMutate: async (commentToDelete) => {
      setComment("");

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries("comments");

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<Comments>("comments");

      // Optimistically update to the new value
      if (previousComments) {
        queryClient.setQueryData<Comments>("comments", {
          ...previousComments.blogComments.comments,
          //@ts-ignore
          blogComments: previousComments.blogComments.comments.filter(
            (c) => c._id !== commentToDelete.commentId
          ),
        });
      }

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_, __, context: any) => {
      if (context?.previousComments) {
        queryClient.setQueryData<Comments>(
          "comments",
          context.previousComments
        );
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries("comments");
    },
    onSuccess: () => {
      setNotify({
        isOpen: true,
        message: "Comment deleted!",
        type: "success",
      });
    },
  });

  const handleDeleteComment = (blogId: string, commentId: string) => {
    return deleteCommentMutation.mutate({
      blogId,
      commentId,
    });
  };

  const handleAddComment = (
    userId: string,
    blogId: string,
    commentBody: string
  ) => {
    //@ts-ignore
    addCommentMutation.mutate({ userId, blogId, commentBody });
  };

  const handleUpdateComment = (commentId: string, commentBody: string) => {
    return updateCommentMutation.mutate({ commentId, commentBody });
  };

  if (typeof window !== "undefined") {
    window.onscroll = function () {
      const totalPageHeight = document.body.scrollHeight;
      const scrollPoint = window.scrollY + window.innerHeight;
      if (scrollPoint >= totalPageHeight / 1.1) {
        setFetchComments(true);
      }
    };
  }

  return (
    <AppLayout>
      <Stack flexDirection="column" alignItems="center" rowGap={2}>
        <Notification notify={notify} setNotify={setNotify} />
        <Container maxWidth="md">
          {/* ***************Title of the BLOG********************** */}
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              marginTop: "1rem",
              overflowWrap: "break-word",
            }}
          >
            {title}
          </Typography>

          {/* ***************Cover Image of the BLOG********************** */}
          <div
            style={{
              borderRadius: "0.5rem",
              overflow: "hidden",
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
          >
            <Image
              src={blogImageUrl}
              layout="responsive"
              alt=""
              width="100%"
              height="50%"
              // sizes="100vw"
              priority={true}
            />
          </div>

          {/* ***************Topics of the BLOG********************** */}
          <Stack
            flexDirection="row"
            columnGap={2}
            sx={{ marginBottom: "1rem", marginTop: "1rem" }}
          >
            {tags!.map((tag: string, index) => {
              const topic = tag;
              const color = TOPICS.find(
                (topic) => topic.topicName === tag
              )?.topicColorCode;
              return (
                <Link href={`/topics/${topic}`} passHref key={index}>
                  <Chip
                    key={index}
                    label={tag}
                    clickable
                    sx={{
                      backgroundColor: color ? color : "Background.default",
                    }}
                  />
                </Link>
              );
            })}
          </Stack>

          {/* ***************Author of the BLOG********************** */}
          <Stack
            flexDirection="row"
            alignItems="center"
            columnGap={1}
            justifyContent="flex-start"
            sx={{
              width: "100%",
              margin: "2rem 0",
            }}
          >
            <Avatar>
              <Image src={user.image} layout="fill" />
            </Avatar>
            <Link href={`/${user.name}`}>
              <Typography sx={{ cursor: "pointer" }}>{user.name}</Typography>
            </Link>
          </Stack>

          {/* ***************BODY of the BLOG********************** */}
          <Container style={{ marginBottom: "3rem" }} maxWidth="md">
            <div style={{ overflowWrap: "break-word" }}>
              {ReactHtmlParser(body, {
                transform: (node) => {
                  if (node.name === "img") {
                    const s = node.attribs.src.slice(
                      1,
                      node.attribs.src.length - 1
                    );
                    return (
                      <img
                        src={s}
                        key={s}
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                        }}
                      />
                    );
                  }
                },
              })}
            </div>
          </Container>

          {/* ***************Add Comment to the BLOG********************** */}
          {!loading && !session && (
            <Typography
              variant="h5"
              sx={{ textAlign: "center", color: "#aaa" }}
            >
              Please login to add comment
            </Typography>
          )}
          {session && (
            <TextField
              placeholder="Any thoughts??"
              value={comment}
              size="small"
              sx={{
                width: { xs: "100%", sm: "50%" },
                marginBottom: "2rem",
                marginTop: "2rem",
              }}
              disabled={addCommentMutation.isLoading}
              onChange={(e) => setComment(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    disabled={comment.length === 0}
                    onClick={() =>
                      handleAddComment(session!.user!.id, _id, comment)
                    }
                  >
                    <AddTaskIcon />
                  </IconButton>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <Avatar sx={{ width: 20, height: 20 }}>
                      <Image src={user.image} layout="fill" />
                    </Avatar>
                  </InputAdornment>
                ),
                style: {
                  borderRadius: "0.8rem",
                },
              }}
            />
          )}
        </Container>

        {/* ***************Render Existing Comments of the BLOG********************** */}
        <Container maxWidth="md">
          <Stack flexDirection="column" rowGap={2}>
            {CommentsData &&
              CommentsData.blogComments?.comments?.map((comment) => {
                return (
                  <Paper
                    key={comment._id}
                    elevation={0}
                    sx={{
                      p: "0.25rem",
                      width: "100%",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <Stack
                      flexDirection="row"
                      alignItems="flex-start"
                      columnGap={2}
                    >
                      <Avatar sx={{ width: 40, height: 40 }}>
                        <Image src={comment.user.image} layout="fill" />
                      </Avatar>
                      <Stack sx={{ width: "100%" }}>
                        <Stack
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Stack flexDirection="column">
                            <Link href="/" passHref>
                              <Typography sx={{ cursor: "pointer" }}>
                                {comment.user.name}
                              </Typography>
                            </Link>
                            <Typography variant="caption">
                              {`${new Date(comment.createdAt).getDate()} ${
                                months[new Date(comment.createdAt).getMonth()]
                              }`}
                            </Typography>
                          </Stack>

                          <div>
                            {user._id === comment.user._id && (
                              <IconButton
                                onClick={() => {
                                  setCommentToUpdate(comment.comment);
                                  setUpdateCommentSettings((prevState) => {
                                    return {
                                      enable: !prevState.enable,
                                      whichCommentToUpdate: comment._id,
                                    };
                                  });
                                }}
                              >
                                {updateCommentSettings.enable &&
                                comment._id ===
                                  updateCommentSettings.whichCommentToUpdate ? undefined : (
                                  <ChangeCircleIcon
                                    sx={{ width: 20, height: 20 }}
                                  />
                                )}
                              </IconButton>
                            )}

                            {user._id === comment.user._id && (
                              <IconButton
                                onClick={() =>
                                  handleDeleteComment(_id, comment._id)
                                }
                              >
                                <HighlightOffIcon
                                  sx={{ width: 20, height: 20 }}
                                />
                              </IconButton>
                            )}
                          </div>
                        </Stack>

                        {updateCommentSettings.enable &&
                        comment._id ===
                          updateCommentSettings.whichCommentToUpdate ? (
                          <Stack flexDirection="row">
                            <TextField
                              value={commentToUpdate}
                              onChange={(e) =>
                                setCommentToUpdate(e.target.value)
                              }
                              fullWidth
                              multiline
                              size="small"
                              InputProps={{
                                style: {
                                  borderRadius: "0.8rem",
                                },
                                endAdornment: (
                                  <Stack flexDirection="row">
                                    <IconButton
                                      onClick={() => {
                                        setUpdateCommentSettings(
                                          (prevState) => {
                                            return {
                                              enable: !prevState.enable,
                                              whichCommentToUpdate: comment._id,
                                            };
                                          }
                                        );
                                      }}
                                    >
                                      <ClearIcon
                                        sx={{ width: 20, height: 20 }}
                                      />
                                    </IconButton>
                                    <IconButton
                                      onClick={() =>
                                        handleUpdateComment(
                                          comment._id,
                                          commentToUpdate
                                        )
                                      }
                                    >
                                      <DoneIcon />
                                    </IconButton>
                                  </Stack>
                                ),
                              }}
                            />
                          </Stack>
                        ) : (
                          <Typography variant="body2">
                            {comment.comment}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
          </Stack>
        </Container>
      </Stack>
    </AppLayout>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["blog", query.blogId], () =>
    getBlog(query.blogId as string)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

// Memozied Comments for future....

// const RenderComments = React.memo(function RenderComments({
//   blog,
//   CommentsData,
//   setComment,
// }: any) {
//   const [updateCommentSettings, setUpdateCommentSettings] = useState({
//     enable: false,
//     whichCommentToUpdate: "",
//   });
//   const [commentToUpdate, setCommentToUpdate] = useState("");
//   // const [comment, setComment] = useState("");
//   const queryClient = useQueryClient();

//   const updateCommentMutation = useMutation(updateComment, {
//     onMutate: async (commentToUpdate) => {
//       setComment("");

//       // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
//       await queryClient.cancelQueries("comments");

//       // Snapshot the previous value
//       const previousComments = queryClient.getQueryData<Comments>("comments");

//       // Optimistically update to the new value
//       if (previousComments) {
//         queryClient.setQueryData<Comments>("comments", {
//           ...previousComments.blogComments.comments,
//           //@ts-ignore
//           blogComments: previousComments.blogComments.comments.map((c) => {
//             let returnComment = { ...c };

//             if (c._id === commentToUpdate.commentId) {
//               returnComment.comment = commentToUpdate.commentBody;
//             }

//             return returnComment;
//           }),
//         });
//       }

//       // Return a context object with the snapshotted value
//       return { previousComments };
//     },
//     // If the mutation fails, use the context returned from onMutate to roll back
//     onError: (_, __, context: any) => {
//       if (context?.previousComments) {
//         queryClient.setQueryData<Comments>(
//           "comments",
//           context.previousComments
//         );
//       }
//     },
//     // Always refetch after error or success:
//     onSettled: () => {
//       queryClient.invalidateQueries("comments");
//     },
//     onSuccess: () => {
//       setUpdateCommentSettings((prevState) => {
//         return {
//           enable: !prevState.enable,
//           whichCommentToUpdate: "",
//         };
//       });
//     },
//   });

//   const deleteCommentMutation = useMutation(deleteComment, {
//     onMutate: async (commentToDelete) => {
//       setComment("");

//       // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
//       await queryClient.cancelQueries("comments");

//       // Snapshot the previous value
//       const previousComments = queryClient.getQueryData<Comments>("comments");

//       // Optimistically update to the new value
//       if (previousComments) {
//         queryClient.setQueryData<Comments>("comments", {
//           ...previousComments.blogComments.comments,
//           //@ts-ignore
//           blogComments: previousComments.blogComments.comments.filter(
//             (c) => c._id !== commentToDelete.commentId
//           ),
//         });
//       }

//       // Return a context object with the snapshotted value
//       return { previousComments };
//     },
//     // If the mutation fails, use the context returned from onMutate to roll back
//     onError: (_, __, context: any) => {
//       if (context?.previousComments) {
//         queryClient.setQueryData<Comments>(
//           "comments",
//           context.previousComments
//         );
//       }
//     },
//     // Always refetch after error or success:
//     onSettled: () => {
//       queryClient.invalidateQueries("comments");
//     },
//   });

//   const handleDeleteComment = (blogId: string, commentId: string) => {
//     return deleteCommentMutation.mutate({
//       blogId,
//       commentId,
//     });
//   };

//   const handleUpdateComment = (commentId: string, commentBody: string) => {
//     return updateCommentMutation.mutate({ commentId, commentBody });
//   };

//   return (
//     <Stack flexDirection="column" rowGap={2}>
//       {CommentsData &&
//         CommentsData.blogComments.comments.map((comment: BlogComment) => {
//           return (
//             <Paper
//               key={comment._id}
//               elevation={0}
//               sx={{
//                 p: "0.25rem",
//                 width: "100%",
//                 borderRadius: "0.25rem",
//               }}
//             >
//               <Stack flexDirection="row" alignItems="flex-start" columnGap={2}>
//                 <Avatar sx={{ width: 40, height: 40 }}>
//                   <Image src={comment.user.image} layout="fill" />
//                 </Avatar>
//                 <Stack sx={{ width: "100%" }}>
//                   <Stack
//                     flexDirection="row"
//                     justifyContent="space-between"
//                     alignItems="flex-start"
//                   >
//                     <Stack flexDirection="column">
//                       <Link href="/" passHref>
//                         <Typography sx={{ cursor: "pointer" }}>
//                           {comment.user.name}
//                         </Typography>
//                       </Link>
//                       <Typography variant="caption">
//                         {`${new Date(comment.createdAt).getDate()} ${
//                           months[new Date(comment.createdAt).getMonth()]
//                         }`}
//                       </Typography>
//                     </Stack>

//                     <div>
//                       <IconButton
//                         onClick={() => {
//                           setCommentToUpdate(comment.comment);
//                           setUpdateCommentSettings((prevState) => {
//                             return {
//                               enable: !prevState.enable,
//                               whichCommentToUpdate: comment._id,
//                             };
//                           });
//                         }}
//                       >
//                         {updateCommentSettings.enable &&
//                         comment._id ===
//                           updateCommentSettings.whichCommentToUpdate ? undefined : (
//                           <ChangeCircleIcon sx={{ width: 20, height: 20 }} />
//                         )}
//                       </IconButton>
//                       <IconButton
//                         onClick={() =>
//                           handleDeleteComment(blog._id, comment._id)
//                         }
//                       >
//                         <HighlightOffIcon sx={{ width: 20, height: 20 }} />
//                       </IconButton>
//                     </div>
//                   </Stack>

//                   {updateCommentSettings.enable &&
//                   comment._id === updateCommentSettings.whichCommentToUpdate ? (
//                     <Stack flexDirection="row">
//                       <TextField
//                         value={commentToUpdate}
//                         onChange={(e) => setCommentToUpdate(e.target.value)}
//                         fullWidth
//                         multiline
//                         size="small"
//                         InputProps={{
//                           style: {
//                             borderRadius: "0.8rem",
//                           },
//                           endAdornment: (
//                             <Stack flexDirection="row">
//                               <IconButton
//                                 onClick={() => {
//                                   setUpdateCommentSettings((prevState) => {
//                                     return {
//                                       enable: !prevState.enable,
//                                       whichCommentToUpdate: comment._id,
//                                     };
//                                   });
//                                 }}
//                               >
//                                 <ClearIcon sx={{ width: 20, height: 20 }} />
//                               </IconButton>
//                               <IconButton
//                                 onClick={() =>
//                                   handleUpdateComment(
//                                     comment._id,
//                                     commentToUpdate
//                                   )
//                                 }
//                               >
//                                 <DoneIcon />
//                               </IconButton>
//                             </Stack>
//                           ),
//                         }}
//                       />
//                     </Stack>
//                   ) : (
//                     <Typography variant="body2">{comment.comment}</Typography>
//                   )}
//                 </Stack>
//               </Stack>
//             </Paper>
//           );
//         })}
//     </Stack>
//   );
// });
