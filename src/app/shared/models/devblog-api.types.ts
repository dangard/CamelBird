/** Response shape for POST /devlog (observed field). */
export interface CreateDevBlogResponse {
    log_id: string;
}

/** API list payload is not fully typed until the backend publishes a schema. */
export type DevBlogListPayload = unknown;
