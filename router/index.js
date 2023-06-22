const auth = require('./auth')
const user = require('./user')
const product = require('./product')


const route = (app) => {
    app.use('/auth', auth)
    app.use('/users', user)
    app.use('/products', product)
}

module.exports = route