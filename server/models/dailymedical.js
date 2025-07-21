// import mongoose from "mongoose";

// const dailyMedicalSchema = new mongoose.Schema({
//     date:{
//         type: Date,
//         required: true,
//     },
//     Name: {
//         type: String,
//         required: true,
//     },
//     Department: {
//         type: String,
//         required: true,
//     },
//     category: {
//         type: String,
//         required: true,
//     },
//     Designation: {
//         type: String,
//         required: true,
//     },
//     age: {
//         type: Number,
//         required: true,
//     },
//     purpose: {
//         type: String,
//         required: true,
//     },
//     Treatment: {
//         type: String,
//         required:true
//     }
// },{timestamps: true})

// // const DailyMedical = mongoose.model("DailyMedical",dailyMedicalSchema)
// export default dailyMedicalSchema;

// models/DailyMedical.js
import { DataTypes } from 'sequelize';


export const defineDailyMedicalModel = (sequelize) => {
  return sequelize.define('DailyMedical', {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    Name: { type: DataTypes.STRING, allowNull: false },
    Department: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    Designation: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    purpose: { type: DataTypes.STRING, allowNull: false },
    Treatment: { type: DataTypes.STRING, allowNull: false },
  }, {
    timestamps: true,
    tableName: 'daily_medicals',
  });
};
