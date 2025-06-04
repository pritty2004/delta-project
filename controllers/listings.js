const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("owner")
    .populate("reviews");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show", {
    listing,
    currentUser: req.user,
    mapToken: process.env.MAP_TOKEN
  });
};
module.exports.createListing = async (req, res, next) => {
    try {
        const response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location, // You can change this to req.body.listing.location if needed
                limit: 1,
            })
            .send();

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        } else {
            console.log("No image uploaded");
        }
        newListing.geometry = (response.body.features[0].geometry);

        let savedListing = await newListing.save();
        console.log(savedListing);
        
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        console.error("Error in createListing:", err);
        next(err);
    }
};

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    // Push the review's ID into the listing's reviews array
    listing.reviews.push(newReview);

    await newReview.save(); // ✅ Save the review
    // Don't call listing.save() unless you're updating its own data

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    // Optional: modify URL if needed for frontend image resizing
    // listing.image.url = listing.image.url.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if (req.file) {
        updatedListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await updatedListing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (deletedListing) {
        req.flash("success", "Listing Deleted!");
    } else {
        req.flash("error", "Listing not found.");
    }

    res.redirect("/listings");
};
