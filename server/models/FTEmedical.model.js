import { DataTypes } from "sequelize";

export const defineFTEMedicalModel = (sequelize) =>{
    return sequelize.define("FTEmedical",{
    date:{
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
    ,Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    EmployeeID: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    Department: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    DOJ: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    DOB: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    Desingation: {
        type:DataTypes.STRING,
        allowNull:false
  },
    height:{
        type: DataTypes.STRING,
        allowNull: false,   
    },
    weight:{
        type: DataTypes.STRING,
        allowNull: false,   
    },
    BP:{
        type: DataTypes.STRING,
        allowNull: false,   
    },
    cholstrol:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    sugar:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    Hb:{
        type: DataTypes.STRING,
        allowNull: false,   
    },
    remarks:{
        type: DataTypes.STRING,
        allowNull: false,   
    }},{
    timestamps: true,
    tableName: "fte_medicals",
  })};
