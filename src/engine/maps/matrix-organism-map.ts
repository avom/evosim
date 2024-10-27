import { Organism } from "../organism";
import { OrganismMap } from "./organism-map";

export class MatrixOrganismMap implements OrganismMap {
  private readonly width: number;
  private readonly height: number;
  private readonly map: Organism[][][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.map = [];
    for (let x = width - 1; x >= 0; x--) {
      this.map[x] = [];
      for (let y = height - 1; y >= 0; y--) {
        this.map[x][y] = [];
      }
    }
  }

  getAllWithinRadius(x: number, y: number, r: number): Organism[] {
    const result: Organism[] = [];

    const x0 = Math.max(Math.floor(x - r), 0);
    const x1 = Math.min(Math.ceil(x + r), this.width - 1);
    const y0 = Math.max(Math.floor(y - r), 0);
    const y1 = Math.min(Math.ceil(y + r), this.height - 1);

    for (let xi = x0; xi <= x1; xi++) {
      for (let yi = y0; yi < y1; yi++) {
        for (const organism of this.map[xi][yi]) {
          if (!organism.isAlive) {
            continue;
          }

          const dx = organism.x - x;
          const dy = organism.y - y;
          if (dx * dx + dy * dy <= r * r) {
            result.push(organism);
          }
        }
      }
    }

    return result;
  }

  optimize(): void {}

  move(organism: Organism, fromX: number, fromY: number) {
    const oldX = Math.floor(fromX);
    const oldY = Math.floor(fromY);
    const newX = Math.floor(organism.x);
    const newY = Math.floor(organism.y);
    if (oldX == newX && oldY == newY) {
      return;
    }

    const idx = this.map[oldX][oldY].indexOf(organism);
    if (idx >= 0) {
      this.map[oldX][oldY].splice(idx, 1);
    }
    this.map[newX][newY].push(organism);
  }

  add(organism: Organism) {
    const x = Math.floor(organism.x);
    const y = Math.floor(organism.y);
    try {
    this.map[x][y].push(organism);
    } catch(error) {
      debugger;
      throw error;
    }
  }

  remove(organism: Organism) {
    const x = Math.floor(organism.x);
    const y = Math.floor(organism.y);

    const idx = this.map[x][y].indexOf(organism);
    if (idx >= 0) {
      this.map[x][y].splice(idx, 1);
    }
  }
}
