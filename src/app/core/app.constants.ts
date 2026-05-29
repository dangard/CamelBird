export const APP_CONSTANTS = {
    OPERATIONS: {
        AUTH: {
            LOGIN: "/auth/login",
            REFRESH: "/auth/refresh",
        },
        DEVBLOG: {
            GET_ALL: "/devlogs",
            BY_ID: (id: string) => `/devlogs/${id}`,
        },
        USERS: {
            LIST: "/users",
            BY_ID: (id: number | string) => `/users/${id}`,
        },
        CONTACT: {
            CREATE: "/contact",
        },
    },
} as const;
