const nodemailer = require('nodemailer')
require('dotenv').config()


const sendMail = async (data) => {
    const { email, html } = data
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Van Quang 👻" <foo@example.com>',
        to: email,
        subject: "Hello ✔",
        text: "Hello world?",
        html: html
    });

    return info
}


module.exports = sendMail