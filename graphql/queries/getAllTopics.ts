import { gql } from "graphql-request";
import { client } from "../../pages";

const getAllTopics = async () => {

  const query = gql`
query Query {
  getAllTopics {
    topics{
      topicName
      topicDescription
      topicColorCode
    }
  }
}
  `

  const response = await client.request(query);
  return response.getAllTopics;
};

export default getAllTopics;
