import express from 'express';
import authentication from '../router/auth';
import users from '../router/users';

const router = express.Router();

export default (): express.Router => {
   authentication(router);
   users(router);

   return router;
};