const { config } = require("../config/config");
const nodemailer = require("nodemailer");

class MailService {
  async sendMail(info) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
          user: config.email,
          pass: config.emailPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail(info);
    return { message: "mail sent" };
  }
}

module.exports = MailService;
