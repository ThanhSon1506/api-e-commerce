"use strict";
const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const sendEmail = expressAsyncHandler(
    async ({ email, html }) => {
        const info = await transporter.sendMail({
            from: '"E-commerce" <no-reply@E-commerce.com>', // sender address
            to: email, // list of receivers
            subject: "Forgot password", // Subject line
            text: "Forgot password", // plain text body
            html: html, // html body
        });
        return info;
    }
);
module.exports = sendEmail;