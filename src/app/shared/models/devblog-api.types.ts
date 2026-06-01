/** Response shape for POST /devlogs */
export interface CreateDevBlogResponse {
    log_id: string;
}

/** Public projection from GET /devlogs (no Bearer). */
export interface DevlogPublic {
    id: string;
    title: string;
    body: string;
    date: string;
}

/** Staff projection from authenticated GET /devlogs or PATCH /devlogs/{id}. */
export interface DevlogStaff extends DevlogPublic {
    user: string;
    is_published: boolean;
}

/** @deprecated Use DevlogStaff in admin code. */
export type DevBlogListItem = DevlogStaff;

export interface DevBlogCreateRequest {
    title: string;
    body?: string;
    user?: string;
    is_published?: boolean;
}

export interface DevBlogPatchRequest {
    title?: string;
    body?: string;
    user?: string;
    is_published?: boolean;
}
