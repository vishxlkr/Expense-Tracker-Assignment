import express from "express";
import * as balanceController from "../controllers/balanceController.js";

const router = express.Router();

router.get("/:userId", balanceController.getUserBalances);
router.post("/settle", balanceController.settleBalance);

export default router;
