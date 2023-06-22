const express = require('express')
const app = express()
const db = require('./config')
const cookieParser = require('cookie-parser')
const route = require('./router')


//connect db
db.connect()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


route(app)

app.listen(8000, () => {
    console.log('Server is running ...')
})