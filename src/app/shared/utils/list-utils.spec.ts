import { hasRecordChanges, replaceInList } from "./list-utils";

describe("list-utils", () => {
    describe("replaceInList", () => {
        it("replaces a row by id", () => {
            const list = [
                { id: 1, name: "a" },
                { id: 2, name: "b" },
            ];
            expect(replaceInList(list, { id: 2, name: "updated" })).toEqual([
                { id: 1, name: "a" },
                { id: 2, name: "updated" },
            ]);
        });
    });

    describe("hasRecordChanges", () => {
        it("detects field changes against baseline", () => {
            const baseline = { title: "Old", body: "Body" };
            expect(
                hasRecordChanges(baseline, { title: "New", body: "Body" }, [
                    "title",
                    "body",
                ]),
            ).toBe(true);
        });

        it("supports extra change checks", () => {
            const baseline = { title: "Same" };
            expect(
                hasRecordChanges(
                    baseline,
                    { title: "Same" },
                    ["title"],
                    () => true,
                ),
            ).toBe(true);
        });
    });
});
