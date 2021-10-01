import { gql } from "graphql-request";
import { client } from "../../../pages/_app";

const getListOfUsers = async () => {

  const query = gql`
query Query {
  getListOfUsers {
    users {
      id
      name
      image
    }
  }
}
  `

  const response = await client.request(query);
  return response.getListOfUsers;
};

export default getListOfUsers;
