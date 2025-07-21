import express from "express";
import isAuthenticated from '../middelwares/isAutenticated.js';
import { dailymedicalentry, deletedailyMedicalEntry, getdailymedicalentry, updatedailymedicalentry, uploadexceldata } from "../controlers/dailymedical.controler.js";
import multer from 'multer';

const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/dailymedicalentry').post(isAuthenticated,dailymedicalentry);
router.route('/getdailymedicalentries').get(isAuthenticated, getdailymedicalentry);
router.route('/deletedailymedicalentry/:id').delete(isAuthenticated, deletedailyMedicalEntry);
router.route('/updatedailymedicalentry/:id').put(isAuthenticated, updatedailymedicalentry);
router.route('/uploaddailymedicalfile').post(isAuthenticated, upload.single('file'),uploadexceldata);

export default router;