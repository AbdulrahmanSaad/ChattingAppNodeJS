const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Message = require('../../Models/Message')
const User = require('../../Models/User')

const unauthenticatedCondition = (params) => {
    if (!params) {
        throw new Error("Unauthenticated")
    }
}

let trimmedEmail

module.exports = {

    RootQuery: {
        messages: (_, args, context) => {
            const {
                isAuth
            } = context.request
            unauthenticatedCondition(isAuth)

            return Message.find().populate('sender')
                .then(messages => {
                    return messages.map(message => {
                        return {
                            ...message._doc,
                        }
                    })
                })
        },
        users: () => {

            const {
                isAuth
            } = req

            unauthenticatedCondition(isAuth)

            return User.find().populate('sentMessages')
                .then(res => {
                    return res
                }).catch(err => { console.log(err) })
        }
    },
    RootMutation: {
        sendMessage(_, args, context) {
            const {
                isAuth
            } = context.request

            unauthenticatedCondition(isAuth)

            const {
                text
            } = args.sendMessageInput
            const message = new Message({
                text,
                sender: context.request.userId
            })
            let sentMessage
            return message
                .save()
                .then((res) => {
                    sentMessage = res
                    return User.findById(context.request.userId)
                })
                .then(user => {
                    user.sentMessages.push(message)
                    return user.save()
                })
                .catch(err => { console.log(err) })
                .then(result => {
                    const {
                        pubsub
                    } = context
                    pubsub.publish('message', {
                        message: sentMessage
                    });
                    return sentMessage
                })
        },
        createUser: (_, args) => {
            const {
                email,
                password
            } = args.createUserInput

            let errMsg = {
                error: "",
                _id: ""
            }

            trimmedEmail = email.trim();

            if (!trimmedEmail || trimmedEmail && !/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(trimmedEmail)) {
                errMsg = {
                    error: "Invalid email form",
                    _id: "Not found"
                }
                return errMsg
            }

            return User.findOne({ email: trimmedEmail }).then(user => {
                if (user) {
                    // throw new Error().then(res => {return res})
                    errMsg = {
                        error: "Email already in use",
                        _id: "Not displayed"
                    }
                    return errMsg
                }
                if(!password){
                    errMsg = {
                        error: "Password is required",
                        _id: "Not displayed"
                    }
                    return errMsg
                }
                return bcrypt.hash(password, 12).then((result) => {
                    const user = new User({
                        email: trimmedEmail,
                        password: result
                    })
                    return user.save().then(res => { return res }).catch(err => { console.log(err) })
                })

            })
        },
        login: (_, args, context) => {
            const {
                email,
                password
            } = args.auth

            trimmedEmail = email.trim()

            if (!trimmedEmail || trimmedEmail && !/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(trimmedEmail)) {
                errMsg = {
                    error: "Invalid email form",
                    _id: "Not Found",
                    token: "Not found"
                }
                return errMsg
            }

            if(!password){
                errMsg = {
                    error: "Password is required",
                    _id: "Not displayed",
                    token: "Not found"
                }
                return errMsg
            }

            return User.findOne({ email: trimmedEmail })
                .then((user) => {
                    if (user) {
                        return bcrypt.compare(password, user.password)
                            .then(same => {
                                if (!same) {
                                    throw new Error("Not matching password!")
                                }
                                else {
                                    let token = jwt.sign({
                                        email: trimmedEmail,
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
    },

    RootSubscription: {
        message: {
            subscribe(_, args, context) {
                const {
                    pubsub
                } = context
                return pubsub.asyncIterator("message")
            }
        }
    }
}