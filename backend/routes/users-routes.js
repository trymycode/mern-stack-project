const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/users-controller");
const {check} = require("express-validator");

router.get("/", userControllers.getUsers);
router.post("/signup",[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6})
], userControllers.signup);
router.post("/login",[
   
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6})
], userControllers.login);

module.exports = router;
