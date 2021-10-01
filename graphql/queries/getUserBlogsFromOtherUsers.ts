import { gql } from "graphql-request";
import { client } from "../../pages/_app";
import { GetUserBlogsFromOtherUsersInput } from "../../types";

const getUserBlogsFromOtherUsers = async ({ name, pageNumber, nPerPage }: GetUserBlogsFromOtherUsersInput) => {

  const query = gql`
query Query($getUserBlogsFromOtherUsersGetUserBlogsFromOtherUsersInput: GetUserBlogsFromOtherUsersInput!) {
  getUserBlogsFromOtherUsers(getUserBlogsFromOtherUsersInput: $getUserBlogsFromOtherUsersGetUserBlogsFromOtherUsersInput) {
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
      createdAt
      blogImageUrl
      user {
        id
        name
        image
        bio
      }
    }
  }
}
  `


  const variables = {
    "getUserBlogsFromOtherUsersGetUserBlogsFromOtherUsersInput": {
      name,
      pageNumber,
      nPerPage
    }
  }

  const response = await client.request(query, variables);
  return response.getUserBlogsFromOtherUsers;
};

export default getUserBlogsFromOtherUsers;
