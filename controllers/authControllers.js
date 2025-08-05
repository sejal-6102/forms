const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  res.json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = code;
  user.resetCodeExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendEmail(email, code);
  res.json({ message: 'Reset code sent to email' });
};

exports.verifyCodeAndReset = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.resetCode !== code || user.resetCodeExpiry < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired code' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetCode = null;
  user.resetCodeExpiry = null;
  await user.save();

  res.json({ message: 'Password reset successful' });
};
