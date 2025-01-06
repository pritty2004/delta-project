const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../shcema.js");
const Listing = require("../models/listing.js");


//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//validation for schema in middlewares
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//Index Route
router.get("/", wrapAsync (async (req, res) => {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
})
);

//Show Route 
router.get("/:id", wrapAsync (async (req, res) => {
    let { id } = req.params;
    console.log(id);
   const listing = await Listing.findById(id).populate("reviews");
   res.render("listings/show.ejs", { listing });
   //res.send("done");
})
);




//Create Route
router.post("/", 
    validateListing, 
    wrapAsync (async (req, res, next) => { 
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
 })
);

//Edit Route
router.get("/:id/edit", wrapAsync (async (req, res) => {
    let { id } = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/edit.ejs", { listing });
})
);

//Update Route 
router.put("/:id", 
    validateListing,
    wrapAsync (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})
);


//Delete Route 

router.delete("/:id", wrapAsync (async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})
);

module.exports = router;