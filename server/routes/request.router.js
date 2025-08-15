import express from "express";
import { actionOnDeleteRequest, getallDeleteRequests, requestDelete } from "../controlers/request.controler.js";
import isAuthenticated from "../middelwares/isAutenticated.js";
import isAdmin from "../middelwares/isAdmin.js";



const router = express.Router();

router.route("/fetchrequest").get(isAdmin,getallDeleteRequests);
router.route("/deleterequest").post(isAuthenticated,requestDelete);
router.route("/actiononrequest/:id").post(isAdmin,actionOnDeleteRequest);

export default router;