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
      const { fullName, email, companyName, service, message } = req.body;

      console.log({fullName, email, companyName, service, message})

      const templatePath = path.join(__dirname, '../mails', 'contact.ejs');

      // Render the EJS template with data
      const html = await ejs.renderFile(templatePath, {
        fullName,
        companyName,
        email,
        service,
        message
      });
      
      transporter.sendMail({
        from: process.env.SMTP_FROM, 
        to: process.env.SMTP_TO,
        subject: `Service - ${service}`,
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