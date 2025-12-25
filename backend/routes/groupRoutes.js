const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.post("/", groupController.createGroup);
router.post("/:groupId/add-member", groupController.addMember);

module.exports = router;
