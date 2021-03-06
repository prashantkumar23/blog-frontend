import { gql } from "graphql-request";
import { client } from "../../pages/_app";

const getTopTagsNumberByPost = async () => {
  const query = gql`
       query Query {
  getTopTagsByNumberOfPost {
    tag
  }
}
  `
  const response = await client.request(query)
  return response.getTopTagsByNumberOfPost;
}


export default getTopTagsNumberByPost;