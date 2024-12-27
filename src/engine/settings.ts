export interface BugFeatures {
  color: string;
  energyAtBirth: number;
  survivalEnergyThreshold: number;
  mouthSpeed: number;
  speed: number;
}

export const Settings = {
  ui: {
    bugSelectRange: 10,
  },
  general: {
    maxFrameDurationSeconds: 0.1,
  },
  plants: {
    initialDensity: 0.03,
    offspringChancePerSec: 0.005,
    maxSeedRange: 100,
    seedEnergy: 10,
    energyGrowthPerSec: 5,
    edibleAtEnergy: 0,
    maxEnergy: 1000,
  },
  bugs: {
    pixelsPerEnergy: 0.0002,
    blue: {
      features: {
        color: "#00f",
        mouthSpeed: 100,
        speed: 30, // pixels per second
        energyAtBirth: 30_000,
        survivalEnergyThreshold: 0.33,
        digestionEfficiency: {
          plant: 1.0,
          meat: 0.0
        }
      },
      initialCount: 10,

      // deprecated
      initialEnergy: 30_000,
      survivalEnergy: 10_000,
    },
    red: {
      initialCount: 1,
      initialEnergy: 100_000,
      survivalEnergy: 30_000,
    },
    genes: {
      mutation: {
        factor: 1.2,
      },
    },
    energyCost: {
      movement: 1.0,
      metabolism: 1.0,
      heatLoss: 1.0,
    },
  },
};
