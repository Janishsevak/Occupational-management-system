// import mongoose from "mongoose";


// const InjurySchema = new mongoose.Schema({
//     date:{
//         type:Date,
//         required:true
//     },
//     Name:{
//         type:String,
//         required:true
//     },
//     Department:{
//         type:String,
//         required:true
//     },
//     age:{
//         type:Number,
//         required:true
//     },
//     category:{
//         type:String,
//         required:true
//     },
//     Designation:{
//         type:String,
//         required:true
//     },
//     injury:{
//         type:String,
//         required:true
//     },
//     Treatment:{
//         type:String,
//         required:true
//     },
//     Refer_To:{
//         type:String
//     },
//     Admit:{
//         type:String
//     },
//     FollowUpDate:{
//         type:Date
//     },
//     Discharge:{
//         type:Date
//     },
//     Return_to_Duty:{
//         type:Date
//     },
//     BillAmount:{
//         type:Number
//     }
// },{timestamps:true})

// export default InjurySchema;

// models/Injury.js
import { DataTypes } from 'sequelize';

export const defineInjuryModel = (sequelize) => {
  return sequelize.define('Injury', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    injury: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Treatment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Refer_To: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Admit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    FollowUp_Date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Discharge: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Return_to_Duty: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    BillAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    request:{
      type:DataTypes.STRING,
      default:null,
    }
  }, {
    timestamps: true,
    tableName: 'injuries',
  });

};

