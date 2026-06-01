export function replaceInList<T extends { id: number | string }>(
    list: readonly T[],
    updated: T,
): T[] {
    const index = list.findIndex((row) => row.id === updated.id);
    if (index === -1) return [...list];

    return [...list.slice(0, index), updated, ...list.slice(index + 1)];
}

export function hasRecordChanges<T extends Record<string, unknown>>(
    baseline: T | null,
    current: T,
    keys: (keyof T)[],
    extraChanged?: () => boolean,
): boolean {
    if (!baseline) return false;
    if (extraChanged?.()) return true;

    return keys.some((key) => current[key] !== baseline[key]);
}
