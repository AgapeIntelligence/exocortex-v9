export type Agent = {
  id: string
  state: number[]
  attention: number
}

export function stepAgents(agents: Agent[], input: any) {
  return agents.map((a) => {
    const drift = input.energy * 0.01
    return {
      ...a,
      state: a.state.map(v => v + (Math.random() - 0.5) * drift),
      attention: Math.min(1, a.attention + input.entropy * 0.01)
    }
  })
}

export function createAgents(n = 5): Agent[] {
  return Array.from({ length: n }).map((_, i) => ({
    id: `agent_${i}`,
    state: [Math.random(), Math.random(), Math.random()],
    attention: Math.random()
  }))
}
