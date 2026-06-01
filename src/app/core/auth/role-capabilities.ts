import type { StaffRole } from "../../shared/models/auth-api.types";

const PERMISSIONS: Record<StaffRole, readonly string[]> = {
    admin: [
        "users.list",
        "users.read",
        "users.create",
        "users.patch",
        "users.delete",
        "devlogs.list",
        "devlogs.create",
        "devlogs.patch",
        "devlogs.delete",
    ],
    maintainer: [
        "users.list",
        "users.read",
        "users.patch",
        "devlogs.list",
        "devlogs.patch",
    ],
    read_only: ["users.list", "users.read", "devlogs.list"],
};

export function can(
    role: StaffRole | null | undefined,
    permission: string,
): boolean {
    if (!role) return false;
    return PERMISSIONS[role]?.includes(permission) ?? false;
}
