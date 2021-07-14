const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error.js");
const placesRouter = require("./routes/places-routes");
const userRouter = require("./routes/users-routes");
const app = express();

// const mongoPractice = require("./mongo/mongoose")

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
// app.post('/products',mongoPractice.createProduct);
// app.get('/products',mongoPractice.getProducts)
app.use("/api/places", placesRouter);
app.use("/api/users", userRouter);
// no route found error
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  return next(error);
});

// // error handling middleware

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});
const url ="mongodb+srv://ImitaSingha:AF0opguAlOJd4EP5@cluster0.wkn3w.mongodb.net/mern?retryWrites=true&w=majority";
mongoose.connect(url,{ user: process.env.MONGO_USER, pass: process.env.MONGO_PASSWORD, useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  app.listen(5000);
}).catch(err=>console.log("!ERROR", err))

