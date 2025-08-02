const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to check the isNotEmpty condition
 function isNotEmpty(value) {
  if (value === null || value === undefined) return false;

  if (typeof value === 'string' && value.trim() === '') return false;

  if (Array.isArray(value) && value.length === 0) return false;

  if (typeof value === 'object' && !Array.isArray(value)) {
    if (Object.keys(value).length === 0) return false;
  }

  if (typeof value === 'number' && isNaN(value)) return false;

  return true;
}

// function to verify the token
function verifyLoginToken({token}) {
  try {
    if(isNotEmpty(token)){
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    }
  } catch (err) {
    console.error("Token verification failed:", err.message);
    throw new Error("Invalid or expired token");
  }
}

module.exports = {
    isNotEmpty,
    verifyLoginToken
}
