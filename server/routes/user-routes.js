const express = require("express"); // Import express
const router = express.Router(); // Create express router
const {
  signup,
  login,
  getUser,
  verification,
  setCookieToken,
} = require("../controllers/user-controller");
const User = require("../model/User"); // Import user model
const jwt = require("jsonwebtoken"); // Import jsonwebtoken
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
// const mongoose = require("mongoose");

// Controllers
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "3muharremcandan@gmail.com", //mail
    pass: "bfhzrcursrxhoopj", //pass
  },
});

const getUsers = async (req, res, next) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json(users);
};

const updateVerified = async (req, res, next) => {
  // Update verified
  const { id } = req.body;
  User.findOneAndUpdate({ _id: id }, { verified: true }) // Update verified
    .then((result) => {
      res.status(200).json(result);
    });
};

const firstEmailVerification = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ message: "User not found. Please signup!" }); // Return error if user doesn't exist
  }

  const options = {
    from: "ForgotPassword@gmail.com",
    to: email,
    subject: "First Email Verification",
    text: `Go to http://localhost:3000/update-verified/${user._id}`,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return res.status(200).json({
    message: `Go to http://localhost:3000/update-verified/${user._id}`,
    id: user._id,
  });
};

const firstEmailVerificationUniqueLink = async (req, res) => {
  const { id } = req.params;

  const users = await User.find({}).sort({ createdAt: -1 });
  const user = users.map((user) => {
    if (user._id == id) {
      return user._id.toString();
    }
  });

  if (user) {
    User.findOneAndUpdate({ _id: user }, { verified: true }) // Update verified
      .then((result) => {
        res
          .status(200)
          .json({ message: "Successfully Verified!", result: result });
      });
  } else {
    res.status(404).json({ message: "User not found!" });
  }
};

const formatDatabase = async (req, res) => {
  await User.deleteMany({});
  res.status(200).json({ message: "Deleted all users" });
};

const forgotPasswordSendEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ message: "Email not found!" }); // Return error if user doesn't exist
  }

  const options = {
    from: "ForgotPassword@gmail.com",
    to: email,
    subject: "Forgot Password",
    text: `Go to http://localhost:3000/forgot-password/${user._id}`,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return res.status(200).json({
    message: `Go to http://localhost:3000/forgot-password/${user._id}`,
    id: user._id,
  });
};

const forgotPasswordUniqueLink = async (req, res) => {
  const { id } = req.params; // Get id from params
  const { newPassword, confirmPassword } = req.body; // Get new password and confirm password from request body
  let invalidPassMessage = "Password must have: \n";

  const users = await User.find({}).sort({ createdAt: -1 });
  const previousPassword = users.map((user) => {
    if (user._id == id) {
      return user.password.toString();
    }
  });

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Please fill out all fields!" }); // Return error if not all fields are filled out
  }

  if (!previousPassword) {
    res.status(404).json({ message: "User not found!" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Password does not match!" });
  }

  var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (
    !newPassword.match(/^(?=.*\d)/gm) ||
    !newPassword.match(/^(?=.*[a-z])/gm) ||
    !newPassword.match(/^(?=.*[A-Z])/gm) ||
    !newPassword.match(format) ||
    newPassword.length < 6
  ) {
    if (!newPassword.match(/^(?=.*\d)/gm)) {
      invalidPassMessage = invalidPassMessage + "1 number!\n";
    }
    // Check if the password have lowercase letter
    if (!newPassword.match(/^(?=.*[a-z])/gm)) {
      invalidPassMessage = invalidPassMessage + "1 lowercase letter!\n";
    }
    // Check if the password have uppercase letter
    if (!newPassword.match(/^(?=.*[A-Z])/gm)) {
      invalidPassMessage = invalidPassMessage + "1 uppercase letter!\n";
    }
    // Check if the password have 8 characters
    if (newPassword.length < 8) {
      invalidPassMessage = invalidPassMessage + "atleast 8 characters!\n";
    }

    if (!format.test(newPassword)) {
      invalidPassMessage = invalidPassMessage + "1 special character!\n";
    }
    return res.status(400).json({ message: invalidPassMessage });
  }

  console.log(newPassword, confirmPassword, id);

  const isNewPassSameAsPreviousPass = await bcrypt.compare(
    newPassword.toString(),
    previousPassword.toString()
  );
  if (isNewPassSameAsPreviousPass) {
    return res
      .status(400)
      .json({ message: "New password cannot be the same as old password!" });
  }

  // Change password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  // Update password in database based on id with hashed password
  User.findOneAndUpdate({ _id: id }, { password: hashedPassword }).then(
    (result) => {
      return res
        .status(200)
        .json({ message: "Successfully changed password!", result: result });
    }
  );
};

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.get(`/c0e0b35e-8943-4641-a35a-48113935133e`, getUsers);
router.get("/verification", verification);
router.post("/update-verified", updateVerified);

router.post("/update-verified/send-email", firstEmailVerification); // Send an email
router.patch("/update-verified/:id", firstEmailVerificationUniqueLink);

router.post("/forgot-password/send-email", forgotPasswordSendEmail); // Send an email
router.patch("/forgot-password/:id", forgotPasswordUniqueLink);

const deleteCookieToken = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("email");
  res.end();
};

const getCookieToken = async (req, res, next) => {
  const { token } = req.cookies;

  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
  });

  next();
};

const getUserWithCookie = async (req, res) => {
  const { email } = req.cookies;
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  res.status(200).json({ user: user });
};

router.get("/set-cookie-token", setCookieToken);
router.get("/delete-cookie-token", deleteCookieToken);
router.get("/get-cookie-token", getCookieToken, getUserWithCookie);

router.delete("/e2883483-bb04-48de-b497-cefc9880d227", formatDatabase);

module.exports = router;
