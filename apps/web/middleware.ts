// @author: fatima bashir
// Middleware temporarily disabled - no authentication for MVP demo
// When adding authentication back, uncomment and configure properly

// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   publicRoutes: [
//     "/",
//     "/sign-in", 
//     "/sign-up",
//     "/demo",
//     "/dashboard", // Temporarily public for demo
//     "/api/webhooks/(.*)",
//     "/health",
//   ],
// });

// For now, allow all routes
export const config = {
  matcher: [],
};

