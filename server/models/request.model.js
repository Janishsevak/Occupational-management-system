import { DataTypes } from 'sequelize';

export const defineDeleteRequestModel = (sequelize) => {
   return sequelize.define('DeleteRequest', {
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recordId: {
      type:DataTypes.JSON,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    }
  }, {
    timestamps: true,
    tableName: 'delete_requests',
  });
 
};