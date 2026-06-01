import { HttpContextToken } from "@angular/common/http";

import { environment } from "../../../environments/environment";

/** When true, GET /devlogs sends Bearer for the staff projection (admin list). */
export const STAFF_DEVLOG_REQUEST = new HttpContextToken<boolean>(() => false);

export function apiPath(url: string): string | null {
    if (!url.startsWith(environment.apiUrl)) return null;
    return url.slice(environment.apiUrl.length).split("?")[0] ?? "";
}

export function isDevlogMutation(path: string, method: string): boolean {
    return path.startsWith("/devlogs") && method !== "GET";
}

export function isStaffDevlogList(
    path: string,
    method: string,
    staffDevlogRequest: boolean,
): boolean {
    return path === "/devlogs" && method === "GET" && staffDevlogRequest;
}
