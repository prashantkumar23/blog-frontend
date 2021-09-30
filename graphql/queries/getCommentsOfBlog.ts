import { gql } from "graphql-request";
import { client } from "../../pages";
import { GetCommentsOfBlogResponse, GetCommentsOfBlogInput } from "../../types";

const getCommentsOfBlog = async ({ blogId }: GetCommentsOfBlogInput): Promise<GetCommentsOfBlogResponse> => {

  const query = gql`
  query Query($getCommentsOfBlogBlogId: GetCommentsOfBlogInput!) {
  getCommentsOfBlog(blogId: $getCommentsOfBlogBlogId) {
    blogComments {
      comments {
        _id
        comment
        createdAt
        user {
          _id
          name
          image

        }
      }
    }
  }
}

  `


  const variables = {
    "getCommentsOfBlogBlogId": {
      blogId,
    }
  }

  const response = await client.request(query, variables);
  return response.getCommentsOfBlog;
};

export default getCommentsOfBlog;
