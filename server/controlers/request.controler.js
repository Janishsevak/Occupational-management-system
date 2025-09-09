import { or, where, Op } from "sequelize";
import { getDbByOrigin } from "../models/dbconnection.js";
import { defineDeleteRequestModel } from "../models/request.model.js";
import { VALID_MODELS, getModelByName } from "./model.map.js";
import { defineEditRequestModel } from "../models/editrequest.model.js";

export const requestDelete = async (req, res) => {
  const origin = req.user.origin || req.headers["x-origin"];
  const { model, reason, recordId } = req.body;
  console.log("id", recordId);
  if (!origin) {
    return res.status(400).json({ message: "Missing origin in headers" });
  }

  if (!VALID_MODELS.includes(model)) {
    return res.status(400).json({ message: "Invalid table name" });
  }

  try {
    const db = getDbByOrigin(origin);

    const DeleteRequest = defineDeleteRequestModel(db);
    const finatable = getModelByName(db,model)
    

    const normalizedIds = Array.isArray(recordId)
      ? recordId.map((r) => (typeof r === "object" ? r.id : r))
      : [typeof recordId === "object" ? recordId.id : recordId];

    const deleteRequest = await DeleteRequest.create({
      model,
      recordId: normalizedIds,
      reason: reason || null,
      status: "pending",
    });
    const setrequest = await finatable.update(
      { request: "pending" },
      { where: { id: { [Op.in]: normalizedIds } } }
    );

    res.status(201).json({ success: true, data: deleteRequest, setrequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getallDeleteRequests = async (req, res) => {
  const origin = req.user.origin || req.headers["x-origin"];
  if (!origin) {
    return res.status(400).json({ message: "Missing origin in headers" });
  }
  const db = getDbByOrigin(origin);

  const DeleteRequest = defineDeleteRequestModel(db);
  try {
    const requests = await DeleteRequest.findAll({
      where: { status: "pending" },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ requests, success: true });
  } catch (error) {
    console.error("Error fetching delete requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getallEditRequests = async (req, res) => {
  const origin = req.user.origin || req.headers["x-origin"];
  if (!origin) {
    return res.status(400).json({ message: "Missing origin in headers" });
  }
  const db = getDbByOrigin(origin);

  const EditRequest = defineEditRequestModel(db);
  try {
    const requests = await EditRequest.findAll({
      where: { status: "pending" },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ requests, success: true });
    
  } catch (error) {
    console.error("Error fetching delete requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const requestEdit = async (req, res) => {
  const origin = req.user.origin || req.headers["x-origin"];
  const { model, reason, recordId, changes } = req.body; 
  // updatedFields = { fieldName: "newValue", ... }
  console.log("response",changes)
  if (!origin) {
    return res.status(400).json({ message: "Missing origin in headers" });
  }

  if (!VALID_MODELS.includes(model)) {
    return res.status(400).json({ message: "Invalid table name" });
  }

  try {
    const db = getDbByOrigin(origin);

    const EditRequest = defineEditRequestModel(db);     

    // create an edit request entry
    const editRequest = await EditRequest.create({
      model,
      recordId,
      reason: reason || null,
      changes, // keep the new data as JSON until approved
      status: "pending",
    });
    res.status(201).json({ success: true, data: editRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const actionOnDeleteRequest = async (req, res) => {
  const { requestIds, action, origin } = req.body;
  console.log("");
  if (!origin) {
    return res.status(400).json({ message: "Missing origin in body" });
  }
  console.log("model name", requestIds);

  try {
    const db = getDbByOrigin(origin);
    const DeleteRequest = defineDeleteRequestModel(db);

    // requestIds is a single number
    const request = await DeleteRequest.findByPk(requestIds);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // pick correct model
    const findtable = getModelByName(db, request.model);
    console.log("tablename", findtable);
    if (!findtable) {
      return res.status(400).json({ message: "Unknown table name" });
    }

    const deleterecordId = request.recordId; // ✅ already array


    if (action === "approve") {
      if (
        !deleterecordId ||
        (Array.isArray(deleterecordId) && deleterecordId.length === 0)
      ) {
        return res.status(400).json({ message: "No recordIds provided" });
      }

      // delete from original table
      await findtable.destroy({ where: { id: deleterecordId } });

      request.status = "approved";
      await request.save();

      return res.status(200).json({ success: true, status: "approved" });
    } else if (action === "reject") {
      await findtable.update(
        { request: null }, // ✅ fields to update
        { where: { id: deleterecordId } } // ✅ condition
      );
      request.status = "rejected";
      await request.save();

      return res.status(200).json({ success: true, status: "rejected" });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    console.error("Error processing delete request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const actiononeditrequest = async (req, res) => {
  const { requestId, origin, action } = req.body;
  console.log("body", requestId);

  if (!origin || !requestId || !action) {
    return res.status(400).json({ message: "Something missing in body" });
  }

  try {
    const db = getDbByOrigin(origin);
    const EditRequest = defineEditRequestModel(db);

    const request = await EditRequest.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const findtable = getModelByName(db, request.model);
    if (!findtable) {
      return res.status(400).json({ message: "Unknown table name" });
    }
    console.log("findtable", findtable);

    const recordId = request.recordId;
    const changes = request.changes; // ✅ get from database

    console.log("changes", changes);

    if (action === "approve") {
      if (!recordId) {
        return res.status(400).json({ message: "No Id found to edit" });
      }

      // ✅ Apply changes
      await findtable.update(
        { ...changes, request: "done" },
        { where: { id: recordId } }
      );

      request.status = "approved";
      await request.save();

      return res.status(200).json({ success: true, status: "approved" });

    } else if (action === "reject") {
      await findtable.update(
        { request: null },
        { where: { id: recordId } }
      );

      request.status = "rejected";
      await request.save();

      return res.status(200).json({ success: true, status: "rejected" });
    }

    return res.status(400).json({ message: "Invalid action" });

  } catch (error) {
    console.error("Error processing edit request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




















