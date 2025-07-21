// import { getInjuryModel } from "../utils/getTenantModel.js";
import xlsx from "xlsx";

import { defineInjuryModel } from "../models/injury.model.js";
import { getDbByOrigin } from "../models/dbconnection.js";

export const injurydataentry = async (req, res) => {
  const origin = req.user.origin || req.headers["x-origin"]; // Set this in your auth middleware
  const db = getDbByOrigin(origin);
  const Injury = defineInjuryModel(db);
  const {
    date,
    Name,
    Department,
    category,
    Designation,
    age,
    injury,
    Treatment,
    Refer_To,
    Admit,
    FollowUp_Date,
    Discharge,
    Return_to_Duty,
    BillAmount,
  } = req.body;
  if (
    !date ||
    !Name ||
    !Department ||
    !category ||
    !Designation ||
    !age ||
    !injury ||
    !Treatment
  )
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });

  try {
    await Injury.create({
      date,
      Name,
      Department,
      category,
      Designation,
      age,
      injury,
      Treatment,
      Refer_To: Refer_To || null,
      Admit: Admit || null,
      FollowUp_Date: FollowUp_Date || null,
      Discharge: Discharge || null,
      Return_to_Duty: Return_to_Duty || null,
      BillAmount: BillAmount || null,
    });
    return res.status(201).json({
      message: "Injury data entry created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error Injury data entry:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getinjurydata = async (req, res) => {
  try {
    const origin = req.user.origin || req.headers["x-origin"]; // Set this in your auth middleware
    if (!origin) {
      return res.status(400).json({ error: "Origin is required in header" });
    }
    const db = getDbByOrigin(origin);
    const Injury = defineInjuryModel(db);
    const entries = await Injury.findAll({ order: [['date', 'DESC']] });
    return res.status(200).json({ entries, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const injurydatadelete = async (req, res) => {
  const origin = req.user.origin || req.headers["x-origin"];
  const db = getDbByOrigin(origin);
  const Injury = defineInjuryModel(db);
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Entry ID is required" });
  }
  try {
    const deleteentry = await Injury.destroy({ where: { id } });
    if (!deleteentry) {
      return res
        .status(404)
        .json({ message: "Entry not found", success: false });
    }
    return res
      .status(200)
      .json({ message: " Injury data deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting Injury data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const injurydataupdate = async (req, res) => {
  const origin = req.user.origin || req.headers["x-origin"];
  const db = getDbByOrigin(origin);
  const Injury = defineInjuryModel(db);
  const { id } = req.params;
  const {
    date,
    Name,
    Department,
    category,
    Designation,
    age,
    injury,
    Treatment,
    Refer_To,
    Admit,
    FollowUp_Date,
    Discharge,
    Return_to_Duty,
    BillAmount,
  } = req.body;
  if (
    !date ||
    !Name ||
    !Department ||
    !category ||
    !Designation ||
    !age ||
    !injury ||
    !Treatment
  )
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });

  try {
    const entry = await Injury.findByPk(id);

    if (!entry) {
      return res
        .status(404)
        .json({ message: "Entry not found", success: false });
    }

    await entry.update({
      date,
      Name,
      Department,
      category,
      Designation,
      age,
      injury,
      Treatment,
      Refer_To: Refer_To || null,
      Admit: Admit || null,
      FollowUp_Date: FollowUp_Date || null,
      Discharge: Discharge || null,
      Return_to_Duty: Return_to_Duty || null,
      BillAmount: BillAmount || null,
    });

    return res.status(200).json({
      message: "Injury entry updated successfully",
      entry,
      success: true,
    });
  } catch (error) {
    console.error("Error updating Injury data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadexceldata = async (req, res) => {
  const origin = req.user.origin || req.headers["x-origin"];
  const db = getDbByOrigin(origin);
  const Injury = defineInjuryModel(db);
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file uploaded", success: false });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const jsondata = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (jsondata.length === 0) {
      return res
        .status(400)
        .json({ message: "No data found in the file", success: false });
    }

    const parseDate = (value) => {
      if (!value) return null;

      // If it's already a Date object
      if (value instanceof Date) return value;

      // If it's a number (Excel serial date)
      if (typeof value === "number") {
        // Excel serial date to JS Date (starting from Jan 1, 1900)
        return new Date(Math.round((value - 25569) * 86400 * 1000));
      }

      if (typeof value === "string") {
        const cleaned = value.trim();
        const separator = cleaned.includes("/")
          ? "/"
          : cleaned.includes("-")
          ? "-"
          : null;

        if (separator) {
          const parts = cleaned.split(separator);
          if (parts.length === 3) {
            // Ensure dd-mm-yyyy → yyyy-mm-dd
            const [dd, mm, yyyy] = parts;
            return new Date(`${yyyy}-${mm}-${dd}`);
          }
        }

        // Try as fallback
        const fallbackDate = new Date(value);
        return isNaN(fallbackDate.getTime()) ? null : fallbackDate;
      }

      return null;
    };

    const formattedData = jsondata.map((row) => ({
      ...row,
      date: parseDate(row.date),
      FollowUp_Date: parseDate(row.FollowUp_Date),
      Discharge: parseDate(row.Discharge),
      Return_to_Duty: parseDate(row.Return_to_Duty),
      age: row.age ? Number(row.age) : null,
    }));

    console.log("Raw Excel data:", jsondata);
    console.log("Formatted data:", formattedData);

    // ✅ Use bulkCreate for inserting multiple rows
    const inserted = await Injury.bulkCreate(formattedData);

    return res.status(201).json({
      message: "Data uploaded successfully",
      data: inserted,
      success: true,
    });
  } catch (error) {
    console.error("Error uploading data:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
