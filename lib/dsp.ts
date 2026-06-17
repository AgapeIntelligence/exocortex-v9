import FFT from "fft.js"

export function computeFeatures(samples: number[]) {
  const fft = new FFT(samples.length)
  const out = fft.createComplexArray()
  const data = fft.createComplexArray()

  for (let i = 0; i < samples.length; i++) {
    data[2 * i] = samples[i]
    data[2 * i + 1] = 0
  }

  fft.transform(out, data)

  let energy = 0
  let peak = 0

  for (let i = 0; i < out.length; i += 2) {
    const mag = Math.sqrt(out[i] ** 2 + out[i + 1] ** 2)
    energy += mag
    if (mag > peak) peak = mag
  }

  return {
    energy,
    spectralPeak: peak,
    entropy: Math.log(energy + 1)
  }
}
