const express = require('express')
const mongoose = require('mongoose')
const { GraphQLServer, PubSub } = require('graphql-yoga');

const graphqlSchema = require('./graphql/schema/Index')
const graphQlResolvers = require ('./graphql/resolvers/Index')
const isAuth = require('./middleware/IsAuth')

const DB_URL = "mongodb://localhost:27017/Chatting"
const app = express()

app.use(isAuth)

const server  = new GraphQLServer({
    typeDefs: graphqlSchema,
    resolvers: graphQlResolvers,
    context:{
      pubsub
    }
  })
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