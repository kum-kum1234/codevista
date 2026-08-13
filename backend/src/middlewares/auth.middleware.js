const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization && authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).send({ success: false, message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'ACCESS') {
      throw new Error('Invalid token type');
    }

    req.user = { id: payload.sub };
    return next();
  } catch (error) {
    return res.status(401).send({ success: false, message: 'Invalid or expired token' });
  }
};
