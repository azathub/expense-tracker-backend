import { Expense, Category, Wallet, Budget } from "../models/index.js";
import { Sequelize } from "sequelize";

/**
 * @swagger
 * tags: [Reports]
 */

/**
 * @swagger
 *   /reports/totalSpent/byCategory:
 *     get:
 *       summary: Get report for categories with their total spent amount per category
 *       tags: [Reports]
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         "200":
 *            description: "Total spent per category"
 *            contents:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/TotalSpentByCategory'
 *         "400":
 *            $ref: '#/components/responses/400'
 *         "401":
 *            $ref: '#/components/responses/401'
 *         "404":
 *            $ref: '#/components/responses/404'
 *         "500":
 *            $ref: '#/components/responses/500'
 */
export const getTotalSpentByCategory = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.findAll({
      attributes: [
        [Sequelize.fn("sum", Sequelize.col("amount")), "totalSpent"],
      ],
      include: [
        {
          model: Category,
          attributes: ["name"],
          as: "category",
        },
      ],
      where: { userId },
      group: ["category.id", "category.name"],
      order: [[Sequelize.fn("sum", Sequelize.col("amount")), "DESC"]],
      raw: true,
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Sequelize Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 *   /reports/budgets/categoryLimit:
 *     get:
 *       summary: Get report for categories with their budget limit amount per category
 *       tags: [Reports]
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         "200":
 *            description: "Budget limit related with category"
 *            contents:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/BudgetsLimitByCategory'
 *         "400":
 *            $ref: '#/components/responses/400'
 *         "401":
 *            $ref: '#/components/responses/401'
 *         "404":
 *            $ref: '#/components/responses/404'
 *         "500":
 *            $ref: '#/components/responses/500'
 */
export const getBudgetsLimitByCategory = async (req, res) => {
  const userId = req.user.id;

  try {
    const summary = await Category.findAll({
      attributes: [
        "name",
        [Sequelize.fn("sum", Sequelize.col("expenses.amount")), "totalSpent"],
      ],
      include: [
        {
          model: Budget,
          attributes: ["limit"],
          as: "budgets",
          where: { userId },
          required: false,
        },
        {
          model: Expense,
          attributes: [],
          as: "expenses",
          where: { userId },
          required: false,
        },
      ],
      where: { userId },
      group: ["Category.id", "budgets.id"],
      order: [["name", "ASC"]],
      raw: true,
    });
    res.status(200).json(summary);
  } catch (error) {
    console.error("Sequelize Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 *   /reports/wallets/balances:
 *     get:
 *       summary: Get report for wallets with total spent amount and the wallet detail
 *       tags: [Reports]
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         "200":
 *            description: "Wallet detail with total spent amount"
 *            contents:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/WalletBalance'
 *         "400":
 *            $ref: '#/components/responses/400'
 *         "401":
 *            $ref: '#/components/responses/401'
 *         "404":
 *            $ref: '#/components/responses/404'
 *         "500":
 *            $ref: '#/components/responses/500'
 */
export const getWalletBalance = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.findAll({
      attributes: [
        [Sequelize.fn("sum", Sequelize.col("amount")), "totalSpent"],
      ],
      include: [
        {
          model: Wallet,
          attributes: ["id", "name", "balance"],
          as: "wallet",
        },
      ],
      where: { userId },
      group: ["wallet.id", "wallet.name", "wallet.balance"],
      order: [[Sequelize.fn("sum", Sequelize.col("amount")), "DESC"]],
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 *   /reports/expenses/monthlySummary:
 *     get:
 *       summary: Get report for monthly total spent
 *       tags: [Reports]
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         "200":
 *            description: "Monthly total spent summary"
 *            contents:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/MonthlySummary'
 *         "400":
 *            $ref: '#/components/responses/400'
 *         "401":
 *            $ref: '#/components/responses/401'
 *         "404":
 *            $ref: '#/components/responses/404'
 *         "500":
 *            $ref: '#/components/responses/500'
 */
export const getMonthlyExpenseSummary = async (req, res) => {
  const userId = req.user.id;

  try {
    const monthlySummary = await Expense.findAll({
      attributes: [
        [Sequelize.fn("date_trunc", "month", Sequelize.col("date")), "month"],
        [Sequelize.fn("sum", Sequelize.col("amount")), "totalSpent"],
      ],
      where: { userId },
      group: [Sequelize.fn("date_trunc", "month", Sequelize.col("date"))],
      order: [
        [Sequelize.fn("date_trunc", "month", Sequelize.col("date")), "DESC"],
      ],
    });

    res.status(200).json(monthlySummary);
  } catch (error) {
    console.error("Sequelize Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
