const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date, //set the data type to date
        default: Date.now //set the default value to the current time
    }
});

module.exports = mongoose.model("Review", reviewSchema);
