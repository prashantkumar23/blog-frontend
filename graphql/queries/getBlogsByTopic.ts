import { gql } from "graphql-request";
import { client } from "../../pages/_app";

const getBlogsByTag = async (tag: string, pageParams: any) => {
  const pageNumber = pageParams.pageNumber;
  const nPerPage = pageParams.nPerPage;

  const query = gql`
query Query($getBlogsByTagFindByTagInput: GetBlogsByTagInput!) {
  getBlogsByTag(findByTagInput: $getBlogsByTagFindByTagInput) {
    count
    next {
      nPerPage
      pageNumber
    }
    prevoius
    blogs {
      _id
      title
      tags
      blogImageUrl
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
    "getBlogsByTagFindByTagInput": {
      tag,
      pageNumber,
      nPerPage
    }
  }
  const response = await client.request(query, variables)
  return response.getBlogsByTag;
}


export default getBlogsByTag;