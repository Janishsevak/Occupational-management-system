import { getDbByOrigin } from "../models/dbconnection.js";
import { defineFTEMedicalModel } from "../models/FTEmedical.model.js";
import xlsx from "xlsx";

export const ftemedicalentry = async (req, res) => {
  const origin = req.headers["x-origin"];
  console.log("Received origin in controller:", origin);

  if (!origin) {
    return res.status(400).json({ message: "Missing origin in headers" });
  }

  const db = getDbByOrigin(origin);
  const FTEmedical = defineFTEMedicalModel(db);
  const {
    date,
    Name,
    EmployeeID,
    Department,
    DOJ,
    DOB,
    Desingation,
    height,
    weight,
    BP,
    cholstrol,
    sugar,
    Hb,
    remarks,
  } = req.body;

  if (
    !date ||
    !Name ||
    !EmployeeID ||
    !Department ||
    !DOJ ||
    !DOB ||
    !Desingation ||
    !height ||
    !weight ||
    !BP ||
    !cholstrol ||
    !sugar ||
    !Hb
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  try {
    await FTEmedical.create({
      date,
      Name,
      EmployeeID,
      Department,
      DOJ,
      DOB,
      Desingation,
      height,
      weight,
      BP,
      cholstrol,
      sugar,
      Hb,
      remarks,
    });
    return res
      .status(201)
      .json({ message: "FTEmedical entry created", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
export const getFTEmedicalentry = async (req, res) => {
  const origin = req.user.origin;
  const db = getDbByOrigin(origin);
  const FTEmedical = defineFTEMedicalModel(db);

  try {
    const entries = await FTEmedical.findAll({ order: [["date", "DESC"]] });
    return res.status(200).json({ entries, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
export const updateFTEmedicalentry = async (req, res) => {
  const origin = req.headers["x-origin"];
  const db = getDbByOrigin(origin);
  const FTEmedical = defineFTEMedicalModel(db);
  const { id } = req.params;
  const {
    date,
    Name,
    EmployeeID,
    Department,
    DOJ,
    DOB,
    Desingation,
    height,
    weight,
    BP,
    cholstrol,
    sugar,
    Hb,
    remarks,
  } = req.body;

  if (
    !date ||
    !Name ||
    !EmployeeID ||
    !Department ||
    !DOJ ||
    !DOB ||
    !Desingation ||
    !height ||
    !weight ||
    !BP ||
    !cholstrol ||
    !sugar ||
    !Hb
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  try {
    const [updated] = await FTEmedical.update(
      {
        date,
        Name,
        EmployeeID,
        Department,
        DOJ,
        DOB,
        Desingation,
        height,
        weight,
        BP,
        cholstrol,
        sugar,
        Hb,
        remarks,
      },
      { where: { id } }
    );
    if (updated) {
      return res
        .status(200)
        .json({ message: "FTEmedical entry updated", success: true });
    }
    return res.status(404).json({ message: "Entry not found", success: false });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
export const deleteFTEmedicalentry = async (req, res) => {
  const origin = req.headers["x-origin"];
  const db = getDbByOrigin(origin);
  const FTEmedical = defineFTEMedicalModel(db);
  const { id } = req.params;
  if (!id){
        return res.status(400).json({ message: 'Entry ID is required' });
    }

  try {
    const deleted = await FTEmedical.destroy({ where: { id } });
    if (deleted) {
      return res
        .status(200)
        .json({ message: "FTEmedical entry deleted", success: true });
    }
    return res.status(404).json({ message: "Entry not found", success: false });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
export const uploadexceldata = async (req, res) => {
  const origin = req.headers["x-origin"];
  console.log("Received origin in controller:", origin);

  if (!origin) {
    return res.status(400).json({ message: "Missing origin in headers" });
  }

  const db = getDbByOrigin(origin);
  const FTEmedical = defineFTEMedicalModel(db);

  try {
    const file = req.file; // via multer middleware
    if (!file) {
      return res
        .status(400)
        .json({ message: "No file uploaded", success: false });
    }

    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Format date fields
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

    const excelData = jsonData.map((row) => ({
      ...row,
      date: parseDate(row.date),
      height: row.height ? parseFloat(row.height) : null,
      weight: row.weight ? parseFloat(row.weight) : null,
      DOJ: parseDate(row.DOJ),
      DOB: parseDate(row.DOB),
    }));

    if (excelData.length === 0) {
      return res
        .status(400)
        .json({ message: "No data found in the file", success: false });        
    }
    await FTEmedical.bulkCreate(excelData);
    return res
      .status(201)
      .json({
        message: "FTEmedical entries created from excel",
        success: true,
      });
  } catch (error) {
    console.error("Error uploading Excel:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
