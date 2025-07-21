// import mongoose from "mongoose";

// const adminSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     username: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     isAdmin: {
//         type: Boolean,
//         default: true,
//     },
    
// }, {
//     timestamps: true, // Automatically manage createdAt and updatedAt fields
// });

// const Admin = mongoose.model("Admin", adminSchema);
// export default Admin;

// models/Admin.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sqldb.js'; // your Sequelize instance

const Admin = sequelize.define('Admin', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true,
  tableName: 'admins',
});

export default Admin;
