const mongoose = require('mongoose')
const { 
  GraphQLServer,
  PubSub 
} = require('graphql-yoga');

const isAuth = require('./middleware/IsAuth')
const graphqlSchema = require('./graphql/schema/Index')
const graphQlResolvers = require('./graphql/resolvers/Index')

const DB_URL = "mongodb://mongo:27017/Chatting"

const pubsub = new PubSub()
const server = new GraphQLServer({
  typeDefs: graphqlSchema,
  resolvers: graphQlResolvers,
  context: req => ({...req, pubsub})
})
server.express.use(isAuth)
const options = { 
  port: 3000
};

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("MongoDB connected!")
}).catch((err) => {
  console.log(err, "ERROR")
})

server.start(options, ({ port }) => {
  console.log(
    `Graphql Server started, listening on port ${port} for incoming requests.`,
  )
})