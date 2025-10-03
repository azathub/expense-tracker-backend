import { Budget, Category } from "../models/index.js";
import { Op } from "sequelize";

/**
 * @swagger
 * tags: [Budgets]
 */

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Create a new budget for the authenticated user
 *     tags: [Budgets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Budgets'
 *     responses:
 *       "201":
 *         description: Budget created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Budgets'
 *       "400":
 *         $ref: '#/components/responses/400'
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const createBudget = async (req, res) => {
  const { name, limit, categoryId } = req.body;
  const userId = req.user.id;

  try {
    const category = await Category.findOne({
      where: { id: categoryId, userId },
    });
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found or does not belong to user" });
    }
    const budget = await Budget.create({ name, limit, userId, categoryId });
    res.status(201).json(budget);
  } catch (error) {
    res
      .status(400)
      .json({ message: "A budget already exists for this category" });
  }
};

/**
 * @swagger
 *   /budgets:
 *     get:
 *       summary: Get all budgets or search according to their name
 *       tags: [Budgets]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *             required: false
 *             description: name of budget search for
 *       responses:
 *         "200":
 *            description: "The list of all budgets"
 *            contents:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Budgets'
 *         "400":
 *            $ref: '#/components/responses/400'
 *         "401":
 *            $ref: '#/components/responses/401'
 *         "404":
 *            $ref: '#/components/responses/404'
 *         "500":
 *            $ref: '#/components/responses/500'
 */
export const getBudgets = async (req, res) => {
  const userId = req.user.id;
  const { search } = req.query;
  let whereClause = { userId };

  if (search) {
    whereClause = {
      ...whereClause,
      name: {
        [Op.iLike]: `%${search}%`,
      },
    };
  }
  try {
    const budgets = await Budget.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
    });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /budgets/{id}:
 *   patch:
 *     summary: Update a budget
 *     tags: [Budgets]
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
 *             $ref: '#/components/schemas/Budgets'
 *     responses:
 *       "201":
 *         description: Budget created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Budgets'
 *       "400":
 *         $ref: '#/components/responses/400'
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const updateBudget = async (req, res) => {
  const { id } = req.params;
  const { name, limit } = req.body;
  const userId = req.user.id;

  try {
    const budget = await Budget.findOne({ where: { id, userId } });
    if (!budget) {
      return res
        .status(404)
        .json({ message: "Budget not found or does not belong to user" });
    }

    if (name) budget.name = name;
    if (limit) budget.limit = limit;

    await budget.save();
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budgets]
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
 *         description: Budget deleted successfully
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
export const deleteBudget = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const budget = await Budget.findOne({ where: { id, userId } });
    if (!budget) {
      return res
        .status(404)
        .json({ message: "Budget not found or does not belong to user" });
    }

    await budget.destroy();
    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
