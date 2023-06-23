const auth = require('./auth')
const user = require('./user')
const product = require('./product')
const productCategory = require('./ProductCategory')
const blog = require('./Blog')
const blogCategory = require('./BlogCategory')
const brand = require('./Brand')


const route = (app) => {
    app.use('/auth', auth)
    app.use('/users', user)
    app.use('/products', product)
    app.use('/category-products', productCategory)
    app.use('/blogs', blog)
    app.use('/category-blogs', blogCategory)
    app.use('/brands', brand)
}

module.exports = route