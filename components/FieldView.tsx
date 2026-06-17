"use client"

import { useState, useEffect } from "react"

export default function FieldView() {
  const [field, setField] = useState<any>(null)
  const [agents, setAgents] = useState<any[]>([])

  useEffect(() => {
    // Listen for agent updates from VoiceRecorder via custom event
    const handleAgentUpdate = (event: any) => {
      setAgents(event.detail.agents || [])
      setField(event.detail.field)
    }

    window.addEventListener("agentUpdate", handleAgentUpdate)
    return () => window.removeEventListener("agentUpdate", handleAgentUpdate)
  }, [])

  const canvasWidth = 400
  const canvasHeight = 300
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2
  const scale = 60

  return (
    <div style={{ marginTop: 20, padding: 10, border: "1px solid #16213e" }}>
      <h2>State Field (Agent Ecology)</h2>
      
      <svg
        width={canvasWidth}
        height={canvasHeight}
        style={{
          background: "#0a0a0e",
          border: "1px solid #1a1a2e",
          marginBottom: 10,
        }}
      >
        {/* Grid */}
        <line x1={centerX} y1="0" x2={centerX} y2={canvasHeight} stroke="#16213e" strokeWidth="1" />
        <line x1="0" y1={centerY} x2={canvasWidth} y2={centerY} stroke="#16213e" strokeWidth="1" />

        {/* Agent nodes */}
        {agents.map((agent: any, i: number) => {
          const x = centerX + (agent.state?.[0] || 0) * scale
          const y = centerY + (agent.state?.[1] || 0) * scale
          const attention = agent.attention || 0
          const radius = 5 + attention * 5
          const brightness = Math.floor(100 + attention * 155)
          const color = `hsl(200, 100%, ${brightness / 2}%)`

          return (
            <g key={agent.id}>
              {/* Attention aura */}
              <circle
                cx={x}
                cy={y}
                r={radius + 3}
                fill="none"
                stroke={color}
                strokeWidth="1"
                opacity={attention * 0.6}
              />
              {/* Agent node */}
              <circle
                cx={x}
                cy={y}
                r={radius}
                fill={color}
                opacity={0.8}
              />
              {/* Label */}
              <text
                x={x}
                y={y + radius + 12}
                fontSize="10"
                fill="#00d4ff"
                textAnchor="middle"
              >
                {agent.id.slice(-1)} ({(agent.attention).toFixed(2)})
              </text>
            </g>
          )
        })}
      </svg>

      <div style={{ fontSize: 12, color: "#e5e5e5" }}>
        <div>Agents Active: {agents.length}</div>
        {field?.stateField && (
          <>
            <div>Field Center X: {field.stateField.x.toFixed(3)}</div>
            <div>Field Center Y: {field.stateField.y.toFixed(3)}</div>
            <div>Field Center Z: {field.stateField.z.toFixed(3)}</div>
          </>
        )}
      </div>
    </div>
  )
}