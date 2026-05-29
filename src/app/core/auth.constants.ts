export const AUTH_STORAGE_KEYS = {
    ACCESS_TOKEN: "camelbird_access_token",
    REFRESH_TOKEN: "camelbird_refresh_token",
    USER: "camelbird_auth_user",
} as const;

export const AUTH_REFRESH_MAX_ATTEMPTS = 2;

export const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    TOO_MANY_REQUESTS: 429,
} as const;

export const ADMIN_ROUTES = {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    DEVLOGS: "/admin/devlogs",
} as const;
