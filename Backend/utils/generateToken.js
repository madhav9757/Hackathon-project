import jwt from "jsonwebtoken";

const generateToken = (res, userId, role) => {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  if (res) {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'None',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  return token;
};

export default generateToken;
