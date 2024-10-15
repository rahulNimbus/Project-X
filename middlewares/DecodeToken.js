const JWT = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; // Ensure this is defined in your environment variables

const DecodeToken = (req, res, next) => {
  // Retrieve the token from cookies
  const token = req.cookies.token;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: "No token provided. Unauthorized access." });
  }

  try {
    // Verify the token using the secret key
    const decodedData = JWT.verify(token,  "nITBY&^8)UOBJYSVAuFXuvYFU^XRhocyfveb  DHI&ETR" // Hardcoded for testing
    );

    // Attach the decoded user data to the request object
    req.user = decodedData; 

    // Proceed to the next middleware or route handler
    next(); 
  } catch (err) {
    // Log the error for debugging purposes (optional)
    console.error("Token verification error:", err.message);

    // If token verification fails, respond with an unauthorized status
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = DecodeToken;
