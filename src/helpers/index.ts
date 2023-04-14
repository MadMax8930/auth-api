import crypto from 'crypto';
require("dotenv").config(); 

// Authentication helpers to encrypt password or random token
export const randomizer = () => crypto.randomBytes(128).toString('base64');
export const authenticationNeedle = (salt: string, password: string) => {
   return crypto.createHmac('sha256', [salt, password].join('/')).update(process.env.SECRET).digest('hex');
};
