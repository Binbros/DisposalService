const typeDefs = `
  type Query {
      getUser(email: String): User!
      getAllUsers:[User]!
      refresh(refreshToken: String!): String!
  }
  type Mutation {
    signup(data: signupDetails): Auth
    login(data: loginDetails): Auth
    addDevice(ipAddress: String , deviceName: String ): [String!]!
    unblockDevice(token: String): Object!
    blacklistDevice(token: String): Object!
    verifyDevice
  }

  type User {
    id: ID!
    firstname: String!
    lastname: String!
    password: String!
    PhoneNumber:String!
    verified: Boolean!
    verifiedIps: [String!]!
    platforms: [String!]!
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
