const typeDefs = `
  type Query {
      getAllUsers:[User]!
      refresh(refreshToken: String!): String!
  }
  type Mutation {
    signup(data: signupDetails): User!
    login(data: loginDetails): User
    addDevice(deviceName: String ): User!
    unblockDevice(token: String): User!
    blacklistDevice(token: String): [Device!]!
    changePassword(data: changePassword): User!
    confirmMail(token : String): User!
    forgotPassword(email : String): null
    resetPassword (token: String, password: String): User!
    retryVerify(email: String): null
  }
  type User {
    id: ID!
    firstname: String!
    lastname: String!
    PhoneNumber:String!
    verified: Boolean!
    devices: [VerifiedDevices]!
  }
  type Device {
    id: ID!
    user: Number!
    blacklistedIps: String!
  }
  type VerifiedDevices {
    ipAddress: String!
    deviceName: String!
  }
  input changePassword {
    id: ID!
    password: String!
    newpassword: String!
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
