import { gql } from "graphql-request";
import { client } from "../../../pages/_app";

const uploadBlogCover = async (picString: string) => {
  const query = gql`
      mutation ImageUploadMutation(
        $imageUploadImageUploadInput: ImageUploadInput!
      ) {
        imageUpload(imageUploadInput: $imageUploadImageUploadInput) {
          status
          message
          url
        }
      }
  `

  const variables = {
    imageUploadImageUploadInput: {
      photo: picString,
      username: "drew",
    },
  }

  const response = await client.request(query, variables);
  return response.imageUpload;
};

export default uploadBlogCover;
