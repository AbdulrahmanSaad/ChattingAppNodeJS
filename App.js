const mongoose = require('mongoose')
const { GraphQLServer } = require('graphql-yoga');
const { graphqlHTTP } = require('express-graphql')

const isAuth = require('./middleware/IsAuth')
const graphqlSchema = require('./graphql/schema/Index')
const graphQlResolvers = require('./graphql/resolvers/Index')

const DB_URL = "mongodb://localhost:27017/Chatting"

const server = new GraphQLServer({
  schema: graphqlSchema,
  resolvers: graphQlResolvers,
})
server.express.use(isAuth)
server.express.use(graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphQlResolvers,
  graphiql: true
}))
const options = {
  port: 3000
};

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  server.start(options, ({ port }) => {
    console.log(
      `Graphql Server started, listening on port ${port} for incoming requests.`,
    )
  })
})