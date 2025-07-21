import express from 'express';
import { deleteOclMedicalEntry, getOclMedicalEntries, oclmedicalentry, updateOclMedicalEntry, uploadexceldata } from '../controlers/oclmedical.controler.js';
import isAuthenticated from '../middelwares/isAutenticated.js';
import multer from 'multer';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/oclmedicalentry').post(isAuthenticated, oclmedicalentry);
router.route('/getoclmedicalentries').get(isAuthenticated, getOclMedicalEntries);
router.route('/deleteoclmedicalentry/:id').delete(isAuthenticated, deleteOclMedicalEntry);
router.route('/updateoclmedicalentry/:id').put(isAuthenticated, updateOclMedicalEntry);
router.route('/uploadoclmedicalfile').post(isAuthenticated, upload.single('file'),uploadexceldata);
   

export default router;