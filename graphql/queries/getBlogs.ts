import { gql } from "graphql-request";
import { client } from "../../pages/_app";

const getBlogs = async (pageParams: any) => {
  const pageNumber = pageParams.pageNumber;
  const nPerPage = pageParams.nPerPage;


  const query = gql`
query Query($getBlogsGetBlogsInput: GetBlogsInput!) {
  getBlogs(getBlogsInput: $getBlogsGetBlogsInput) {
    count
    next {
      pageNumber
      nPerPage
    }
    prevoius
    blogs {
      _id
      title
      createdAt
      tags
      blogImageUrl
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
    "getBlogsGetBlogsInput": {
      "pageNumber": pageNumber,
      "nPerPage": nPerPage
    }
  }

  const response = await client.request(query, variables)
  return response.getBlogs;
}


export default getBlogs;