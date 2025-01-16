const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysecretstring",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.successMsg = req.flash("error");
    next();
});

app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;

    if(name == "anonymous") {
        req.flash("error", "user not registered");
    } else {
        req.flash("success", "user registered successfully!");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name });
});


// app.get("/reqcount", (req, res) => {
//   if(req.session.count) { //track the single session
//    req.session.count++ ; 
// } else {
//     req.session.count = 1;
// }
//    res.send(`you send a request ${req.session.count} times`);
// });

app.get("/test", (req, res) => {
    res.send('test successfull');
});

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-in", "India", {signed: true});
//     res.send("signed cookie send");
// });

// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste");
//     res.cookie("MadeIn", "India");
//     res.send("send you some cookies");
// });

// app.get("/greet", (req, res) => {
//   let {name = "anonymous"} = req.cookies;
//   res.send(`Hi, ${name}`);
// });


app.get("/", (req, res) =>{
    console.dir(req.cookies);
    res.send("Hi, I am root!");
});


// //for require users and posts
// app.use("/users", users); // all the / firstly match the all routes then execute..
// app.use("/posts", posts);


app.listen(3000, () => {
    console.log("server is listening to 3000");
});