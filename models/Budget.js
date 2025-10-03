import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Budget = sequelize.define("Budget", {
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
  limit: {
    // Correct: A budget has a spending limit.
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  userId: {
    // Correct: Links the budget to a user.
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryId: {
    // Correct: Links the budget to a category.
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Budget;
