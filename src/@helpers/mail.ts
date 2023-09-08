import { createTransport, SendMailOptions } from 'nodemailer';
import { SMTP } from 'src/constant';
const transporter = createTransport({
  host: SMTP.host,
  port: SMTP.port,
  secure: true,
  auth: {
    user: SMTP.user,
    pass: SMTP.password,
  },
});

export const sendmail = async (options: SendMailOptions) => {
  try {
    options.from = {
      name: 'LancemeUp Space',
      address: SMTP.user,
    };
    const result = await transporter.sendMail(options);
    console.log(result, 'Sent Mail successfully.');
  } catch (e) {
    console.log('Error on sending mail');
  }
};
