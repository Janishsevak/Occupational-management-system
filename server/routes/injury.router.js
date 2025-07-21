import express from "express";
import isAuthenticated from '../middelwares/isAutenticated.js';
import multer from 'multer';
import { getinjurydata, injurydatadelete, injurydataentry, injurydataupdate, uploadexceldata } from "../controlers/injury.controler.js";

const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/injuryentry').post(isAuthenticated,injurydataentry);
router.route('/injurydata').get(isAuthenticated,getinjurydata);
router.route('/deleteinjurydata/:id').delete(isAuthenticated, injurydatadelete);
router.route('/updateinjurydata/:id').put(isAuthenticated, injurydataupdate);
router.route('/uploadinjurydata').post(isAuthenticated, upload.single('file'),uploadexceldata);

export default router;