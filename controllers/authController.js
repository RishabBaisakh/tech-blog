const User = require("../models/user");

// handle errors
const handleErrors = (err) => {
  let errors = {
    email: "",
    password: "",
  };

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

module.exports.signup_get = (req, res) => {
  res.render("auth/signup", { title: "Sign Up" });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    res.status(201).json(user);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).send({ errors });
  }
};

module.exports.login_get = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
  } catch (error) {}
};
