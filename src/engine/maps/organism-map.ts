import { Organism } from "../organism";

// The suffix Map here may be confusing, because it's not related to JavaScript Map class, but I
// haven't gotten any better ideas.
export interface OrganismMap {

  add(organism: Organism): void;
  remove(organism: Organism): void;

  move(organism: Organism, fromX: number, fromY: number): void;
  
  getAllWithinRadius(x: number, y: number, r: number): Organism[];

  optimize(): void;
}