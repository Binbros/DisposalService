const typeDefs = `
type Query {
    getUser(email: String): User!
    getAllUsers:[User]!
    refreshToken(refreshToken: String!): String!
  }
type Mutation {
  signup(data: signupDetails): Auth
  login(data: loginDetails): Auth
  addIpAddress(ipAddress: String , deviceName: String ): [String!]!
}

type Auth {
  user: User!
  token: String!
}

type User {
  id: ID!
  firstname: String!
  lastname: String!
  PhoneNumber:Int!
  verified: Boolean
}
input signupDetails{
  email: String
  firstname: String
  lastname: String
  password: String
  PhoneNumber:Int,
}
input loginDetails{
  email: String
  password: String
}
`;

export default typeDefs;
