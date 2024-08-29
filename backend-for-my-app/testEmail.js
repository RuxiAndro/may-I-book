require('dotenv').config();
const nodemailer = require('nodemailer');

// Configurarea transportatorului de emailuri
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Setările emailului
const mailOptions = {
    from: process.env.EMAIL_USER, // Adresa ta de email
    to: 'ruxi.andro@gmail.com',   // Adresa destinatarului
    subject: 'Test Email',
    text: 'Hello! This is a test email sent using Nodemailer.',
};

// Trimite emailul
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error occurred:', error);
    } else {
        console.log('Email sent successfully:', info.response);
    }
});
