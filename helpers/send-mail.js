const nodemailer = require("nodemailer");
const config = require("../config");

var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    tls: {
        ciphers: 'SSLv3',
        secureConnection: true
    },
    auth: {
        user: config.email.username,
        pass : config.email.password
    }
});

module.exports = transporter;