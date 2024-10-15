const JWT = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const DecodeToken = (req, res, next) => {
  // Hardcoded token for testing purposes
  const token = req.cookies.token;
  // Check if the token exists
  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided. Unauthorized access." });
  }

  try {
    // Verify the token using the secret key
    const data = JWT.verify(token, JWT_SECRET_KEY);
    req.user = data; // Attach the decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // If token verification fails, respond with an unauthorized status
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = DecodeToken;
