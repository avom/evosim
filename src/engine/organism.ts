export interface Organism {
  get x(): number;
  get y(): number;
  get energy(): number;

  draw(context: CanvasRenderingContext2D): void;

  tick(dt: number): void;

  kill(): void;

  get isAlive(): boolean;
}