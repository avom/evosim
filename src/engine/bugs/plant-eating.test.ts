import { Circle } from "../types";
import { EdiblePlantFinder } from "../world";
import { consumeNearbyPlants } from "./plant-eating";

describe("consumeNearbyPlants()", () => {
  it("returns 0 when no plants are in the area", () => {
    const area = { center: {x: 10, y: 10}, r: 3 };
    const world: EdiblePlantFinder = {
      getEdiblePlantsInRadius: (_area: Circle) => []
    };

    const consumedEnergy = consumeNearbyPlants(area, world, 1000);
    expect(consumedEnergy).toBe(0);
  });

  it("consumes all plants when energy consumption limit is not reached", () => {
    const area = { center: {x: 10, y: 10}, r: 3 };
    const world: EdiblePlantFinder = {
      getEdiblePlantsInRadius: (_area: Circle) => [
        { energy: 10},
        { energy: 20 },
        { energy: 30 }
      ]
    };

    const consumedEnergy = consumeNearbyPlants(area, world, 1000);
    expect(consumedEnergy).toBe(60);
  });

  it("consumes only upto as much energy as the limit", () => {
    const area = { center: {x: 10, y: 10}, r: 3 };
    const world: EdiblePlantFinder = {
      getEdiblePlantsInRadius: (_area: Circle) => [
        { energy: 10},
        { energy: 20 },
        { energy: 30 }
      ]
    };

    const consumedEnergy = consumeNearbyPlants(area, world, 35);
    expect(consumedEnergy).toBe(35);
  });

  it("leaves the last plant alive with reduced energy if it was too big to consume at once", () => { 
    const plant = { energy: 40 };
    const area = { center: {x: 10, y: 10}, r: 3 };

    const world: EdiblePlantFinder = {
      getEdiblePlantsInRadius: (_area: Circle) => [plant]
    };
    
    consumeNearbyPlants(area, world, 35);

    expect(plant.energy).toEqual(5);
  });
});