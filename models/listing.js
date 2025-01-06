const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: {
         type: String,
        default:
            "https://www.istockphoto.com/photo/beautiful-sunset-or-sunrise-with-silhouette-palm-tree-on-tropical-island-gm1177664565-328862357",
        set: (v) => v === "" 
        ? "https://www.istockphoto.com/photo/beautiful-sunset-or-sunrise-with-silhouette-palm-tree-on-tropical-island-gm1177664565-328862357" 
        : v,   
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete",async (listing) => {
    if(listing) {
     await Review.deleteMany({_id: {$in: listing.reviews}});
   }
 });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;