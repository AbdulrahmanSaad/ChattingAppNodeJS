const {
    buildSchema
} = require('graphql')

module.exports = buildSchema (`
        type Message {
            _id: ID!
            text: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
            sentMessages: [Message!]
        }

        type AuthData {
            _id: ID!
            token: String!
        }

        type RootQuery {
            messages: [Message!]!
            users: [User!]!
        }
        
        input MessageInput {
            text: String!
            sender: ID
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootMutation {
            sendMessage(sendMessageInput: MessageInput): Message
            createUser(createUserInput: UserInput): User
            login(auth: UserInput): AuthData
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)