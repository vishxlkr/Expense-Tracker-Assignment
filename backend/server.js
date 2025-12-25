const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const asyncHandler = require("./middlewares/asyncHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
a;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/balances", require("./routes/balanceRoutes"));

// Health check endpoint
app.get("/health", (req, res) => {
   res.status(200).json({ message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
   res.status(404).json({ error: "Route not found" });
});

// Global error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
