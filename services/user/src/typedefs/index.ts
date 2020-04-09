const typeDefs = `
  type Query {
    hello(name: String): String!
    listOfStrings: [String]
  }
`

export default typeDefs;