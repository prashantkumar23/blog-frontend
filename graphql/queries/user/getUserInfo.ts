import { gql } from "graphql-request";
import { client } from "../../../pages";
import { GetUserInfoInput } from "../../../types";

const getUserInfo = async ({ userId }: GetUserInfoInput) => {

  const query = gql`
  
  query Query($getUserInfoUserId: GetUserInfoInput!) {
  getUserInfo(userId: $getUserInfoUserId) {
    user {
      bio
    }
  }
}
  `


  const variables = {
    getUserInfoUserId: {
      userId
    }
  }

  const response = await client.request(query, variables);
  return response.getUserInfo;
};

export default getUserInfo;
