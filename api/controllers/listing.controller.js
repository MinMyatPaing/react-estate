import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      errorHandler(401, "You can only view your own listings");

    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) errorHandler(404, "Listing not found!");

    if (req.user.id !== listing.userRef) {
      errorHandler(401, "You can only delete your own listing!");
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json("Deleted successfully");
  } catch (error) {
    next(error);
  }
};
