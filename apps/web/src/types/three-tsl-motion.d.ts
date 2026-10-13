declare module "three/webgpu" {
  export * from "three";
  export const WebGPURenderer: any;
  export const MeshBasicNodeMaterial: any;
}

declare module "three/tsl" {
  export const attribute: (name: string) => any;
  export const uniform: (value: any) => any;
  export const positionLocal: any;
  export const time: any;
  export const sin: (value: any) => any;
  export const cos: (value: any) => any;
  export const mix: (a: any, b: any, t: any) => any;
  export const vec3: (...args: any[]) => any;
}

declare module "motion/three" {
  export function threeEffect(target: any, values: Record<string, any>): () => void;
}
