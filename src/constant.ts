import * as dotenv from 'dotenv';
dotenv.config();

export const PORT: number = parseInt(process.env.PORT);
export const DATABASE = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export const GOOGLE = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACKURL,
  password: process.env.GOOGLE_PASSWORD,
};

export const SMTP = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
};

export const JwtSecret: string = process.env.JWT_SECRET;

