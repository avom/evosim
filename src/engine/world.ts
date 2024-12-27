import { BlueBug } from "./blue-bug";
import { Organism } from "./organism";
import { OrganismMap } from "./maps/organism-map";
import { Eatable, Plant } from "./plant";
import { Settings } from "./settings";
import { LinearOrganismMap } from "./maps/linear-organism-map";
import { MatrixOrganismMap } from "./maps/matrix-organism-map";
import { RedBug } from "./red-bug";
import { Circle } from "./types";

export interface EdiblePlantFinder {
  getEdiblePlantsInRadius(area: Circle): Eatable[];
}

export class World implements EdiblePlantFinder {
  readonly width: number;
  readonly height: number;

  private organisms: Organism[] = [];
  private organismCount = 0;
  private readonly map: OrganismMap;

  private lastOrganismId = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.map = new LinearOrganismMap();
    this.map = new MatrixOrganismMap(width, height);
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, this.width, this.height);

    const drawingOrder = [Plant, BlueBug, RedBug];
    // const drawingOrder = [BlueBug, Plant, RedBug];

    for (const organismType of drawingOrder) {
      for (let i = 0; i < this.organismCount; i++) {
        const organism = this.organisms[i];
        if (organism.isAlive && organism instanceof organismType) {
          organism.draw(context);
        }
      }
    }
  }

  tick(dt: number): void {
    // const _t0 = performance.now();
    for (let i = 0; i < this.organismCount; i++) {
      const organism = this.organisms[i];
      const oldX = Math.floor(organism.x);
      const oldY = Math.floor(organism.y);

      organism.tick(dt);

      this.map.move(organism, oldX, oldY);
    }
    // const _t1 = performance.now();
    this.map.optimize();
    // const _t2 = performance.now();

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
    // const _t3 = performance.now();
    // console.log((t1 - t0) + ' ' + (t2 - t1) + ' ' + (t3 - t2) + ' ' + this.organismCount);
  }

  init() {
    const plantCount = Math.round(this.width * this.height * Settings.plants.initialDensity);
    for (let i = 0; i < plantCount; i++) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      const energy =
        Math.random() * (Settings.plants.maxEnergy - Settings.plants.seedEnergy) +
        Settings.plants.seedEnergy;
      const plant = new Plant(this, 1, x, y, energy);
      this.organisms.push(plant);
      this.map.add(plant);
    }

    const bluebugCount = Settings.bugs.blue.initialCount;
    for (let i = 0; i < bluebugCount; i++) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      const bug = new BlueBug(this, 1, x, y, Settings.bugs.blue.initialEnergy);
      this.organisms.push(bug);
      this.map.add(bug);
    }

    const redbugCount = Settings.bugs.red.initialCount;
    for (let i = 0; i < redbugCount; i++) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      const bug = new RedBug(this, 1, x, y, Settings.bugs.red.initialEnergy);
      this.organisms.push(bug);
      this.map.add(bug);
    }

    this.organismCount = this.organisms.length;
  }

  add(organism: Organism) {
    if (organism instanceof Plant) {
      if (this.map.isAlivePlantAtCell(organism.x, organism.y)) {
        // Don't seed a new plant when there's one already growing at the location (cell)
        // Effectively the new plant immediately dies
        return;
      }
    }

    this.organisms[this.organismCount++] = organism;
    this.map.add(organism);
  }

  getEdiblePlantsInRadius(area: Circle): Plant[] {
    const organisms = this.map.getAllWithinRadius(area.center.x, area.center.y, area.r);
    const plants = organisms.filter((o) => o instanceof Plant) as Plant[];
    return plants.filter((p) => p.isEdible);
  }

  killRandomEdiblePlantInRadiusAndReturnEnergy(x: number, y: number, r: number): number {
    const organisms = this.map.getAllWithinRadius(x, y, r);
    const ediblePlants = organisms.filter((o) => o.isAlive && o instanceof Plant && o.isEdible);
    if (ediblePlants.length == 0) {
      return 0;
    }

    const idx = Math.floor(Math.random() * ediblePlants.length);
    const plant = ediblePlants[idx];
    const energy = plant.energy;
    plant.kill();
    return energy;
  }

  killRandomBlueBugInRadiusAndReturnEnergy(x: number, y: number, r: number) {
    const organisms = this.map.getAllWithinRadius(x, y, r);
    const blues = organisms.filter((o) => o.isAlive && o instanceof BlueBug);
    if (blues.length == 0) {
      return 0;
    }

    const idx = Math.floor(Math.random() * blues.length);
    const bug = blues[idx];
    const energy = bug.energy;
    bug.kill();
    return energy;
  }

  getOrganismCount(type: typeof Plant | typeof BlueBug | typeof RedBug): number {
    let result = 0;
    for (let i = 0; i < this.organismCount; i++) {
      const organism = this.organisms[i];
      if (organism.isAlive && organism instanceof type) {
        result++;
      }
    }
    return result;
  }

  nextOrganismId(): number {
    return ++this.lastOrganismId;
  }

  selectBugAt(x: number, y: number): Organism | null {
    let closest: Organism | null = null;
    let closestDist: number = 0;
    const organisms = this.map.getAllWithinRadius(x, y, Settings.ui.bugSelectRange);
    for (const organism of organisms) {
      if (organism instanceof BlueBug || organism instanceof RedBug || organism.isAlive) {
        const d = (organism.x - x) ** 2 + (organism.y - y) ** 2;
        if (closest == null || closestDist > d) {
          closest = organism;
          closestDist = d;
        }
      }
    }
    return closest;
  }

}
