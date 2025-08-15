import { defineFTEMedicalModel } from "../models/FTEmedical.model.js";
import { defineInjuryModel } from "../models/injury.model.js";
import { defineOclMedicalModel } from "../models/oclmedical.js";
import { defineDailyMedicalModel } from "../models/dailymedical.js";

// Function: returns Sequelize model based on string name
export const getModelByName = (db, modelName) => {
  const models = {
    fte_medicals: defineFTEMedicalModel(db),
    injuries: defineInjuryModel(db),
    ocl_medicals: defineOclMedicalModel(db),
    daily_medicals: defineDailyMedicalModel(db),
  };

  return models[modelName] || null; // null if name is not found
};

// Optional: list of all valid model names (for validation)
export const VALID_MODELS = ["fte_medicals", "injuries", "ocl_medicals", "daily_medicals"];