import { gql } from "graphql-request";
import { client } from "../../pages/_app";

const getBlog = async (blogId: string) => {

  const query = gql`
  
  query Query($getBlogBlogId: GetBlogInput!) {
    getBlog(blogId: $getBlogBlogId) {
      blog {
        _id
        title
        tags
        body
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
    getBlogBlogId: {
      blogId
    }
  }

  const response = await client.request(query, variables);
  return response.getBlog;
};

export default getBlog;
