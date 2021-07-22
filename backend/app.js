// import default file system from nodejs
const fs = require('fs');
const path = require('path');

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
// upload file middleware 
app.use('/uploads/images',express.static(path.join('uploads','images')))
// CORs error handing part.Please add this middleware function before routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});
mongoose
  .connect(
    `mongodb+srv://ImitaSingha:Y4ZxnTIMEs8LZmZw@cluster0.wkn3w.mongodb.net/mern?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("connected to 5000 port in backend");
    });
  })
  .catch((err) => {
    console.log("err-->", err);
  });
