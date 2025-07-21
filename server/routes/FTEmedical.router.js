import express from "express";
import isAuthenticated from '../middelwares/isAutenticated.js';
import multer from 'multer';
import { deleteFTEmedicalentry, ftemedicalentry, getFTEmedicalentry, updateFTEmedicalentry, uploadexceldata } from "../controlers/FTEmedical.controler.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/ftemedicalentry').post(isAuthenticated,ftemedicalentry);
router.route('/ftemedicaldata').get(isAuthenticated, getFTEmedicalentry);
router.route('/updateFTEmedicaldata/:id').put(isAuthenticated, updateFTEmedicalentry);
router.route('/uploadFTEmedicaldata').post(isAuthenticated, upload.single('file'),uploadexceldata);
router.route('/FTEmedicaldatadelete/:id').delete(isAuthenticated,deleteFTEmedicalentry);

export default router;