const express = require("express");
const router = express.Router(); //router method 

//USERES ROUTE CREATE....
//Index - users
router.get("/", (req, res) =>{
    res.send("GET for users");
});

//show - users
router.get("/:id", (req, res) =>{
    res.send("GET for show users id");
});

//POST - users
router.post("/", (req, res) =>{
    res.send("POST for users");
});

//DELETE - users
router.delete("/:id", (req, res) =>{
    res.send("DELETE for users id");
});

module.exports = router;