"use client"

import { useState, useEffect, useRef } from "react"

export default function PSIView() {
  const [features, setFeatures] = useState<any>(null)
  const [spectrum, setSpectrum] = useState<number[]>(new Array(32).fill(0))
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Listen for feature updates from VoiceRecorder via custom event
    const handleFeatureUpdate = (event: any) => {
      setFeatures(event.detail.features)
      // Generate spectrum from features for visualization
      if (event.detail.features) {
        const energy = event.detail.features.energy || 0
        const centroid = event.detail.features.spectralCentroid || 0
        const entropy = event.detail.features.spectralEntropy || 0
        
        // Create spectrum visualization based on centroid and entropy
        const newSpectrum = Array.from({ length: 32 }).map((_, i) => {
          const freq = (i / 32) * 22050 // Half of 44.1kHz sample rate
          const distFromCentroid = Math.abs(freq - centroid) / 1000
          const baseLevel = (energy / 100) * entropy
          const centroidPeak = Math.max(0, 1 - distFromCentroid) * baseLevel
          return centroidPeak + Math.random() * 0.1
        })
        setSpectrum(newSpectrum)
      }
    }

    window.addEventListener("featureUpdate", handleFeatureUpdate)
    return () => window.removeEventListener("featureUpdate", handleFeatureUpdate)
  }, [])

  // Draw spectrum bars
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const barWidth = width / spectrum.length

    // Clear canvas
    ctx.fillStyle = "#0a0a0e"
    ctx.fillRect(0, 0, width, height)

    // Draw spectrum bars
    spectrum.forEach((value, i) => {
      const hue = (i / spectrum.length) * 360
      const barHeight = (value / 10) * height
      const x = i * barWidth

      ctx.fillStyle = `hsl(${hue}, 100%, ${50 + Math.min(value * 20, 100)}%)`
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight)
    })

    // Draw baseline
    ctx.strokeStyle = "#16213e"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, height)
    ctx.lineTo(width, height)
    ctx.stroke()
  }, [spectrum])

  return (
    <div style={{ marginTop: 20, padding: 10, border: "1px solid #16213e" }}>
      <h2>PSI Field (Voice Spectral Signatures)</h2>

      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        style={{
          background: "#0a0a0e",
          border: "1px solid #1a1a2e",
          marginBottom: 10,
          display: "block",
        }}
      />

      <div style={{ fontSize: 11, color: "#e5e5e5", lineHeight: "1.6" }}>
        {features ? (
          <>
            <div><strong>Energy:</strong> {features.energy?.toFixed(2)} (total amplitude)</div>
            <div><strong>Log Energy:</strong> {features.logEnergy?.toFixed(3)} (compressed)</div>
            <div><strong>Spectral Entropy:</strong> {features.spectralEntropy?.toFixed(3)} (complexity: 0=pure tone, 4+=noise)</div>
            <div><strong>Spectral Centroid:</strong> {features.spectralCentroid?.toFixed(0)} Hz (brightness: low=warm, high=bright)</div>
            <div><strong>Peak Frequency:</strong> {features.peakFrequency?.toFixed(0)} Hz (dominant frequency)</div>
            <div><strong>Spectral Flux:</strong> {features.spectralFlux?.toFixed(3)} (change rate: high=dynamic)</div>
          </>
        ) : (
          <div style={{ color: "#666" }}>Waiting for voice input...</div>
        )}
      </div>
    </div>
  )
}