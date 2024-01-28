const express = require('express');
const authController = require('../Controllers/AuthController')
const router = express.Router()

router.post('/signup', authController.sign_up);
router.get("/signup", (req,res) => {
    res.send("Test")
})


module.exports = router;