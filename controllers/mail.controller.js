import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const mailOptions = {
  host: process.env.SMTP_HOST, 
  port: process.env.SMTP_PORT, 
  // secure: true, 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  }
}

const transporter = nodemailer.createTransport(mailOptions);

export const sendEmail = async (req, res) => {
    try {
      const { firstName, lastName, phone, email, subject, message } = req.body;

      console.log({mailOptions})

      const templatePath = path.join(__dirname, '../mails', 'contact.ejs');

      // Render the EJS template with data
      const html = await ejs.renderFile(templatePath, {
        firstName,
        lastName,
        phone,
        email,
        message
      });
      
      transporter.sendMail({
        from: process.env.SMTP_FROM, 
        to: email,
        subject: subject,
        html: html
        }, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).send(error.toString());
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({
                  emailSent: 'true'
                });
            }
        }
      );

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };