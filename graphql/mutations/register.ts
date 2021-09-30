import { gql } from "graphql-request";
import { client } from "../../pages";
import { RegisterInput } from "../../types";

const register = async ({ username, password }: RegisterInput) => {
    const query = gql`
mutation RegisterMutation($registerRegisterInput: RegisterInput!) {
  register(registerInput: $registerRegisterInput) {
    status
    registerPayload {
      accessToken
      refreshToken
    }
  }
}
  `

    const variables = {
        registerRegisterInput: {
            username,
            password
        }
    }

    const response = await client.request(query, variables);
    return response.register;
};

export default register;
