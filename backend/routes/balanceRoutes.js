const express = require("express");
const router = express.Router();
const balanceController = require("../controllers/balanceController");

router.get("/:userId", balanceController.getUserBalances);
router.post("/settle", balanceController.settleBalance);

module.exports = router;
