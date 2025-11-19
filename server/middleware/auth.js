const admin = require('../utils/firebase');

const verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization || '';
  const components = authorizationHeader.split(' ');

  if (components.length === 2) {
    const type = components[0];
    const token = components[1];

    if (type === 'Bearer') {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
      } catch (e) {
        if (e.errorInfo && e.errorInfo.code === 'auth/id-token-expired') {
          res.status(401).json({ error: "Token expired" });
          console.log('Token Expired');
        } else {
          res.status(403).json({ error: 'Unauthorized' });
        }
      }
    } else {
      res.status(400).json({ error: 'Invalid token' });
    }
  } else {
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = { verifyToken };