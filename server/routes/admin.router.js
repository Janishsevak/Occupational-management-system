import express from 'express';
import { adminChangePassword, getuserdetails, loginadmin, registeradmin, registerUser } from '../controlers/usercontroler.js';
import isAdmin from '../middelwares/isAdmin.js';

const router = express.Router();

router.route('/adminregister').post(registeradmin)
router.route('/adminlogin').post(loginadmin)
router.route('/getuser').get(isAdmin,getuserdetails);
router.route('/register').post(isAdmin,registerUser);
router.route('/changepassword').post(isAdmin,adminChangePassword);

export default router;