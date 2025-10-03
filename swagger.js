import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker API",
      version: "1.0.0",
      description: "API for a personal expense tracking application.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "User authentication and management",
      },
      {
        name: "Categories",
        description: "Category management endpoints",
      },
      {
        name: "Budgets",
        description: "Budget management endpoints",
      },
      {
        name: "Wallets",
        description: "Wallet management endpoints",
      },
      {
        name: "Expenses",
        description: "Expense management endpoints",
      },
      {
        name: "Reports",
        description: "Financial reports and summaries",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Users: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: {
              type: "string",
              description: "The username of the user",
            },
            email: {
              type: "string",
              description: "The email of the user",
            },
            password: {
              type: "string",
              description: "The password of the user",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              description: "The user's email.",
            },
            password: {
              type: "string",
              description: "The user's password.",
            },
          },
        },
        UserDataResponse: {
          type: "object",
          properties: {
            id: { type: "integer" },
            email: { type: "string" },
            token: { type: "string" },
          },
        },
        Categories: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              description: "The name of the category",
            },
          },
        },
        Budgets: {
          type: "object",
          required: ["name", "limit", "categoryId"],
          properties: {
            name: {
              type: "string",
              description: "The name of the budget",
            },
            limit: {
              type: "number",
              description: "The spending limit for the budget",
            },
            categoryId: {
              type: "integer",
              description: "The ID of the category the budget belongs to",
            },
          },
        },
        Wallets: {
          type: "object",
          required: ["name", "balance"],
          properties: {
            name: {
              type: "string",
              description: "The name of the wallet",
            },
            balance: {
              type: "string",
              description: "The balance of the wallet",
            },
          },
        },
        Expenses: {
          type: "object",
          required: ["description", "amount", "date", "categoryId", "walletId"],
          properties: {
            description: {
              type: "text",
              description: "The description of the expense",
            },
            amount: {
              type: "number",
              description: "The amount of the expense",
            },
            date: {
              type: "string",
              format: "date",
              description: "The date of the expense",
            },
            categoryId: {
              type: "integer",
              description: "The ID of the category the expense belongs to",
            },
            walletId: {
              type: "integer",
              description: "The ID of the wallet the expense belongs to",
            },
          },
        },
        TotalSpentByCategory: {
          type: "object",
          properties: {
            totalSpent: {
              type: "number",
              description: "Total amount spent in the category.",
            },
            "category.name": {
              type: "string",
              description: "The name of the category.",
            },
          },
        },
        BudgetsLimitByCategory: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Category name.",
            },
            totalSpent: {
              type: "number",
              description: "Total amount spent in the category.",
            },
            "budgets.limit": {
              type: "number",
              description: "The budgets limit of the category.",
            },
          },
        },
        WalletBalance: {
          type: "object",
          properties: {
            totalSpent: {
              type: "number",
              description: "Total amount spent from the wallet.",
            },
            wallet: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                balance: { type: "string" },
              },
            },
          },
        },
        MonthlySummary: {
          type: "object",
          properties: {
            month: {
              type: "string",
              format: "date",
              description: "The start date of the month.",
            },
            totalSpent: {
              type: "number",
              description: "Total amount spent in that month.",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "A descriptive error message.",
            },
          },
        },
      },
      responses: {
        AuthSuccessResponse: {
          description: "User created successfully.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserDataResponse",
              },
            },
          },
        },
        LogInSuccessResponse: {
          description: "User logged in successfully.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserDataResponse",
              },
            },
          },
        },
        400: {
          description: "Bad Request.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        401: {
          description: "Unauthorized.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        404: {
          description: "Not found.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        500: {
          description: "Server error.",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./controllers/*.js", "./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
