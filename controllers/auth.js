const User = require('../models/user');
const Admin = require('../models/admin');
var jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { email } = req.body;
  const newUser = new User(req.body);
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).json({ error: 'Email already exits' });
    } else {
      await newUser.save();
      const token = jwt.sign({ email, role: 'user' }, process.env.SECRET_USER, { expiresIn: '3h' });
      res.json({ message: 'User created successfully', token });
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(422).json({ error: 'Invalid email or password' });
    } else {
      const token = jwt.sign({ email, role: 'user' }, process.env.SECRET_USER, { expiresIn: '3h' });
      res.json({ message: 'Logged in successfully', token });
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.authenticateJwtUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_USER, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token Expired. Please Login again' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Access Denied' });
  }
};

//ADMIN/////////////

exports.adminSignup = async (req, res) => {
  const { email, secret } = req.body;
  if (secret !== process.env.SECRET_KEY) {
    return res.status(422).json({ error: 'Please enter valid secret key' });
  }
  const newAdmin = new Admin(req.body);
  try {
    const admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(422).json({ error: 'Email already exits' });
    } else {
      await newAdmin.save();
      const token = jwt.sign({ email, role: 'admin' }, process.env.SECRET_ADMIN, {
        expiresIn: '3h'
      });
      res.json({ message: 'Admin created successfully', token });
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.adminSignin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email, password });

    if (!user) {
      return res.status(422).json({ error: 'Invalid email or password' });
    } else {
      const token = jwt.sign({ email, role: 'admin' }, process.env.SECRET_ADMIN, {
        expiresIn: '3h'
      });
      res.json({ message: 'Logged in successfully', token });
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.authenticateJwtAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_ADMIN, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token Expired. Please Login again' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Access Denied' });
  }
};
