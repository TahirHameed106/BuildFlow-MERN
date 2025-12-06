const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  // Accepts 'role' from the request body
  const { name, email, password, role } = req.body; 

  if (!name || !email || !password || !role) {
    return res.status(400).json({ msg: "Please provide all registration fields." });
  }
  
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role // <-- Save the new role
  });

  res.json({ message: "User created", user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ msg: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ msg: "Invalid credentials" });

  // Token now includes the user's role
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {});

  res.json({
    message: "Login successful",
    token,
    // The client needs the role to display the correct dashboard
    user: { id: user._id, name: user.name, email: user.email, role: user.role } 
  });
};