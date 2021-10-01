import { gql } from "graphql-request";
import { UpdateCommentInput, UpdateCommentResponse } from "../../../types";
import { client } from "../../../pages/_app";

const updateComment = async (
  { commentId, commentBody }: UpdateCommentInput
): Promise<UpdateCommentResponse> => {
  const query = gql`
mutation UpdateCommentMutation($updateCommentUpdateCommentInput: UpdateCommentInput!) {
  updateComment(updateCommentInput: $updateCommentUpdateCommentInput) {
    status
    message
    comment {
      id
      comment
    }
  }
}
  `

  const variables = {
    "updateCommentUpdateCommentInput": {
      commentId,
      commentBody
    }
  }

  const response = await client.request(query, variables);
  return response.updateComment;
};

export default updateComment;
