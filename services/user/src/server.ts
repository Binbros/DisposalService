import { GraphQLServer } from 'graphql-yoga';

import typeDefs from './typedefs';
import context from './context';
import resolvers from './resolver';
import db from './config/db';

db();

const server = new GraphQLServer({ typeDefs, resolvers, context});

const options = {
    port: 8000,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground',
  }


server.start(options, ({port}) => 
    console.log(
        `Server started, listening on port ${port} for incoming requests.`,
      ),
);
