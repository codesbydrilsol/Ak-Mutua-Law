// Simple password-based authentication middleware
module.exports = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
  const pass = req.headers['x-admin-password'];

  if (pass === adminPassword) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};