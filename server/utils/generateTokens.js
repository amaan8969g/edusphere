const jwt = require('jsonwebtoken');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'edusphere_jwt_secret_key_production_grade_998811', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id, user.role);

  // Remove password from output object
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApprovedInstructor: user.isApprovedInstructor,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    },
  });
};

module.exports = {
  signToken,
  createSendToken,
};
