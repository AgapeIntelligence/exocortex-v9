"use client"

import { useState, useRef } from "react"

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [features, setFeatures] = useState<any>(null)
  const [agents, setAgents] = useState<any>(null)
  const [status, setStatus] = useState("ready")
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyzerRef = useRef<AnalyserNode | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  async function startRecording() {
    try {
      setStatus("initializing...")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      const source = audioContext.createMediaStreamSource(stream)
      const analyzer = audioContext.createAnalyser()
      analyzer.fftSize = 2048
      analyzerRef.current = analyzer

      source.connect(analyzer)

      // Create ScriptProcessor for real-time audio data
      const processor = audioContext.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor

      processor.onaudioprocess = async (event) => {
        const inputData = event.inputBuffer.getChannelData(0)
        const samples = Array.from(inputData)

        // Send to voice API for FFT feature extraction
        try {
          const response = await fetch("/api/voice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ samples }),
          })
          const data = await response.json()
          setFeatures(data.features)

          // Step agents with new features
          const stepResponse = await fetch("/api/step", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.features),
          })
          const stepData = await stepResponse.json()
          setAgents(stepData.agents)
          setStatus(`Energy: ${(data.features.energy).toFixed(2)} | Entropy: ${(data.features.entropy).toFixed(2)}`)
        } catch (error) {
          console.error("API error:", error)
        }
      }

      analyzer.connect(processor)
      processor.connect(audioContext.destination)

      setIsRecording(true)
      setStatus("recording...")
    } catch (error) {
      setStatus("error: " + (error as Error).message)
      console.error("Recording error:", error)
    }
  }

  function stopRecording() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (processorRef.current) {
      processorRef.current.disconnect()
    }
    if (analyzerRef.current) {
      analyzerRef.current.disconnect()
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
    setIsRecording(false)
    setStatus("stopped")
  }

  return (
    <div style={{ marginTop: 20, padding: 10, border: "1px solid #16213e" }}>
      <h2>Voice Field Recorder</h2>
      <div style={{ marginBottom: 10 }}>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop Voice Field" : "Start Voice Field"}
        </button>
      </div>
      <div style={{ fontSize: 12, color: "#00d4ff" }}>Status: {status}</div>
      {features && (
        <div style={{ fontSize: 12, marginTop: 10, color: "#e5e5e5" }}>
          <div>Energy: {features.energy?.toFixed(4)}</div>
          <div>Peak: {features.spectralPeak?.toFixed(4)}</div>
          <div>Entropy: {features.entropy?.toFixed(4)}</div>
        </div>
      )}
      {agents && (
        <div style={{ fontSize: 12, marginTop: 10, color: "#e5e5e5" }}>
          <div>Agents: {agents.length}</div>
          <div>Avg Attention: {(agents.reduce((sum: number, a: any) => sum + a.attention, 0) / agents.length).toFixed(2)}</div>
        </div>
      )}
    </div>
  )
}
