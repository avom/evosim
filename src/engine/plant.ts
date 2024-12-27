import { Organism } from "./organism";
import { Settings } from "./settings";
import { World } from "./world";

export interface Eatable {
  energy: number;
}
export class Plant implements Organism, Eatable {
  
  private readonly world: World;

  readonly id: number;
  readonly generation: number;
  readonly x: number;
  readonly y: number;
  energy: number;
  
  constructor (world: World, generation: number, x: number, y: number, energy: number) {
    this.world = world;
    this.id = world.nextOrganismId();
    this.generation = generation;
    this.x = x;
    this.y = y;
    this.energy = energy;
  }

  draw(context: CanvasRenderingContext2D): void {
    if (!this.isAlive) {
      return;
    }
    context.fillStyle = this.isEdible ? "#0a0" : "#080";
    context.fillRect(this.x, this.y, 1, 1);
  }

  tick(dt: number): void {
    this.energy = Math.min(this.energy + dt * Settings.plants.energyGrowthPerSec, Settings.plants.maxEnergy);
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

      const offspring = new Plant(this.world, this.generation + 1, x, y, Settings.plants.seedEnergy);
      this.world.add(offspring);

      this.energy -= Settings.plants.seedEnergy;
    }
  }

  kill(): void {
    this.energy = 0;
  }

  get isAlive(): boolean {
    return this.energy > 0;
  }

  get isEdible(): boolean {
    return this.energy >= Settings.plants.edibleAtEnergy;
  }
} 