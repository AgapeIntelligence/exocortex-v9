export function createPSI(features: any) {
  return {
    cadence: Math.random(),
    pause_density: Math.random(),
    spectral_energy: features.energy,
    entropy: features.entropy,
    timestamp: Date.now()
  }
}
