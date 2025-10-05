// this file is for confirguing nodemailer instance
// then we will export the transporter and the sender email address
// so that they can be used in other parts of the application for sending emails using nodemailer
import nodemailer from 'nodemailer';

// constant containing the email address of the sender
export const accountEmail = 'passenger.code016@gmail.com'


// we will configure a transporter using GMAIL as a service
export const transporter = nodemailer.createTransport({
    service: 'Gmail', // ids are case-insensitive
    auth: {
        user: accountEmail,
        pass: process.env.EMAIL_PASSWORD,
    }
});

// a common resuable HTML template for the email body is created under /utils/email-template.js
// '/lib' folder contains functions that can be reused across the application
