import express from "express";
import * as expenseController from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", expenseController.addExpense);

export default router;
