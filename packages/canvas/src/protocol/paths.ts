/**
 * Immutable dotted-path set/unset. Every write returns a new object down the
 * touched spine only, so React reference equality still prunes re-renders of
 * untouched nodes.
 */

export function setPath<T extends object>(target: T, path: string, value: unknown): T {
  const keys = path.split('.');
  if (keys.length === 0 || keys.some((k) => !k)) return target;
  return write(target, keys, 0, value, false);
}

export function unsetPath<T extends object>(target: T, path: string): T {
  const keys = path.split('.');
  if (keys.length === 0 || keys.some((k) => !k)) return target;
  return write(target, keys, 0, undefined, true);
}

export function getPath(target: unknown, path: string): unknown {
  let cursor = target;
  for (const key of path.split('.')) {
    if (typeof cursor !== 'object' || cursor === null) return undefined;
    cursor = (cursor as Record<string, unknown>)[key];
  }
  return cursor;
}

function write(node: unknown, keys: string[], depth: number, value: unknown, remove: boolean): any {
  const key = keys[depth];
  const isLeaf = depth === keys.length - 1;
  const base: Record<string, unknown> =
    typeof node === 'object' && node !== null ? { ...(node as Record<string, unknown>) } : {};

  if (isLeaf) {
    if (remove) delete base[key];
    else base[key] = value;
    return base;
  }

  base[key] = write(base[key], keys, depth + 1, value, remove);
  return base;
}
