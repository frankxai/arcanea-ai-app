/**
 * Immutable dotted-path set/unset. Every write returns a new object down the
 * touched spine only, so React reference equality still prunes re-renders of
 * untouched nodes.
 */
export function setPath(target, path, value) {
    const keys = path.split('.');
    if (keys.length === 0 || keys.some((k) => !k))
        return target;
    return write(target, keys, 0, value, false);
}
export function unsetPath(target, path) {
    const keys = path.split('.');
    if (keys.length === 0 || keys.some((k) => !k))
        return target;
    return write(target, keys, 0, undefined, true);
}
export function getPath(target, path) {
    let cursor = target;
    for (const key of path.split('.')) {
        if (typeof cursor !== 'object' || cursor === null)
            return undefined;
        cursor = cursor[key];
    }
    return cursor;
}
function write(node, keys, depth, value, remove) {
    const key = keys[depth];
    const isLeaf = depth === keys.length - 1;
    const base = typeof node === 'object' && node !== null ? { ...node } : {};
    if (isLeaf) {
        if (remove)
            delete base[key];
        else
            base[key] = value;
        return base;
    }
    base[key] = write(base[key], keys, depth + 1, value, remove);
    return base;
}
