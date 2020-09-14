const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../Models/User')

module.exports = {
    Query: {
        users: () => {
            return User.find()
                .then(res => {
                    return res
                }).catch(err => { console.log(err) })
        },
    },
    Mutation: {
        createUser: (parent, args) => {
            const {
                email,
                password
            } = args.createUserInput

            return User.findOne({ email }).then(user => {
                if (user) {
                    throw new Error("Email already in use")
                } else {
                    return bcrypt.hash(password, 12).then((result) => {
                        const user = new User({
                            email,
                            password: result
                        })
                        return user.save().then(res => { return res }).catch(err => { console.log(err) })
                    })
                }
            })
        },
        login: (parent, args) => {
            const {
                email,
                password
            } = args.auth

            return User.findOne({ email })
                .then((user) => {
                    if (user) {
                        return bcrypt.compare(password, user.password)
                            .then(same => {
                                if (!same) {
                                    throw new Error("Not matching password!")
                                }
                                else {
                                    let token = jwt.sign({
                                        email,
                                        userId: user._id
                                    }, "This is the JWT Secret")
                                    const authData = {
                                        _id: user._id,
                                        token
                                    }
                                    return authData
                                }
                            }).then(res => {
                                return res
                            }).catch(err => console.log(err))
                    }
                })
        }
    }
}