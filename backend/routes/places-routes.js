const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");
const placesControllers = require("../controllers/places-controller");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

/* this middleware will check for the valid token and only then it will
 allow to reach the below middlewares for post, patch, delete functionalities
*/

router.use(checkAuth);

router.post(
  "/",
  // within the single method we have to pass the name which we will be getting in the body from the frontend data
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
