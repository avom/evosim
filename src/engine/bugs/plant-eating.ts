import { Circle } from "../types";
import { shuffleArrayInPlace } from "../utils";
import { EdiblePlantFinder } from "../world";

export function consumeNearbyPlants(
  area: Circle,
  world: EdiblePlantFinder,
  maxEnergyConsumed: number
): number {
  const plants = world.getEdiblePlantsInRadius(area);
  shuffleArrayInPlace(plants);

  let totalConsumedEnergy = 0;
  for (const plant of plants) {
    totalConsumedEnergy += plant.energy;
    plant.energy = 0;
    if (totalConsumedEnergy >= maxEnergyConsumed) {
      break;
    }
  }

  return totalConsumedEnergy;
}
