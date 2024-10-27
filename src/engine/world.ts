import { BlueBug } from "./blue-bug";
import { Organism } from "./organism";
import { OrganismMap } from "./maps/organism-map";
import { Plant } from "./plant";
import { Settings } from "./settings";
import { LinearOrganismMap } from "./maps/linear-organism-map";
import { MatrixOrganismMap } from "./maps/matrix-organism-map";

export class World {
  readonly width: number;
  readonly height: number;

  private organisms: Organism[] = [];
  private organismCount = 0;
  private readonly map: OrganismMap;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.map = new LinearOrganismMap();
    this.map = new MatrixOrganismMap(width, height);
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.organismCount; i++) {
      const organism = this.organisms[i];
      if (organism.isAlive && organism instanceof Plant) {
        organism.draw(context);
      }
    }

    for (let i = 0; i < this.organismCount; i++) {
      const organism = this.organisms[i];
      if (organism.isAlive && organism instanceof BlueBug) {
        organism.draw(context);
      }
    }
  }

  tick(dt: number): void {
    const t0 = performance.now();
    for (let i = 0; i < this.organismCount; i++) {
      const organism = this.organisms[i];
      const oldX = Math.floor(organism.x);
      const oldY = Math.floor(organism.y);

      organism.tick(dt);

      this.map.move(organism, oldX, oldY);
    }
    const t1 = performance.now();
    this.map.optimize();
    const t2 = performance.now();

    let count = 0;
    for (let i = 0; i < this.organismCount; i++) {
      const organism = this.organisms[i];
      if (organism.isAlive) {
        this.organisms[count++] = organism;
      } else {
        this.map.remove(organism);
      }
    }
    this.organismCount = count;
    const t3 = performance.now();
    // console.log((t1 - t0) + ' ' + (t2 - t1) + ' ' + (t3 - t2) + ' ' + this.organismCount);
  }

  init() {
    const plantCount = Math.round(this.width * this.height * Settings.plants.initialDensity);
    for (let i = 0; i < plantCount; i++) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      const plant = new Plant(this, x, y, Settings.plants.initialEnergy);
      this.organisms.push(plant);
      this.map.add(plant);
    }

    const bluebugCount = Settings.bugs.blue.initialCount;
    for (let i = 0; i < bluebugCount; i++) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      const bug = new BlueBug(this, x, y, Settings.bugs.blue.initialEnergy);
      this.organisms.push(bug);
      this.map.add(bug);
    }

    this.organismCount = this.organisms.length;
  }

  add(organism: Organism) {
    this.organisms[this.organismCount++] = organism;
    this.map.add(organism);
  }

  killPlantsInAreaAndReturnEnergy(x: number, y: number, r: number): number {
    let result = 0;
    const organisms = this.map.getAllWithinRadius(x, y, r);
    for (const organism of organisms) {
      if (organism.isAlive && (organism instanceof Plant)) {
        result += organism.energy;
        organism.kill();
      }
    }
    return result;
  }

}
