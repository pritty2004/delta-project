const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// List all listings & create a new listing
router
  .route("/")
  .get(wrapAsync(listingController.index)) // ✅ function reference, not invocation
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing) // ✅ no parentheses
  );

// Show form to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, update, or delete a specific listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// Show edit form for a specific listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;