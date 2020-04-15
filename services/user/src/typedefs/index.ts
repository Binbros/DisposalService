const typeDefs = `
type Query {
    getUser(email: String): User!
    getAllUsers:[User]!
  }
type Mutation {
  signup(data: signupDetails): {user :User! ,token:String}
  login(data: loginDetails): {user :User! ,token:String}
  addIpAddress(ipAddress: String , deviceName: String ): [String!]!
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
