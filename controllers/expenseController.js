import { Category, Expense, Wallet } from "../models/index.js";
import { Op } from "sequelize";

/**
 * @swagger
 * tags: [Expenses]
 */

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense for the authenticated user
 *     tags: [Expenses]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expenses'
 *     responses:
 *       "201":
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expenses'
 *       "400":
 *         $ref: '#/components/responses/400'
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const createExpense = async (req, res) => {
  const { description, amount, date, categoryId, walletId } = req.body;
  const userId = req.user.id;

  try {
    const wallet = await Wallet.findByPk(walletId);
    if (!wallet || wallet.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Wallet not found or does not belong to user" });
    }

    const category = await Category.findByPk(categoryId);
    if (!category || category.userId !== userId) {
      return res.status(404).json({
        message: "Category not found or user haven't created category yet",
      });
    }
    const expense = await Expense.create({
      description,
      amount,
      date,
      categoryId,
      walletId,
      userId,
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 *   /expenses:
 *     get:
 *       summary: Get all expenses with filtering, sorting, and searching
 *       tags: [Expenses]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *             required: false
 *             description: name of expense search for
 *         - in: query
 *           name: categoryId
 *           schema:
 *             type: integer
 *             required: false
 *             description: Filter expenses by category ID.
 *         - in: query
 *           name: min_amount
 *           schema:
 *             type: number
 *             required: false
 *             description: Filter expenses with an amount greater than or equal to this value.
 *         - in: query
 *           name: max_amount
 *           schema:
 *             type: number
 *             required: false
 *             description: Filter expenses with an amount less than or equal to this value.
 *         - in: query
 *           name: sort
 *           schema:
 *             type: string
 *             enum: [amount, date]
 *             description: The column to sort by (amount or date).
 *         - in: query
 *           name: order
 *           schema:
 *             type: string
 *             enum: [asc, desc]
 *             description: The sort order (asc or desc).
 *       responses:
 *         "200":
 *            description: "The list of all expenses"
 *            contents:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Expenses'
 *         "400":
 *            $ref: '#/components/responses/400'
 *         "401":
 *            $ref: '#/components/responses/401'
 *         "404":
 *            $ref: '#/components/responses/404'
 *         "500":
 *            $ref: '#/components/responses/500'
 */
export const getExpenses = async (req, res) => {
  const userId = req.user.id;
  const { search, categoryId, min_amount, max_amount, sort, order } = req.query;
  let whereClause = { userId };
  let orderBy = [["date", "DESC"]];

  // Logic for filtering
  if (search) {
    whereClause.description = { [Op.iLike]: `%${search}%` };
  }
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }
  if (min_amount || max_amount) {
    whereClause.amount = {
      [Op.between]: [min_amount || 0, max_amount || 999999],
    };
  }

  // Logic for sorting
  if (sort && order) {
    orderBy = [[sort, order.toUpperCase()]];
  }

  try {
    const expenses = await Expense.findAll({
      where: whereClause,
      order: orderBy,
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /expenses/{id}:
 *   patch:
 *     summary: Update a expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expenses'
 *     responses:
 *       "201":
 *         description: Expense updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expenses'
 *       "400":
 *         $ref: '#/components/responses/400'
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { description, amount, date, categoryId, walletId } = req.body;
  const userId = req.user.id;

  try {
    const expense = await Expense.findOne({ where: { id, userId } });
    if (!expense) {
      return res.status(404).json({
        message: "Expense not found or does not belong to user",
      });
    }

    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    if (date) expense.date = date;
    if (categoryId) expense.categoryId = categoryId;
    if (walletId) expense.walletId = walletId;

    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete a expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       "200":
 *         description: Expense deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       "400":
 *         $ref: '#/components/responses/400'
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const expense = await Expense.findOne({ where: { id, userId } });
    if (!expense) {
      return res
        .status(404)
        .json({ message: "Expense not found or does not belong to user" });
    }

    await expense.destroy();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
