import FFT from "fft.js"

export interface SpectralFeatures {
  energy: number
  logEnergy: number
  spectralPeak: number
  peakFrequency: number
  spectralEntropy: number
  spectralCentroid: number
  spectralFlux: number
}

let previousSpectrum: number[] = []

export function computeFeatures(samples: number[], sampleRate = 44100): SpectralFeatures {
  const fft = new FFT(samples.length)
  const out = fft.createComplexArray()
  const data = fft.createComplexArray()

  // Prepare FFT input
  for (let i = 0; i < samples.length; i++) {
    data[2 * i] = samples[i]
    data[2 * i + 1] = 0
  }

  fft.transform(out, data)

  // Compute magnitude spectrum
  const magnitudes: number[] = []
  let energy = 0
  let peak = 0
  let peakIndex = 0

  for (let i = 0; i < out.length; i += 2) {
    const mag = Math.sqrt(out[i] ** 2 + out[i + 1] ** 2)
    magnitudes.push(mag)
    energy += mag
    if (mag > peak) {
      peak = mag
      peakIndex = i / 2
    }
  }

  // True Spectral Entropy (Shannon entropy)
  const spectralEntropy = computeSpectralEntropy(magnitudes, energy)

  // Spectral Centroid (perceived brightness)
  const spectralCentroid = computeSpectralCentroid(magnitudes, sampleRate, samples.length)

  // Spectral Flux (rate of change)
  const spectralFlux = computeSpectralFlux(magnitudes, previousSpectrum)
  previousSpectrum = magnitudes

  // Peak frequency in Hz
  const peakFrequency = (peakIndex * sampleRate) / samples.length

  return {
    energy,
    logEnergy: Math.log(energy + 1),
    spectralPeak: peak,
    peakFrequency,
    spectralEntropy,
    spectralCentroid,
    spectralFlux
  }
}

function computeSpectralEntropy(magnitudes: number[], totalEnergy: number): number {
  if (totalEnergy === 0) return 0

  let entropy = 0
  for (const mag of magnitudes) {
    const p = mag / totalEnergy
    if (p > 0) {
      entropy -= p * Math.log2(p)
    }
  }

  return entropy
}

function computeSpectralCentroid(magnitudes: number[], sampleRate: number, fftSize: number): number {
  let numerator = 0
  let denominator = 0

  for (let i = 0; i < magnitudes.length; i++) {
    const freq = (i * sampleRate) / fftSize
    numerator += freq * magnitudes[i]
    denominator += magnitudes[i]
  }

  return denominator > 0 ? numerator / denominator : 0
}

function computeSpectralFlux(current: number[], previous: number[]): number {
  if (previous.length === 0) return 0

  let flux = 0
  const len = Math.min(current.length, previous.length)

  for (let i = 0; i < len; i++) {
    const diff = current[i] - previous[i]
    flux += diff * diff
  }

  return Math.sqrt(flux / len)
}
