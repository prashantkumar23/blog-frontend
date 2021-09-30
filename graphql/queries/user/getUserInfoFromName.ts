import { gql } from "graphql-request";
import { client } from "../../../pages";
import { GetUserInfoFromNameInput } from "../../../types";

const getUserInfoFromName = async ({ name }: GetUserInfoFromNameInput) => {

    const query = gql`
query Query($getUserInfoFromNameName: GetUserInfoFromNameInput!) {
  getUserInfoFromName(name: $getUserInfoFromNameName) {
    user {
      id
      name
      bio
      image
    }
  }
}
  `

    const variables = {
        "getUserInfoFromNameName": {
            name
        }
    }

    const response = await client.request(query, variables);
    return response.getUserInfoFromName;
};

export default getUserInfoFromName;
