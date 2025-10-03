// controllers/categoryContoller.js
import { Category } from "../models/index.js";
import { Op } from "sequelize";

/**
 * @swagger
 * tags: [Categories]
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category for the authenticated user
 *     tags: [Categories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categories'
 *     responses:
 *       "201":
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categories'
 *       "400":
 *         $ref: '#/components/responses/400'
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const createCategory = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const category = await Category.create({ name, userId });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Category name must be unique!" });
  }
};

/**
 * @swagger
 *   /categories:
 *     get:
 *       summary: Get all categories or search according to their name
 *       tags: [Categories]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *             required: false
 *             description: name of category search for
 *       responses:
 *         "200":
 *            description: "The list of all categories"
 *            contents:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Categories'
 *         "400":
 *            $ref: '#/components/responses/400'
 *         "401":
 *            $ref: '#/components/responses/401'
 *         "404":
 *            $ref: '#/components/responses/404'
 *         "500":
 *            $ref: '#/components/responses/500'
 */
export const getCategories = async (req, res) => {
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
    const categories = await Category.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update a category
 *     tags: [Categories]
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
 *             $ref: '#/components/schemas/Categories'
 *     responses:
 *       "201":
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categories'
 *       "400":
 *         $ref: '#/components/responses/400'
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const category = await Category.findOne({
      where: { id, userId },
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) category.name = name;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: "Category name must be unique" });
  }
};

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
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
 *         description: Category deleted successfully
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
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOne({ where: { id } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
