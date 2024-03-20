import express from "express";
import {
  createListing,
  getUserListing,
  deleteListing,
  updateListing,
  getListingById,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.get('/get-listings', getListings);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListingById);
router.get("/:id", verifyToken, getUserListing);

export default router;
