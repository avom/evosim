import { BlueBug } from "../blue-bug";
import { OrganismMap } from "./organism-map";
import { World } from "../world";
import { Settings } from "../settings";
import { Plant } from "../plant";

export const commentOrganismMapTests = (name: string, createSut: () => OrganismMap) => {
  const world = new World(100, 100);

  describe(`OrganismMap implementation ${name}`, () => {
    describe("move(organism, fromX, fromY)", () => {
      const sut = createSut();
      const organism = new BlueBug(world, 1, 10, 10, Settings.bugs.blue.initialEnergy);
      sut.add(organism);
      organism.x = 20;
      organism.y = 20;
      sut.move(organism, 10, 10);

      it("ensures that organism can not be found in its old location", () => {
        const organismsInRadius = sut.getAllWithinRadius(10, 10, 1);
        expect(organismsInRadius).toEqual([]);
      });

      it("ensures that organism can be found in its current location", () => {
        const organismsInRadius = sut.getAllWithinRadius(organism.x, organism.y, 1);
        expect(organismsInRadius).toHaveLength(1);
        expect(organismsInRadius[0]).toBe(organism);
      });
    });

    describe("getAllWithinRadius()", () => {
      it("returns empty array when noone is within search radius", () => {
        const sut = createSut();
        const result = sut.getAllWithinRadius(10, 10, 3);
        expect(result).toEqual([]);
      });

      it("returns all organisms within search radius", () => {
        const sut = createSut();
        sut.add(new BlueBug(world, 1, 10, 10, Settings.bugs.blue.initialEnergy));
        sut.add(new BlueBug(world, 1, 11, 11, Settings.bugs.blue.initialEnergy));
        const result = sut.getAllWithinRadius(10, 10, 3);
        expect(result).toHaveLength(2);
      });

      it("does not return organisms outside of search radius", () => {
        const sut = createSut();
        sut.add(new BlueBug(world, 1, 20, 20, Settings.bugs.blue.initialEnergy));
        const result = sut.getAllWithinRadius(10, 10, 10);
        expect(result).toEqual([]);
      });

      it("does not return dead bugs", () => {
        const sut = createSut();
        sut.add(new BlueBug(world, 1, 10, 10, 0));
        const result = sut.getAllWithinRadius(10, 10, 10);
        expect(result).toEqual([]);
      });
    });

    describe("remove()", () => {
      it("removes organism from the map", () => {
        const sut = createSut();
        const bug = new BlueBug(world, 1, 10, 10, Settings.bugs.blue.initialEnergy);
        sut.add(bug);

        sut.remove(bug);

        const result = sut.getAllWithinRadius(10, 10, 10);
        expect(result).not.toContain(bug);
      });
    });

    describe("isPlantAtCell(x, y)", () => {
      it('returns true if there is a plant with coordinates px, py such that' +
        'floor(x) <= px < floor(x + 1) and floor(y) <= py < floor(y + 1)', () => {
        const sut = createSut();
        sut.add(new Plant(world, 1, 10.9, 10, Settings.plants.seedEnergy));

        const result = sut.isAlivePlantAtCell(10.9, 10.1);
        expect(result).toBe(true);
      });

      it('returns false if there are no plants with coordinates px, py such that' +
        'floor(x) <= px < floor(x + 1) and floor(y) <= py < floor(y + 1)', () => {
        const sut = createSut();
        sut.add(new Plant(world, 1, 10, 9.9, Settings.plants.seedEnergy));
        sut.add(new Plant(world, 1, 11, 10, Settings.plants.seedEnergy));
        sut.add(new BlueBug(world, 1, 10, 10, Settings.bugs.blue.initialEnergy));

        const result = sut.isAlivePlantAtCell(10.9, 10.1);
        expect(result).toBe(false);
      });
    });
  });
};
