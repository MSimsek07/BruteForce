const User = require("../model/User"); 
const bcrypt = require("bcryptjs"); 
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
let userLogged = "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "3muharremcandan@gmail.com", //e-mail
    pass: "bfhzrcursrxhoopj", //app password from google account
  },
});

const signup = async (req, res, next) => {
  let invalidPassMessage = "Password must have: \n";
  const { name, email, password } = req.body;

  let existingUser = await User.findOne({ email: req.body.email }); // Find user by email

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Please fill out all fields!" }); // Return error if not all fields are filled out
  }

  if (existingUser) {
    return res.status(400).json({ message: "User already exists!" }); // Return error if user already exists
  }

  var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (
    !password.match(/^(?=.*\d)/gm) ||
    !password.match(/^(?=.*[a-z])/gm) ||
    !password.match(/^(?=.*[A-Z])/gm) ||
    !password.match(format) ||
    password.length < 6
  ) {
    if (!password.match(/^(?=.*\d)/gm)) {
      invalidPassMessage = invalidPassMessage + "1 number!\n";
    }
    // Check if the password have lowercase letter
    if (!password.match(/^(?=.*[a-z])/gm)) {
      invalidPassMessage = invalidPassMessage + "1 lowercase letter!\n";
    }
    // Check if the password have uppercase letter
    if (!password.match(/^(?=.*[A-Z])/gm)) {
      invalidPassMessage = invalidPassMessage + "1 uppercase letter!\n";
    }
    // Check if the password have 8 characters
    if (password.length < 8) {
      invalidPassMessage = invalidPassMessage + "atleast 8 characters!\n";
    }

    if (!format.test(password)) {
      invalidPassMessage = invalidPassMessage + "1 special character!\n";
    }
    return res.status(400).json({ message: invalidPassMessage });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // const hashedPassword = bcrypt.hashSync(password); // Hash password

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }

  return res
    .status(200)
    .json({ message: `Welcome`, id: user._id });
};

const login = async (req, res, next) => {
  userLogged = "";
  let existingUser;
  const { email, password } = req.body;

  try {
    existingUser = await User.findOne({ email: email }); // Find user by email
  } catch {
    return res.status(400).json({ message: "User not found. Please signup!" });
  }

  if (!existingUser) {
    return res.status(400).json({ message: "User not found. Please signup!" }); // Return error if user doesn't exist
  }


 
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid email / password!" }); // Return error if password is incorrect
  }

  userLogged = existingUser.email;
  return res.status(200).json({ message: "Logged in!", user: userLogged });
};
  
exports.signup = signup;
exports.login = login;
