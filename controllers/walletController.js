import { Op } from "sequelize";
import { Wallet } from "../models/index.js";

/**
 * @swagger
 * tags: [Wallets]
 */

/**
 * @swagger
 * /wallets:
 *   post:
 *     summary: Create a new wallet for the authenticated user
 *     tags: [Wallets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Wallets'
 *     responses:
 *       "201":
 *         description: Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallets'
 *       "400":
 *         $ref: '#/components/responses/400'
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const createWallet = async (req, res) => {
  const { name, balance } = req.body;
  const userId = req.user.id;

  try {
    const wallet = await Wallet.create({ name, balance, userId });
    res.status(201).json(wallet);
  } catch (error) {
    res.status(400).json({ message: "Wallet name must be unique" });
  }
};

/**
 * @swagger
 *   /wallets:
 *     get:
 *       summary: Get all wallets or search according to their name
 *       tags: [Wallets]
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *             required: false
 *             description: name of wallet search for
 *       responses:
 *         "200":
 *            description: "The list of all wallets"
 *            contents:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Wallets'
 *         "400":
 *            $ref: '#/components/responses/400'
 *         "401":
 *            $ref: '#/components/responses/401'
 *         "404":
 *            $ref: '#/components/responses/404'
 *         "500":
 *            $ref: '#/components/responses/500'
 */
export const getWallets = async (req, res) => {
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
    const wallets = await Wallet.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
    });
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /wallets/{id}:
 *   patch:
 *     summary: Update a wallet
 *     tags: [Wallets]
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
 *             $ref: '#/components/schemas/Wallets'
 *     responses:
 *       "201":
 *         description: Wallet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallets'
 *       "400":
 *         $ref: '#/components/responses/400'
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 */
export const updateWallet = async (req, res) => {
  const { id } = req.params;
  const { name, balance } = req.body;
  const userId = req.user.id;

  try {
    const wallet = await Wallet.findOne({ where: { id, userId } });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found!" });
    }
    if (name) wallet.name = name;
    if (balance) wallet.balance = balance;

    await wallet.save();
    res.status(200).json(wallet);
  } catch (error) {
    res.status(400).json({ message: "Wallet name must be unique" });
  }
};

/**
 * @swagger
 * /wallets/{id}:
 *   delete:
 *     summary: Delete a wallet
 *     tags: [Wallets]
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
 *         description: Wallet deleted successfully
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
export const deleteWallet = async (req, res) => {
  const { name } = req.params;
  const userId = req.user.id;

  try {
    const wallet = await Wallet.findOne({ where: { name, userId } });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    await wallet.destroy();
    res.status(200).json({ message: "Wallet deleted successfully" });
  } catch (error) {}
};
