const typeDefs = `
type Query {
    getUser(email: String): User!
    getAllUsers:[User]!
  }
type Mutation {
  signup(email: String, firstname: String , lastname: String , password: String, PhoneNumber:Int, verified:Boolean=false): User!
  login(email: String, password: String): User!
}

type User {
  id: ID!
  firstname: String!
  lastname: String!
  password: String!
  PhoneNumber:Int!
  verified: Boolean!
  verifiedIps: [String!]!
  platforms: [String!]!
}
`
export default typeDefs;
