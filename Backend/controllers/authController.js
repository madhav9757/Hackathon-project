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

  generateToken(res, user._id, user.role);

  // Removed: coordinates, trustCertificate, points from the response
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address,
  });
};

export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getProfile = async (req, res) => {
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

const updateProfile = async (req, res) => {
  const { name, email, phone, address } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

export { updateProfile };