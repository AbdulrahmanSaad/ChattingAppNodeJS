
module.exports = `
        type Message {
            _id: ID!
            text: String!
        }

        type User {
            error: String
            _id: ID!
            email: String!
            password: String!
            sentMessages: [Message!]
        }

        type AuthData {
            error: String
            _id: ID!
            token: String!
        }

        type RootQuery {
            messages: [Message!]!
            users: [User!]!
        }
        
        input MessageInput {
            text: String!
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

        type RootSubscription {
            message: Message
        }

        schema {
            query: RootQuery
            mutation: RootMutation
            subscription: RootSubscription
        }
    `