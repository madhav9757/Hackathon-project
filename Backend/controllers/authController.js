import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  if (!name || !email || !password || !role || !phone || !address) {
    return res.status(400).json({ message: 'All fields (name, email, password, role, phone, address) are required' });
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    return res.status(400).json({ message: 'User with this email or phone number already exists' });
  }

  try {
    const user = await User.create({ name, email, password, role, phone, address });

    generateToken(res, user._id, user.role);

    // Removed: coordinates, trustCertificate, points from the response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

   const token =  await generateToken(res, user._id, user.role);

  // Removed: coordinates, trustCertificate, points from the response
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address,
    token: token
  });
};

export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getProfile = async (req, res) => {
  if (!req.user||!req.user._id) {
    return res.status(401).json({ message: 'NO lOgin' });
  }

  const user = await User.findById(req.user._id);
  if (user) {
    // These fields remain here as getProfile is intended to provide complete user details
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};