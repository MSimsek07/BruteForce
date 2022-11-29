const express = require("express"); // Import express
const router = express.Router(); // Create express router
const {
  signup,
  login,
} = require("../controllers/user-controller");
 // Import user model

// Routes
router.post("/signup", signup);
router.post("/login", login);


module.exports = router;
