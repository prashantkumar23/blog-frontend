import { gql } from "graphql-request";
import { UpdateBioInput } from "../../../types";
import { client } from "../../../pages";

const updateBio = async ({ userId, bio }: UpdateBioInput) => {
    const query = gql`
mutation UpdateBioMutation($updateBioUpdateBioInput: UpdateBioInput!) {
  updateBio(updateBioInput: $updateBioUpdateBioInput) {
    message
    bio
  }
}
  `

    const variables = {
        updateBioUpdateBioInput: {
            userId,
            bio
        }
    }

    const response = await client.request(query, variables);
    return response.createBlog;
};

export default updateBio;
