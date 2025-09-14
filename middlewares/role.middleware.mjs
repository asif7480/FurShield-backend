export const checkRole = (...allowedRole) => {
  return (request, response, next) => {
    try {
      const userRole = request.user?.role;

      if (!userRole) {
        return response.status(401).json({
          success: false,
          message: "Access denied. No role assigned.",
        });
      }

      if (!allowedRole.includes(userRole)) {
        return response.status(403).json({
          success: false,
          message: "Access denied. Unauthorized.",
        });
      }

      next();
    } catch (err) {
      console.error(err);
      return response.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
};
