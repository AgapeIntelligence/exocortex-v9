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
      // Generate mock spectrum from features for visualization
      if (event.detail.features) {
        const energy = event.detail.features.energy || 0
        const peak = event.detail.features.spectralPeak || 0
        const newSpectrum = Array.from({ length: 32 }).map((_, i) => {
          const baseLevel = (energy / 100) * Math.random()
          const peakLevel = i === Math.floor((peak / 100) * 31) ? energy / 50 : 0
          return Math.max(baseLevel, peakLevel)
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

      ctx.fillStyle = `hsl(${hue}, 100%, ${50 + value * 10}%)`
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

      <div style={{ fontSize: 12, color: "#e5e5e5" }}>
        {features ? (
          <>
            <div>Energy: {features.energy?.toFixed(4)}</div>
            <div>Spectral Peak: {features.spectralPeak?.toFixed(4)}</div>
            <div>Entropy: {features.entropy?.toFixed(4)}</div>
          </>
        ) : (
          <div style={{ color: "#666" }}>Waiting for voice input...</div>
        )}
      </div>
    </div>
  )
}