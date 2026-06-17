import { Agent } from "./agentEngine"

export function computeField(agents: Agent[]) {
  const avg = agents.reduce(
    (acc, a) => {
      acc.x += a.state[0]
      acc.y += a.state[1]
      acc.z += a.state[2]
      return acc
    },
    { x: 0, y: 0, z: 0 }
  )

  return {
    stateField: {
      x: avg.x / agents.length,
      y: avg.y / agents.length,
      z: avg.z / agents.length
    }
  }
}
