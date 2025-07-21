import express from 'express';
import { loginUser, userChangePassword } from '../controlers/usercontroler.js';
import isAuthenticated from '../middelwares/isAutenticated.js';


const router = express.Router();


router.route('/login').post(loginUser);
router.route('/changepassword').post(isAuthenticated,userChangePassword);


export default router;