import sequelize from "../config/database.js";
import User from "./User.js";
import Expense from "./Expense.js";
import Category from "./Category.js";
import Wallet from "./Wallet.js";
import Budget from "./Budget.js";

// One-to-many relationships (from the "one" side)
User.hasMany(Expense, {
  foreignKey: "userId",
  as: "expenses",
});

User.hasMany(Category, {
  foreignKey: "userId",
  as: "categories",
});

User.hasMany(Wallet, {
  foreignKey: "userId",
  as: "wallets",
});

User.hasMany(Budget, {
  // Correct: A user can have many budgets.
  foreignKey: "userId",
  as: "budgets",
});

Category.hasMany(Expense, {
  foreignKey: "categoryId",
  as: "expenses",
});

Category.hasMany(Budget, {
  // Correct: A category can have many budgets.
  foreignKey: "categoryId",
  as: "budgets",
});

Wallet.hasMany(Expense, {
  foreignKey: "walletId",
  as: "expenses",
});

// Inverse relationships (from the "many" side)
Expense.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Expense.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

Expense.belongsTo(Wallet, {
  foreignKey: "walletId",
  as: "wallet",
});

Category.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Wallet.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Budget.belongsTo(User, {
  // Correct: A budget belongs to a user.
  foreignKey: "userId",
  as: "user",
});

Budget.belongsTo(Category, {
  // Correct: A budget belongs to a category.
  foreignKey: "categoryId",
  as: "category",
});

export { sequelize, User, Expense, Category, Wallet, Budget };
