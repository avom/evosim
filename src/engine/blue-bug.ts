import { Organism } from "./organism";
import { Settings } from "./settings";
import { World } from "./world";

export class BlueBug implements Organism {
  private readonly world: World;

  x: number;
  y: number;
  energy: number;

  constructor(world: World, x: number, y: number, energy: number) {
    this.world = world;
    this.x = x;
    this.y = y;
    this.energy = energy;
  }

  tick(_dt: number): void {
    const d = Math.floor(Math.random() * 4);
    const dx = [0, 1, 0, -1][d];
    const dy = [1, 0, -1, 0][d];
    this.x += dx;
    this.y += dy;

    const maxX = this.world.width - this.radius;
    if (this.x < this.radius) {
      this.x = this.radius - (this.x - this.radius);
    } else if (this.x >= maxX) {
      this.x = maxX - (this.x - maxX);
    }

    const maxY = this.world.height - this.radius;
    if (this.y < this.radius) {
      this.y = this.radius - (this.y - this.radius);
    } else if (this.y >= this.world.height - this.radius) {
      this.y = maxY - (this.y - maxY);
    }

    this.energy -= Math.sqrt(dx * dx + dy * dy);
    this.energy -= this.radius ** 2 * Settings.bugs.blue.bmrCoef;

    this.energy += this.world.killPlantsInAreaAndReturnEnergy(this.x, this.y, this.radius);

    const offspringEnergy = Settings.bugs.blue.initialEnergy;
    if (this.energy >= 2 * offspringEnergy) {
      this.world.add(new BlueBug(this.world, this.x, this.y, offspringEnergy));
      this.energy -= offspringEnergy;
    }
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = "#fff";
    context.strokeStyle = "#00f";
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  }

  kill(): void {
    this.energy = 0;
  }

  get isAlive(): boolean {
    return this.energy >= Settings.bugs.blue.survivalEnergy;
  }

  private get radius(): number {
    return Math.sqrt(this.energy / 5000);
  }
}
