const resolvers = {
    Query: {
      hello: (_ : any, { name } : any) => `Hello ${name || 'World'}`,
    },
  }

export default resolvers;