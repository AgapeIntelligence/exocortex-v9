import { stepAgents, createAgents } from "@/lib/agentEngine"
import { computeField } from "@/lib/field"

let agents = createAgents()

export async function POST(req: Request) {
  const input = await req.json()
  agents = stepAgents(agents, input)
  return Response.json({
    agents,
    field: computeField(agents)
  })
}
