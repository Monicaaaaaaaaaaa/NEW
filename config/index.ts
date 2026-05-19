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
    manualEntryLineItemLimit: 5,
    maximumFileUploadSize: 1024 * 1000 * 5, // 5MB
    auth: {
        cookieName: "merchant-session",
        tokenRefreshThreshold: 2 * 60 * 1000, // Refresh token 2 minutes before expiry
        sessionTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
        // isSecure: process.env.IS_COOKIE_SECURE === "true",
        // authPassword: process.env.AUTH_SECRET,
    },
    passwordMinLength: 12,
    defaultPageSize: {
        default: 20,
        invoiceTable: 1_000,
        historyTable: 10,
    },
};
 
// NOTE: difference between idleTimeout and promptBeforeIdleTimeout is when the idle timer modal will pop up
// Idletimeout - promptBeforeIdleTimeout
 
export default config;
 
 