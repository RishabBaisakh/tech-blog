const User = require("../models/user");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
  let errors = {
    email: "",
    password: "",
  };

  // incorrect email
  if (err.message.includes("Incorrect email")) {
    errors.email = "The email is not registered";
  }

  // incorrect password
  if (err.message.includes("Incorrect password")) {
    errors.password = "The password is incorrect";
  }

  // duplicode error code
  if (err.code === 11000) {
    errors.email = "The email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  // requires time in seconds
  return jwt.sign({ id }, "tech blog secret", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  return res.render("auth/signup", { title: "Sign Up", path: req.path });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    // requires time in miliseconds
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    return res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).send({ errors });
  }
};

module.exports.login_get = async (req, res) => {
  return res.render("auth/login", { title: "Login", path: req.path });
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    // requires time in miliseconds
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    return res.status(200).json({
      user: user._id,
      nextUrl: user.role === "admin" ? "/dashboard" : "/blogs",
    });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  return res.redirect("/login");
};
