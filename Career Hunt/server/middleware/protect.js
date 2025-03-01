// export const protect = (req, res, next) => {
//   if (req.odic.isAuthenticated()) {
//     next();
//   } else {
//     res.status(401).json({ message: "not authorized" });
//   }
// };
// export default protect;

// export const protect = (req, res, next) => {
//     if (!req.oidc || typeof req.oidc.isAuthenticated !== "function") {
//       return res.status(500).json({ message: "Auth0 middleware not initialized" });
//     }
  
//     if (!req.oidc.isAuthenticated()) {
//       return res.status(401).json({ message: "Not authenticated" });
//     }
  
//     next();
//   };
  
export const protect = (req, res, next) => {
    if (!req.oidc || typeof req.oidc.isAuthenticated !== "function") {
      return res.status(500).json({ message: "Auth0 middleware not initialized" });
    }
  
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  
    next();
  };
  