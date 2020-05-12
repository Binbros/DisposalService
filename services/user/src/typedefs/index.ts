const typeDefs = `
  type Query {
      getAllUsers:[User]!
      refresh(id: ID!): String!
  }
  type Mutation {
    addDevice(deviceName: String ,ipAddress: String): User
    blacklistDevice(token: String): [Device!]!
    changePassword(data: changePassword): User!
    confirmMail(token : String): User!
    forgotPassword(email : String): String
    login(input: loginDetails): Auth!
    unblockDevice(token: String): User!
    resetPassword (token: String, password: String): User!
    retryVerify(email: String): String
    signup(input: signupDetails): Auth!
  }
  type Auth {
    user: User!
    token: String!
  }
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber:Float!
    verified: Boolean!
    devices: [VerifiedDevices]!
    ignorePrompt: Boolean!
    useSecondAuth: Boolean!
  }
  type Device {
    id: ID!
    user: Float!
    blacklistedIps: String!
  }
  type VerifiedDevices {
    ipAddress: String
    deviceName: String
  }
  input changePassword {
    id: ID!
    password: String!
    newPassword: String!
  }
  input signupDetails{
    email: String!
    firstName: String!
    lastName: String!
    password: String!
    phoneNumber:Float!
  }

  input loginDetails{
    email: String
    password: String
  }
`;

export default typeDefs;
