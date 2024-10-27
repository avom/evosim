import { Organism } from "./organism";
import { Settings } from "./settings";
import { World } from "./world";

export class Plant implements Organism {
  
  private readonly world: World;
  readonly x: number;
  readonly y: number;
  energy: number;

  constructor (world: World, x: number, y: number, energy: number) {
    this.world = world;
    this.x = x;
    this.y = y;
    this.energy = energy;
  }

  draw(context: CanvasRenderingContext2D): void {
    if (!this.isAlive) {
      return;
    }
    context.fillStyle = "#0a0"
    context.fillRect(this.x, this.y, 1, 1);
  }

  tick(dt: number): void {
    const offspringThreshold = 1 - Math.pow(1 - Settings.plants.offspringChancePerSec, dt);
    if (Math.random() < offspringThreshold) {
      const d = Math.random() * Settings.plants.maxSeedRange;
      const a = 2 * Math.PI * Math.random();
      const dx = d * Math.cos(a);
      const dy = d * Math.sin(a);
      const x = Math.round(this.x + dx);
      const y = Math.round(this.y + dy);
      if (x < 0 || x > this.world.width - 1 || y < 0 || y > this.world.height - 1)
        return;

      const offspring = new Plant(this.world, x, y, Settings.plants.initialEnergy);
      this.world.add(offspring);
    }
  }

  kill(): void {
    this.energy = 0;
  }

  get isAlive(): boolean {
    return this.energy > 0;
  }
} 