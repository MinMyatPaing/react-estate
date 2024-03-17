import express from "express";
import {
  createListing,
  getUserListing,
  deleteListing
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.get("/:id", verifyToken, getUserListing);

export default router;
