import { gql } from "graphql-request";
import { DeleteCommentResponse, DeleteCommentInput } from "../../../types";
import { client } from "../../../pages/_app";

const deleteComment = async (
  { blogId, commentId }: DeleteCommentInput
): Promise<DeleteCommentResponse> => {
  const query = gql`
mutation DeleteCommentMutation($deleteCommentUpdateCommentInput: DeleteCommentInput!) {
  deleteComment(updateCommentInput: $deleteCommentUpdateCommentInput) {
    status
    message
  }
}
  `

  const variables = {
    deleteCommentUpdateCommentInput: {
      blogId,
      commentId
    }
  }

  const response = await client.request(query, variables);
  return response.deleteComment;
};

export default deleteComment;
