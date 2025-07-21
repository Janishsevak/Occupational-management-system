// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
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
//         default: false,
//     },
//     origin:{
//         type:String,
//         required:true,
//     }
// }, {
//     timestamps: true, // Automatically manage createdAt and updatedAt fields
// });

// const User = mongoose.model("User", userSchema);
// export default User;

// models/User.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/sqldb.js'; // your Sequelize instance

const User = sequelize.define('User', {
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
    defaultValue: false,
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true, // adds createdAt and updatedAt
});

export default User;
