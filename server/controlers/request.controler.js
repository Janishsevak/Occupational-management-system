import { or } from "sequelize";
import { getDbByOrigin } from "../models/dbconnection.js";
import { defineDeleteRequestModel } from "../models/request.model.js";
import { defineFTEMedicalModel } from "../models/FTEmedical.model.js";
import { defineInjuryModel } from "../models/injury.model.js";
import { defineOclMedicalModel } from "../models/oclmedical.js";
import { defineDailyMedicalModel } from "../models/dailymedical.js";
import { VALID_MODELS, getModelByName } from "./model.map.js";

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

    const deleteRequest = await DeleteRequest.create({
      model,
      recordId,
      reason: reason || null,
      status: "pending",
    });

    res.status(201).json({ success: true, data: deleteRequest });
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

export const actionOnDeleteRequest = async (req, res) => {
  const origin = req.user?.origin || req.headers["x-origin"];
  if (!origin) {
    return res.status(400).json({ message: "Missing origin in headers" });
  }

  const db = getDbByOrigin(origin);

  // Models mapping for dynamic deletion
  const models = {
    injuries: defineInjuryModel(db),
    FteMedical: defineFTEMedicalModel(db),
    oclmedical: defineOclMedicalModel(db),
    dailymedical: defineDailyMedicalModel(db),
  };

  const DeleteRequest = defineDeleteRequestModel(db);

  try {
    let { requestIds, action } = req.body;

    // Convert single ID to array for uniform handling
    if (!Array.isArray(requestIds)) {
      requestIds = [requestIds];
    }

    const results = [];

    for (const requestId of requestIds) {
      const request = await DeleteRequest.findByPk(requestId);
      if (!request) {
        results.push({ requestId, status: "not_found" });
        continue;
      }

      if (action === "approve") {
        const model = models[request.tableName];
        if (!model) {
          results.push({ requestId, status: "unknown_table" });
          continue;
        }

        await model.destroy({ where: { id: request.recordId } });
        request.status = "approved";
        await request.save();
        results.push({ requestId, status: "approved" });
      } else if (action === "reject") {
        request.status = "rejected";
        await request.save();
        results.push({ requestId, status: "rejected" });
      } else {
        results.push({ requestId, status: "invalid_action" });
      }
    }

    return res.status(200).json({
      message: `Bulk ${action} operation completed`,
      results,
      success: true,
    });
  } catch (error) {
    console.error("Error processing delete requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
