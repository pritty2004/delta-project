if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ✅ Fallback for local development
const dbUrl = process.env.ATLAS_URL || "mongodb://127.0.0.1:27017/wanderlust";

// ✅ Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to database");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
}
main();

// ✅ View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // ✅ FIX: was dirname (undefined), now __dirname

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ✅ Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", function (err) {
  console.log("❌ Mongo session store error:", err);
});

// ✅ Session Config
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

// ✅ Passport Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Flash + Current User
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ✅ Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ✅ 404 Catch-All
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (statusCode !== 404) console.error(err);
  res.status(statusCode).render("error", { err });
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});