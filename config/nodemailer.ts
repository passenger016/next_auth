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
