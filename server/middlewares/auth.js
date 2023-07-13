require("dotenv").config();
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return sendUnauthorisedResponse(res);
  try {
    const verified = await jwt.verify(token, process.env.JWTSCECREATE);

    if (verified) {
      req["user"] = verified;
      next();
    } else {
      console.log("Verified");
      return sendUnauthorisedResponse(res);
    }
  } catch (error) {
    return sendUnauthorisedResponse(res, error);
  }
}

function sendUnauthorisedResponse(res, error) {
  let responseContent = {
    message: "Unauthorised",
    reason: getErrorReason(error),
  };
  return res.status(403).send(responseContent);
}

function getErrorReason(error) {
  let reason = "InvalidToken";
  if (error && error.name === "TokenExpiredError") {
    reason = "TokenExpired";
  }
  return reason;
}

module.exports = auth;
