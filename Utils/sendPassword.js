const nodemailer = require("nodemailer");
const fs = require("fs");
const { PASSWORD } = require("./constants.js");
const constants = require("./constants.js");
const emailer = async (to, password,phone) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.email",
    port: 465,
    secure: true,
    auth: {
      user: process.env.TEST_EMAIL,
      pass: process.env.pass,
    },
  });
  let info = await transporter.sendMail({
    from: process.env.TEST_EMAIL,
    to: to,
    subject:
      "Password ",
    text: `Dear `,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Credentials</title>
        <style>
            /* Add your CSS styles here */
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
            }
            p {
                color: #666;
            }
            .credentials {
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 18px;
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Login Credentials</h1>
            <p>Thanks for logging in with Liviso.</p>
            <p>Here are your credentials:</p>
            <div class="credentials">
                <p>Number: <span>${phone}</span></p>
                <p>Password: <span contenteditable="true">${password}</span></p>
                </div>
            <p>Login using these credentials in your app.</p>
            <img src="liviso.png" alt="Liviso Logo" style="max-width: 100%; height: auto;">
        </div>
    </body>
    </html>
    `,
  });
  console.log("Message sent: %s", info.messageId);
};
module.exports = emailer;
