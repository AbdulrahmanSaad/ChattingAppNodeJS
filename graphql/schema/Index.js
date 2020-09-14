
module.exports = `

        type User {
            _id: ID!
            email: String!
            password: String
        }

        type AuthData {
            _id: ID!
            token: String!
        }

        type Query {
            users: [User!]!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type Mutation {
            createUser(createUserInput: UserInput): User
            login(auth: UserInput): AuthData
        }

        schema {
            query: Query
            mutation: Mutation
        }
    `