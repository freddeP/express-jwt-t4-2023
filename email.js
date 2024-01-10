const nodemailer = require("nodemailer");

module.exports = send;

async function send(receiver, code){


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.PW
        }
    })


   await transporter.sendMail({
        to:receiver,
        subject:"One time password",
        html:`
        <h2>${code}</h2>
        `
    })

}