// import mongoose from "mongoose";

// const oclMedicalSchema = new mongoose.Schema({
//     date:{
//         type: Date,
//         required: true,
//     },
//     workmenName: {
//         type: String,
//         required: true,
//     },
//     contractorName: {
//         type: String,
//         required: true,
//     },
//     age: {
//         type: Number,
//         required: true,
//     },
//     bpLevel: {
//         type: String,
//         required: true,
//     },
//     height: {
//         type: Number,
//         required: true,
//     },
//     weight: {
//         type: Number,
//         required: true,
//     },
//     hygiene: {
//         type: String,
//         default:null
//     },
//     remark:{
//         type:String,
//         default:null
//     },
//     time: {
//         type: String,
        
//     },
// },{timestamps: true}) // Automatically manage createdAt and updatedAt fields)

// // const OclMedical = mongoose.model("OclMedical", oclMedicalSchema);
// export default oclMedicalSchema;

// models/OclMedical.js
import { DataTypes } from 'sequelize';

export const defineOclMedicalModel = (sequelize) => {
  return sequelize.define('OclMedical', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    workmenName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contractorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bpLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hygiene: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    timestamps: true,
    tableName: 'ocl_medicals',
  });
};
