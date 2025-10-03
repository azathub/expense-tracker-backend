import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Wallet = sequelize.define("Wallet", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2), // Corrected to specify precision and scale
    allowNull: false,
  },
  userId: {
    // This is the essential foreign key
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Wallet;
