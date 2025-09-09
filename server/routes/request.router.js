import express from "express";
import { actionOnDeleteRequest, actiononeditrequest, getallDeleteRequests, getallEditRequests, requestDelete, requestEdit } from "../controlers/request.controler.js";
import isAuthenticated from "../middelwares/isAutenticated.js";
import isAdmin from "../middelwares/isAdmin.js";



const router = express.Router();

router.route("/fetchrequest").get(isAdmin,getallDeleteRequests);
router.route("/fetcheditrequest").get(isAdmin,getallEditRequests);
router.route("/deleterequest").post(isAuthenticated,requestDelete);
router.route("/actiononrequest").put(isAdmin,actionOnDeleteRequest);
router.route("/editrequest").post(isAuthenticated,requestEdit);
router.route("/actiononeditrequest").put(isAdmin,actiononeditrequest);


export default router;