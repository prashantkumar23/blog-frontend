import { gql } from "graphql-request";
import { client } from "../../pages";
import { LoginInput } from "../../types";

const login = async ({ username, password }: LoginInput) => {
    const query = gql`
  mutation LoginMutation($loginLoginInput: LoginInput!) {
  login(loginInput: $loginLoginInput) {
    status
    message
    loginPayload {
      accessToken
      refreshToken
    }
  }
}
  `

    const variables = {
        loginLoginInput: {
            username,
            password
        }
    }

    const response = await client.request(query, variables);
    return response.login;
};

export default login;
