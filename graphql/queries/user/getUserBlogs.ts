import { gql } from "graphql-request";
import { client } from "../../../pages";
import { GetUserBlogInput } from "../../../types";

const getUserBlogs = async ({ userId, pageNumber, nPerPage }: GetUserBlogInput) => {

  const query = gql`
query Query($getUserBlogsUserId: GetUserBlogInput!) {
  getUserBlogs(userId: $getUserBlogsUserId) {
    count
    next {
      pageNumber
      nPerPage
    }
    prevoius
    blogs {
      id
      title
      tags
      blogImageUrl
      createdAt
    }
  }
}
  `


  const variables = {
    "getUserBlogsUserId": {
      userId,
      pageNumber,
      nPerPage
    }
  }

  const response = await client.request(query, variables);
  return response.getUserBlogs;
};

export default getUserBlogs;
