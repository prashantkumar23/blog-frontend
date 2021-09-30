import { gql } from "graphql-request";
import { CreateBlogInput } from "../../../types";
import { client } from "../../../pages";

const createBlog = async ({ userId, title, body, blogImageUrl, tags }: CreateBlogInput) => {
  const query = gql`
mutation CreateBlogMutation($createBlogCreateBlogInput: CreateBlogInput!) {
  createBlog(createBlogInput: $createBlogCreateBlogInput) {
    status
    message
  }
}
  `

  const variables = {
    createBlogCreateBlogInput: {
      userId,
      title,
      body,
      tags,
      blogImageUrl
    }
  }

  const response = await client.request(query, variables);
  return response.createBlog;
};

export default createBlog;
