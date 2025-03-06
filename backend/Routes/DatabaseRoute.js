const DBUser = require("../Models/User");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
router.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body;
  try {
    const isExist = await DBUser.findOne({ name: username });
    if (isExist) return res.status(401).json({ error: "User Already Exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new DBUser({
      username: username,
      password: hashedPassword,
      token: null,
      email,
      name,
    });
    const userData = user.save();
    console.log("user registered");
    return res.status(200).json({
      message: "User Registered Successfully",
      redirect: "/",
      userData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error fetching users", details: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }
  // Find the user
  const user = await DBUser.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  if (user.isBanned === 0) {
    return res.status(404).json({ error: "User Has Been Banned" });
  }
  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid password." });
  }
  // Generate a JWT token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "30m" });
  const updateUser = await DBUser.findOneAndUpdate(
    { username },
    { $set: { token: token } }, // Set the fields to update
    { new: true, runValidators: true }
  );
  req.user = username;
  res.cookie("username", username, { httpOnly: true });
  res.cookie("token", token, { httpOnly: true });
  return res.json({ redirect: "/chat" });
});
module.exports = router;
