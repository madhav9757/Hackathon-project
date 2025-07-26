import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  // Check if variables are empty
  if (!name || !email || !password || !role || !phone || !address ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) return res.status(400).json({ message: 'User with this email or phone already exists' });

  // Validate coordinates is an array of numbers
  if (!Array.isArray(coordinates) || coordinates.length !== 2 || coordinates.some(isNaN)) {
    return res.status(400).json({ message: 'Coordinates must be an array of two numbers' });
  }

  // Validate trustCertificate is an array
  if (!Array.isArray(trustCertificate)) {
    return res.status(400).json({ message: 'TrustCertificate must be an array' });
  }

  const user = await User.create({ name, email, password, role, phone, address });

  generateToken(res, user._id, user.role);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address,
    points: user.points,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  generateToken(res, user._id, user.role);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address,
    coordinates: user.coordinates,
    points: user.points,
  });
};

export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out' });
};


export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      coordinates: user.coordinates,
      trustCertificate: user.trustCertificate,
      points: user.points,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};