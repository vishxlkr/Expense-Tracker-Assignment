import express from "express";
import * as groupController from "../controllers/groupController.js";

const router = express.Router();

router.post("/", groupController.createGroup);
router.post("/:groupId/add-member", groupController.addMember);

export default router;
