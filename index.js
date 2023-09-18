const express = require('express')
const app = express()
var cors = require('cors')
const db = require('./config')
const cookieParser = require('cookie-parser')
const route = require('./router')
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT


//connect db
db.connect()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



route(app)

app.listen(PORT || 8000, () => {
    console.log('Server is running Port', PORT)
})