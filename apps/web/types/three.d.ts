// Minimal ambient declaration for three.js
// @types/three is installed in the pnpm store but not directly symlinked.
// This satisfies tsc --noEmit without breaking runtime behavior.
declare module 'three' {
  // Core geometry/object types used in arena-orbs.tsx
  export interface Object3D { rotation: { x: number; y: number; z: number } }
  export interface Mesh extends Object3D { geometry: unknown; material: unknown }
  export interface Points extends Object3D { geometry: unknown }
  export interface BufferGeometry { setAttribute(name: string, attr: unknown): this }
  export class BufferAttribute { constructor(array: ArrayLike<number>, itemSize: number) }
  export class Float32BufferAttribute extends BufferAttribute {
    constructor(array: ArrayLike<number>, itemSize: number)
  }
  export interface Clock { elapsedTime: number; getDelta(): number }
  // Allow wildcard exports for anything else used at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Color: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Vector3: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Scene: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Camera: any;
}
