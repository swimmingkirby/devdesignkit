/**
 * Type declarations for culori
 * https://www.npmjs.com/package/culori
 */
declare module 'culori' {
  export interface LabColor {
    mode: 'lab';
    l: number;
    a: number;
    b: number;
  }

  export interface RgbColor {
    mode: 'rgb';
    r: number;
    g: number;
    b: number;
  }

  export type Color = LabColor | RgbColor | string;

  export function converter(mode: 'lab'): (color: Color) => LabColor;
  export function converter(mode: 'rgb'): (color: Color) => RgbColor;
  export function converter(mode: string): (color: Color) => any;
  export function formatHex(color: Color): string;
  export function parse(color: string): RgbColor | undefined;
}

