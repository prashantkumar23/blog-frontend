import { gql } from "graphql-request";
import { AddCommentInput, AddCommentResponse } from "../../../types";
import { client } from "../../../pages";

const addComment = async (
  { userId, blogId, commentBody }: AddCommentInput
): Promise<AddCommentResponse> => {
  const query = gql`
mutation AddCommentMutation($addCommentAddCommentInput: AddCommentInput!) {
  addComment(addCommentInput: $addCommentAddCommentInput) {
    status
    message
    comment
  }
}
  `

  console.log({ userId, blogId, commentBody });
  const variables = {
    "addCommentAddCommentInput": {
      userId: userId.toString(),
      commentBody: commentBody.toString(),
      blogId: blogId.toString(),
    }
  }


  const response = await client.request(query, variables);
  return response.addComment;
};

export default addComment;
