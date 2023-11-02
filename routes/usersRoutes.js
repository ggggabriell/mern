const express = require("express");
const { check } = require("express-validator");

const usercontroller = require('../controllers/usersController');

const router = express.Router();


router.get("/", usercontroller.getUsers);

router.post("/signup", 
[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6})
],
usercontroller.signup);

router.post("/login", usercontroller.login);



module.exports = router;
