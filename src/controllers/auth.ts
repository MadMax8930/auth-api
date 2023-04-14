import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { authenticationNeedle, randomizer } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
   try {
     const { email, password } = req.body;
     if (!email || !password) { return res.sendStatus(400); }

     const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
     if (!user) { return res.sendStatus(400); }

     const expectedHash = authenticationNeedle(user.authentication.salt, password);
     if (user.authentication.password !== expectedHash) { return res.sendStatus(403); }

     const salt = randomizer();  // Update user sessionToken
     user.authentication.sessionToken = authenticationNeedle(salt, user._id.toString());
     await user.save();

     // Set the cookie
     res.cookie('MAX-AUTH-COOKIE', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

     return res.status(200).json(user).end();

   } catch (error) {
     console.log(error);
     return res.sendStatus(400);
   }
};

export const register = async (req: express.Request, res: express.Response) => {
   try {
     const { email, password, username } = req.body; 
     if (!email || !password || !username) { return res.sendStatus(400); }

     const existingUser = await getUserByEmail(email);
     if (existingUser) { return res.sendStatus(400); }
     
     const salt = randomizer();
     const user = await createUser({
         email,
         username,
         authentication: {
            salt,
            password: authenticationNeedle(salt, password),
         },
     });

     return res.status(200).json(user).end();

   } catch (error) {
     console.log(error);
     return res.sendStatus(400); 
   }
};