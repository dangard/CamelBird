import { can } from "./role-capabilities";

describe("role-capabilities", () => {
    it("allows admin to create users", () => {
        expect(can("admin", "users.create")).toBe(true);
    });

    it("denies read_only user create", () => {
        expect(can("read_only", "users.create")).toBe(false);
    });

    it("allows maintainer to patch devlogs", () => {
        expect(can("maintainer", "devlogs.patch")).toBe(true);
    });
});
