// controllers/authController.js
import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * @swagger
 * tags: [Users]
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       "201":
 *         $ref: '#/components/responses/AuthSuccessResponse'
 *       "400":
 *         $ref: '#/components/responses/400'
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if (username && email && password) {
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        id: user.id,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res
        .status(400)
        .json({ message: "All the fields are required one is missing" });
    }
  } catch (error) {
    res.status(400).json({ message: "User already exists" });
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an authenticated user and get JWT token to continue
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/LogInSuccessResponse'
 *       "400":
 *         $ref: '#/components/responses/400'
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
/**
 * @swagger
 * /auth/account:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       "200":
 *         description: Account deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
