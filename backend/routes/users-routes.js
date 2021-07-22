const express = require('express');
const { check } = require('express-validator');
const usersController = require('../controllers/users-controller');

const router = express.Router();
const fileUpload = require('../middleware/file-upload');
router.get('/', usersController.getUsers);

router.post(
  '/signup',
  // within the single method we have to pass the name which we will be getting in the body from the frontend data
   fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
