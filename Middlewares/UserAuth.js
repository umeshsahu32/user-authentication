const jwt = require("jsonwebtoken");
const User = require("../Modals/user");

const ensureAuthenticated = async (req, res, next) => {
  const auth = req.headers["authorization"];

  console.log("auth-->", auth);

  if (!auth) {
    return res
      .status(403)
      .json({ message: "Unauthorized Access. Token is Required" });
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    // req.user = await User.findById(decoded._id).select("-password");
    req.user = decoded;
    console.log("req", req.user);
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized Access. Token is wrong or expired" });
  }
};

module.exports = { ensureAuthenticated };
