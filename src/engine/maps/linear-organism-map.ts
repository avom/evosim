import { Organism } from "../organism";
import { Plant } from "../plant";
import { OrganismMap } from "./organism-map";

export class LinearOrganismMap implements OrganismMap {

  private readonly organisms: (Organism | null)[] = [];
  private count = 0;
  
  add(organism: Organism): void {
    this.organisms[this.count++] = organism;
  }

  remove(organism: Organism): void {
    const idx = this.organisms.indexOf(organism);
    if (idx < 0) {
      return;
    }

    this.organisms[idx] = null;
  }

  move(_organism: Organism, _fromX: number, _fromY: number): void {
    // nop, not relevant
  }

  getAllWithinRadius(x: number, y: number, r: number): Organism[] {
    const result: Organism[] = [];
    for (let i = 0; i < this.count; i++) {
      const organism = this.organisms[i];
      if (organism && organism.isAlive) {
        const dx = organism.x - x;
        const dy = organism.y - y;
        if (dx * dx  + dy * dy <= r * r) {
          result.push(organism);
        }
      }
    }
    return result;
  }

  isAlivePlantAtCell(x: number, y: number): boolean {
    const cellX = Math.floor(x);
    const cellY = Math.floor(y);
    for (const organism of this.organisms) {
      if (!organism || !organism.isAlive || !(organism instanceof Plant)) {
        continue;
      }

      const orgX = Math.floor(organism.x);
      const orgY = Math.floor(organism.y);
      if (cellX == orgX && cellY == orgY) {
        return true;
      }
    }
    return false;
  }

  optimize(): void {
    let count = 0;
    for (let i = 0; i < this.count; i++) {
      if (this.organisms[i] != null) {
        this.organisms[count++] = this.organisms[i];
      }
    }
    this.count = count;
  }
}