const jwt = require('jsonwebtoken');
const Profile = require('../../models/Profile');

module.exports = async (req, res, next) => {
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

    // User tokens carry a tokenVersion; logout bumps it, which revokes
    // every token issued before. (Admin tokens have no `tv` claim.)
    if (payload.tv !== undefined) {
      const profile = await Profile.findOne({ userId: payload.sub })
        .select('tokenVersion active')
        .lean();

      if (!profile || profile.active === false || (profile.tokenVersion || 0) !== payload.tv) {
        throw new Error('Token revoked');
      }
    }

    req.user = { id: payload.sub };
    return next();
  } catch (error) {
    return res.status(401).send({ success: false, message: 'Invalid or expired token' });
  }
};
