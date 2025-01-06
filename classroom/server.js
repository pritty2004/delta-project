const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

app.get("/", (req, res) =>{
    res.send("Hi, I am root!");
});

//for require users and posts
app.use("/users", users); // all the / firstly match the all routes then execute..
app.use("/posts", posts);


app.listen(3000, () => {
    console.log("server is listening to 3000");
});