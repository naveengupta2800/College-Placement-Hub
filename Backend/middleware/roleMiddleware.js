const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    console.log("=================================");
    console.log("USER:", req.user.email);
    console.log("USER ROLE:", req.user.role);
    console.log("ALLOWED ROLES:", roles);
    console.log("=================================");

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your role is '${req.user.role}'. Required: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = allowRoles;