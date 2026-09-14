const User = require('../models/User');
const bcrypt = require('bcryptjs');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // ✅ Store user info in session (instead of JWT)
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    // ✅ Send session user info back
    res.status(200).json({
      msg: 'Login successful',
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  loginUser,
};
