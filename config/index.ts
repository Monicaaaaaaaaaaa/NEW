const config = {
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
    appName: process.env.NEXT_PUBLIC_APP_NAME,
    apiBaseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
    httpTimeout: 1000 * 60 * 1, // 1 minutes
    idleTimeout: 1000 * 60 * 10, // 10 minutes
    promptBeforeIdleTimeout: 1000 * 60 * 3, // 3 minutes
    protectedRoutes: ["/dashboard", "/profile", "/settings"],
    publicRoutes: ["/", "/forgot-password"],
};

export default config;
 
 