const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");

exports.registerUser = async (data) => {
  const { name, email, password, role, education, skills, projects, work, links } = data;

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
    education,
    skills,
    projects,
    work,
    links,
  });
  await user.save();

  return {
    user,
    token: generateToken(user),
  };
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  return {
    user,
    token: generateToken(user),
  };
};
