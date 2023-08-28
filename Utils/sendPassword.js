const nodemailer = require("nodemailer");
const fs = require("fs");
const { PASSWORD } = require("./constants");
const emailer = async (to) => {

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
    text: `Team ${team}`,
    html: `
    <html>${PASSWORD}</html>`,
  });
  console.log("Message sent: %s", info.messageId);
};
module.exports = emailer;
