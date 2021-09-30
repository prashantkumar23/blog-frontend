import { gql } from "graphql-request";
import { client } from "../../pages";
import { GetTopBlogsByTopicInput } from "../../types";

const getTopBlogsByTopic = async ({ topic }: GetTopBlogsByTopicInput) => {

  const query = gql`
query Query($getTopBlogsByTopicResolverGetTopBlogsByTopicInput: GetTopBlogsByTopicInput!) {
  getTopBlogsByTopicResolver(getTopBlogsByTopicInput: $getTopBlogsByTopicResolverGetTopBlogsByTopicInput) {
    blogs {
      _id
      title
      blogImageUrl
      tags
      createdAt
      user {
        _id
        name
        image
      }
    }
  }
}
  `

  const variables = {
    "getTopBlogsByTopicResolverGetTopBlogsByTopicInput": {
      topic
    }
  }
  const response = await client.request(query, variables)
  return response.getTopBlogsByTopicResolver;
}


export default getTopBlogsByTopic;