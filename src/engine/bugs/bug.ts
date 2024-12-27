import { Gene } from "../gene";
import { Organism } from "../organism";
import { BugFeatures, Settings } from "../settings";
import { Coords } from "../types";
import { World } from "../world";
import { consumeNearbyPlants } from "./plant-eating";

export class Bug implements Organism {
  private readonly world: World;

  readonly id: number;
  readonly generation: number;
  readonly color: string;
  pos: Coords;
  energy: number;
  direction: number;
  speed: number;

  private readonly mouthSpeed: number;
  private readonly survivalEnergy: number;

  private availableMouthBandwidth = 0;

  constructor(
    world: World,
    generation: number,
    pos: Coords,
    energy: number,
    direction: number,
    features: BugFeatures
  ) {
    this.world = world;
    this.id = world.nextOrganismId();
    this.generation = generation;
    this.pos = pos;
    this.energy = energy;
    this.direction = direction;

    this.color = features.color;
    this.mouthSpeed = features.mouthSpeed;
    this.speed = features.speed;
    this.survivalEnergy = energy * features.survivalEnergyThreshold;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = "#fff";
    context.strokeStyle = "#00f";
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  }

  tick(dt: number): void {
    this.eat(dt);
    this.move(dt);
  }

  private eat(dt: number): void {
    this.availableMouthBandwidth += dt * this.mouthSpeed;
    const consumedEnergy = consumeNearbyPlants(
      { center: this.pos, r: this.radius },
      this.world,
      this.availableMouthBandwidth
    );

    this.energy += consumedEnergy;
    this.availableMouthBandwidth -= consumedEnergy;
    this.availableMouthBandwidth = Math.min(this.availableMouthBandwidth, this.mouthSpeed);
  }

  private move(dt: number): void {
    this.direction = (this.direction + Math.random() * 2 * Math.PI) % (2 * Math.PI);
    const d = Math.floor(Math.random() * 4);
    const dx = this.speed * dt * [0, 1, 0, -1][d];
    const dy = this.speed * dt * [1, 0, -1, 0][d];
    this.pos.x += dx;
    this.pos.y += dy;

    if (this.pos.x < this.radius) {
      this.pos.x = this.radius - (this.pos.x - this.radius);
    } else if (this.pos.x >= this.world.width - this.radius) {
      this.pos.x = this.world.width - this.radius - (this.pos.x - this.world.width + this.radius);
    }

    if (this.pos.y < this.radius) {
      this.pos.y = this.radius - (this.pos.y - this.radius);
    } else if (this.pos.y >= this.world.height - this.radius) {
      this.pos.y = this.world.height - this.radius - (this.pos.y - this.world.height + this.radius);
    }

    const cost = Settings.bugs.energyCost;
    this.energy -= cost.movement * Math.sqrt(dx * dx + dy * dy);
    this.energy -= cost.metabolism * this.radius ** 2;
    this.energy -= cost.heatLoss * this.radius;
  }

  kill(): void {
    this.energy = 0;
  }

  get isAlive(): boolean {
    return this.energy < this.survivalEnergy;
  }

  private get radius(): number {
    return Math.sqrt(this.energy * Settings.bugs.pixelsPerEnergy);
  }

  // deprecated
  get x(): number {
    return this.pos.x;
  }

  get y(): number {
    return this.pos.y;
  }
}
