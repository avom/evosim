export const Settings = {
  plants: {
    initialDensity: 0.03,
    offspringChancePerSec: 0.01,
    maxSeedRange: 10,
    initialEnergy: 1000,
    energyGrowthPerSec: 10
  },
  bugs: {
    blue: {
      initialCount: 500,
      initialEnergy: 30_000,
      survivalEnergy: 10_000,
    },
    red: {
      initialCount: 50,
      initialEnergy: 100_000,
      survivalEnergy: 30_000,
    },
    energyCost: {
      movement: 1.0,
      metabolism: 1.0,
      heatLoss: 1.0,
    }
}
}
